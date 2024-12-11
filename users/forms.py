from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser, Message

class UserRegistrationForm(UserCreationForm):
    full_name = forms.CharField(max_length=255)
    role = forms.ChoiceField(choices=CustomUser.ROLE_CHOICES)
    teacher = forms.ModelChoiceField(
        queryset=CustomUser.objects.filter(role='teacher'),
        required=False,
        empty_label="Select a teacher (for students only)"
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'full_name', 'role', 'teacher', 'password1', 'password2')

    def clean(self):
        cleaned_data = super().clean()
        role = cleaned_data.get('role')
        teacher = cleaned_data.get('teacher')

        if role == 'student' and not teacher:
            raise forms.ValidationError("Students must be assigned to a teacher")
        elif role == 'teacher' and teacher:
            cleaned_data['teacher'] = None

        return cleaned_data

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['teacher'].queryset = CustomUser.objects.filter(role='teacher')

class UserProfileForm(UserChangeForm):
    password = None  # Remove password field from the form

    class Meta:
        model = CustomUser
        fields = ('full_name', 'bio', 'profile_picture', 'phone_number', 'whatsapp_number')
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 4}),
        }

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Type your message here...'}),
        }
