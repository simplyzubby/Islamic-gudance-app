"""
URL patterns for the core app.
All routes are prefixed with /api/ from backend/urls.py
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [

    # ── Auth ──────────────────────────────────────────────────────────────────
    # POST /api/auth/register/
    path('auth/register/',       views.register,            name='auth-register'),
    # POST /api/auth/token/         → returns { access, refresh }
    path('auth/token/',          TokenObtainPairView.as_view(), name='auth-token'),
    # POST /api/auth/token/refresh/ → returns { access }
    path('auth/token/refresh/',  TokenRefreshView.as_view(),    name='auth-token-refresh'),
    # GET  /api/auth/profile/
    path('auth/profile/',        views.profile,             name='auth-profile'),

    # ── Ayahs ─────────────────────────────────────────────────────────────────
    # GET /api/ayahs/           (all, or ?mood=lost)
    path('ayahs/',               views.ayah_list,           name='ayah-list'),
    # GET /api/ayahs/daily/
    path('ayahs/daily/',         views.ayah_daily,          name='ayah-daily'),
    # GET /api/ayahs/random/
    path('ayahs/random/',        views.ayah_random,         name='ayah-random'),

    # ── Habits ────────────────────────────────────────────────────────────────
    # GET /api/habits/
    path('habits/',                          views.habit_list,     name='habit-list'),
    # GET /api/habits/today/
    path('habits/today/',                    views.habit_today,    name='habit-today'),
    # POST/DELETE /api/habits/<id>/complete/
    path('habits/<int:habit_id>/complete/',  views.habit_complete, name='habit-complete'),
    # GET /api/habits/streak/
    path('habits/streak/',                   views.habit_streak,   name='habit-streak'),

    # ── Reflections ───────────────────────────────────────────────────────────
    # GET, POST /api/reflections/
    path('reflections/',          views.reflection_list,   name='reflection-list'),
    # PUT, DELETE /api/reflections/<id>/
    path('reflections/<int:pk>/', views.reflection_detail, name='reflection-detail'),

    # ── Guidance ──────────────────────────────────────────────────────────────
    # GET /api/guidance/topics/
    path('guidance/topics/', views.guidance_topics,   name='guidance-topics'),
    # GET /api/guidance/?topic=tawakkul
    path('guidance/',        views.guidance_by_topic, name='guidance-by-topic'),
]