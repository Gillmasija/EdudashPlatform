from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('profile/<str:username>/', views.profile_view, name='profile'),
    path('messages/', views.messages_view, name='messages'),
    path('messages/send/<int:receiver_id>/', views.send_message, name='send_message'),
    path('api/user/', views.get_user_info, name='get_user_info'),
]
