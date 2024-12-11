from django.db import models
from django.utils import timezone
from users.models import CustomUser

class Assignment(models.Model):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    max_score = models.IntegerField(default=100)
    attachment = models.FileField(upload_to='assignments/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    @property
    def is_overdue(self):
        return timezone.now() > self.due_date

class Submission(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('late', 'Late'),
        ('graded', 'Graded'),
    )
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    attachment = models.FileField(upload_to='submissions/', blank=True, null=True)

    class Meta:
        unique_together = ['assignment', 'student']

    def save(self, *args, **kwargs):
        if not self.pk and timezone.now() > self.assignment.due_date:
            self.status = 'late'
        super().save(*args, **kwargs)

class Schedule(models.Model):
    WEEKDAYS = (
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    )
    
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    day_of_week = models.CharField(max_length=10, choices=WEEKDAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_recurring = models.BooleanField(default=True)
    color = models.CharField(max_length=7, default='#3788d8')  # Hex color code

    class Meta:
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.title} - {self.get_day_of_week_display()}"

class Announcement(models.Model):
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
