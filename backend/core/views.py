"""
Views for the Islamic Guidance App.

All views return JSON. Protected routes require a valid JWT Bearer token.

Endpoints:
  Auth       POST /api/auth/register/
             POST /api/auth/token/          (login)
             POST /api/auth/token/refresh/
             GET  /api/auth/profile/

  Ayahs      GET  /api/ayahs/
             GET  /api/ayahs/daily/
             GET  /api/ayahs/random/
             GET  /api/ayahs/?mood=<mood>

  Habits     GET  /api/habits/
             GET  /api/habits/today/
             POST /api/habits/<id>/complete/
             DEL  /api/habits/<id>/complete/
             GET  /api/habits/streak/

  Reflections GET  /api/reflections/
              POST /api/reflections/
              PUT  /api/reflections/<id>/
              DEL  /api/reflections/<id>/

  Guidance   GET  /api/guidance/topics/
             GET  /api/guidance/?topic=<slug>
"""

import random
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Ayah, Habit, HabitLog, Reflection, GuidanceTopic
from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    AyahSerializer,
    HabitSerializer,
    ReflectionSerializer,
    GuidanceTopicSerializer,
)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def success(data, status_code=200):
    return Response(data, status=status_code)

def error(message, status_code=400):
    return Response({'detail': message}, status=status_code)


# ─── Auth Views ───────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/auth/register/
    Body: { username, email, password, password2 }
    Returns: user profile
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Auto-create default habits for new user
        _create_default_habits(user)
        return success(UserProfileSerializer(user).data, 201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    GET /api/auth/profile/
    Returns the authenticated user's profile.
    """
    return success(UserProfileSerializer(request.user).data)


def _create_default_habits(user):
    """Create the 7 default habits for a newly registered user."""
    defaults = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'quran', 'dhikr']
    for habit_type in defaults:
        Habit.objects.get_or_create(user=user, habit_type=habit_type)


# ─── Ayah Views ───────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ayah_list(request):
    """
    GET /api/ayahs/
    GET /api/ayahs/?mood=lost
    Returns all ayahs, optionally filtered by mood.
    """
    mood = request.query_params.get('mood')
    qs = Ayah.objects.all()
    if mood:
        qs = qs.filter(mood=mood)
    return success(AyahSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ayah_daily(request):
    """
    GET /api/ayahs/daily/
    Returns a featured daily ayah, or a random one if none is featured.
    """
    ayah = Ayah.objects.filter(is_daily=True).order_by('?').first()
    if not ayah:
        ayah = Ayah.objects.order_by('?').first()
    if not ayah:
        return error('No ayahs found. Please seed the database.', 404)
    return success(AyahSerializer(ayah).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ayah_random(request):
    """
    GET /api/ayahs/random/
    Returns a single random ayah.
    """
    ayah = Ayah.objects.order_by('?').first()
    if not ayah:
        return error('No ayahs found. Please seed the database.', 404)
    return success(AyahSerializer(ayah).data)


# ─── Habit Views ──────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def habit_list(request):
    """
    GET /api/habits/
    Returns all of the user's active habits.
    """
    habits = Habit.objects.filter(user=request.user, is_active=True)
    return success(HabitSerializer(habits, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def habit_today(request):
    """
    GET /api/habits/today/
    Returns { habits: [...], completed: ['fajr', 'quran'] }
    This is what the Dashboard fetches on load.
    """
    today = timezone.now().date()
    habits = Habit.objects.filter(user=request.user, is_active=True)

    completed_ids = HabitLog.objects.filter(
        habit__in=habits,
        date=today,
        completed=True,
    ).values_list('habit__habit_type', flat=True)

    return success({
        'habits':    HabitSerializer(habits, many=True).data,
        'completed': list(completed_ids),
        'date':      str(today),
    })


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def habit_complete(request, habit_id):
    """
    POST   /api/habits/<id>/complete/   → mark habit done today
    DELETE /api/habits/<id>/complete/   → unmark habit today
    """
    try:
        habit = Habit.objects.get(id=habit_id, user=request.user)
    except Habit.DoesNotExist:
        return error('Habit not found.', 404)

    today = timezone.now().date()

    if request.method == 'POST':
        log, created = HabitLog.objects.get_or_create(
            habit=habit, date=today,
            defaults={'completed': True}
        )
        if not created:
            log.completed = True
            log.save()
        return success({'status': 'completed', 'habit': habit.habit_type, 'date': str(today)})

    elif request.method == 'DELETE':
        HabitLog.objects.filter(habit=habit, date=today).delete()
        return success({'status': 'uncompleted', 'habit': habit.habit_type, 'date': str(today)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def habit_streak(request):
    """
    GET /api/habits/streak/
    Returns current streak: how many consecutive days ALL prayers were completed.
    """
    from datetime import timedelta

    habits = Habit.objects.filter(
        user=request.user,
        habit_type__in=['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    )
    prayer_ids = list(habits.values_list('id', flat=True))

    streak = 0
    check_date = timezone.now().date()

    while True:
        completed_count = HabitLog.objects.filter(
            habit__in=prayer_ids,
            date=check_date,
            completed=True,
        ).count()

        if completed_count == len(prayer_ids):
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return success({'streak': streak, 'unit': 'days'})


# ─── Reflection Views ─────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reflection_list(request):
    """
    GET  /api/reflections/    → list user's journal entries (newest first)
    POST /api/reflections/    → create a new entry
    Body (POST): { text: "..." }
    """
    if request.method == 'GET':
        reflections = Reflection.objects.filter(user=request.user)
        return success(ReflectionSerializer(reflections, many=True).data)

    serializer = ReflectionSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return success(serializer.data, 201)
    return Response(serializer.errors, status=400)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def reflection_detail(request, pk):
    """
    PUT /api/reflections/<id>/    → update entry text
    DEL /api/reflections/<id>/    → delete entry
    """
    try:
        reflection = Reflection.objects.get(pk=pk, user=request.user)
    except Reflection.DoesNotExist:
        return error('Reflection not found.', 404)

    if request.method == 'PUT':
        serializer = ReflectionSerializer(
            reflection, data=request.data,
            partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return success(serializer.data)
        return Response(serializer.errors, status=400)

    reflection.delete()
    return Response(status=204)


# ─── Guidance Views ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def guidance_topics(request):
    """
    GET /api/guidance/topics/
    Returns all guidance topics with their entries nested.
    """
    topics = GuidanceTopic.objects.prefetch_related('entries').all()
    return success(GuidanceTopicSerializer(topics, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def guidance_by_topic(request):
    """
    GET /api/guidance/?topic=tawakkul
    Returns a single topic with entries.
    """
    slug = request.query_params.get('topic')
    if not slug:
        return error('topic query param required.')
    try:
        topic = GuidanceTopic.objects.prefetch_related('entries').get(slug=slug)
    except GuidanceTopic.DoesNotExist:
        return error(f'Topic "{slug}" not found.', 404)
    return success(GuidanceTopicSerializer(topic).data)