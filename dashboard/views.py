from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Assignment, Submission, Schedule

@login_required
def dashboard_home(request):
    context = {}
    if request.user.role == 'teacher':
        context['students'] = request.user.students.all()
        context['assignments'] = Assignment.objects.filter(teacher=request.user)
        context['schedules'] = Schedule.objects.filter(teacher=request.user)
    else:  # Student
        context['assignments'] = Assignment.objects.filter(teacher=request.user.teacher)
        context['submissions'] = Submission.objects.filter(student=request.user)
        context['schedules'] = Schedule.objects.filter(teacher=request.user.teacher)
    
    return render(request, 'dashboard/dashboard.html', context)
