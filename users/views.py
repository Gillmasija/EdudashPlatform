from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from .forms import UserRegistrationForm, UserProfileForm, MessageForm
from .models import CustomUser, Message

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful!')
            return redirect('dashboard')
    else:
        form = UserRegistrationForm()
    return render(request, 'users/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        from django.contrib.auth import authenticate
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'users/login.html')

@login_required
def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out.')
    return redirect('login')

@login_required
def profile_edit(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        form = UserProfileForm(instance=request.user)
    return render(request, 'users/profile_edit.html', {'form': form})

@login_required
def profile_view(request, username=None):
    if username:
        user = get_object_or_404(CustomUser, username=username)
    else:
        user = request.user
    return render(request, 'users/profile.html', {'profile_user': user})

@login_required
def messages_view(request):
    messages_sent = Message.objects.filter(sender=request.user)
    messages_received = Message.objects.filter(receiver=request.user)
    contacts = CustomUser.objects.filter(
        Q(sent_messages__receiver=request.user) | 
        Q(received_messages__sender=request.user)
    ).distinct()
    
    return render(request, 'users/messages.html', {
        'messages_sent': messages_sent,
        'messages_received': messages_received,
        'contacts': contacts
    })

@login_required
def send_message(request, receiver_id):
    receiver = get_object_or_404(CustomUser, id=receiver_id)
    
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.sender = request.user
            message.receiver = receiver
            message.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'status': 'success'})
            messages.success(request, 'Message sent successfully!')
            return redirect('messages')
    else:
        form = MessageForm()
    
    return render(request, 'users/send_message.html', {
        'form': form,
        'receiver': receiver
    })
