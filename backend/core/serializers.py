"""
Serializers for the Islamic Guidance App.

Converts model instances ↔ JSON for the REST API.
"""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Ayah, Habit, HabitLog, Reflection, GuidanceTopic, GuidanceEntry


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    """Handles new user registration with password confirmation."""

    password  = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read-only profile info returned after login."""

    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'date_joined')
        read_only_fields = fields


# ─── Ayah ─────────────────────────────────────────────────────────────────────

class AyahSerializer(serializers.ModelSerializer):
    """
    Maps DB fields to what the frontend expects:
      arabic, text, ref  (ref = ayah_ref in DB)
    """

    ref = serializers.CharField(source='ayah_ref', read_only=True)

    class Meta:
        model  = Ayah
        fields = ('id', 'arabic', 'text', 'ref', 'surah', 'mood')


# ─── Habit ────────────────────────────────────────────────────────────────────

class HabitLogSerializer(serializers.ModelSerializer):

    class Meta:
        model  = HabitLog
        fields = ('id', 'date', 'completed', 'created_at')


class HabitSerializer(serializers.ModelSerializer):
    """Habit with today's completion status included."""

    is_completed_today = serializers.SerializerMethodField()
    display_label      = serializers.ReadOnlyField()

    class Meta:
        model  = Habit
        fields = ('id', 'habit_type', 'display_label', 'is_active', 'is_completed_today')

    def get_is_completed_today(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return obj.logs.filter(date=today, completed=True).exists()


class TodayHabitsSerializer(serializers.Serializer):
    """
    Returns { habits: [...], completed: ['fajr', 'quran', ...] }
    Matches what the frontend Dashboard expects.
    """
    habits    = HabitSerializer(many=True)
    completed = serializers.ListField(child=serializers.CharField())


# ─── Reflection ───────────────────────────────────────────────────────────────

class ReflectionSerializer(serializers.ModelSerializer):
    """Journal entry — user is set automatically from request."""

    class Meta:
        model  = Reflection
        fields = ('id', 'text', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Inject authenticated user automatically
        user = self.context['request'].user
        return Reflection.objects.create(user=user, **validated_data)


# ─── Guidance ─────────────────────────────────────────────────────────────────

class GuidanceEntrySerializer(serializers.ModelSerializer):

    class Meta:
        model  = GuidanceEntry
        fields = ('id', 'text', 'is_ayah', 'order')


class GuidanceTopicSerializer(serializers.ModelSerializer):
    """Topic with all its entries nested."""

    entries = GuidanceEntrySerializer(many=True, read_only=True)

    class Meta:
        model  = GuidanceTopic
        fields = ('id', 'slug', 'title', 'subtitle', 'description', 'entries')