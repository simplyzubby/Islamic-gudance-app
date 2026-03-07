"""
Models for the Islamic Guidance App.

Tables:
  - Ayah          : Quranic verses (seeded via management command)
  - Habit         : Daily trackable habits (per user)
  - HabitLog      : Record of each habit completion
  - Reflection    : User journal entries
  - GuidanceTopic : Spiritual guidance topics
  - GuidanceEntry : Individual guidance pieces per topic
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# ─── Ayah ─────────────────────────────────────────────────────────────────────

class Ayah(models.Model):
    """A Quranic verse with Arabic text, English translation and reference."""

    MOOD_CHOICES = [
        ('lost',      'Feeling Lost'),
        ('anxious',   'Anxious'),
        ('grateful',  'Grateful'),
        ('hopeful',   'Hopeful'),
        ('general',   'General'),
    ]

    arabic   = models.TextField(help_text="Arabic text of the ayah")
    text     = models.TextField(help_text="English translation")
    surah    = models.CharField(max_length=100, help_text="e.g. Al-Baqarah")
    ayah_ref = models.CharField(max_length=20,  help_text="e.g. 2:286")
    mood     = models.CharField(max_length=20, choices=MOOD_CHOICES, default='general')
    is_daily = models.BooleanField(default=False, help_text="Feature as daily ayah")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['ayah_ref']
        verbose_name_plural = 'Ayahs'

    def __str__(self):
        return f"{self.ayah_ref} — {self.text[:60]}..."


# ─── Habit ────────────────────────────────────────────────────────────────────

class Habit(models.Model):
    """A trackable daily habit belonging to a user."""

    HABIT_CHOICES = [
        ('fajr',    'Fajr Prayer'),
        ('dhuhr',   'Dhuhr Prayer'),
        ('asr',     'Asr Prayer'),
        ('maghrib', 'Maghrib Prayer'),
        ('isha',    'Isha Prayer'),
        ('quran',   "Qur'an Reading"),
        ('dhikr',   'Dhikr'),
        ('custom',  'Custom'),
    ]

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    habit_type = models.CharField(max_length=20, choices=HABIT_CHOICES)
    label      = models.CharField(max_length=100, blank=True, help_text="Override default label")
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # A user can only have one of each habit type
        unique_together = ('user', 'habit_type')
        ordering = ['habit_type']

    def __str__(self):
        return f"{self.user.username} — {self.get_habit_type_display()}"

    @property
    def display_label(self):
        return self.label or self.get_habit_type_display()


class HabitLog(models.Model):
    """Records when a user completes a habit on a given date."""

    habit      = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date       = models.DateField(default=timezone.now)
    completed  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Only one log per habit per day
        unique_together = ('habit', 'date')
        ordering = ['-date']

    def __str__(self):
        status = '✓' if self.completed else '✗'
        return f"{status} {self.habit} on {self.date}"


# ─── Reflection ───────────────────────────────────────────────────────────────

class Reflection(models.Model):
    """A private journal entry written by a user."""

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.created_at.date()}: {self.text[:50]}"


# ─── Guidance ─────────────────────────────────────────────────────────────────

class GuidanceTopic(models.Model):
    """A spiritual topic (e.g. Tawakkul, Sabr, Iman, Shukr)."""

    TOPIC_CHOICES = [
        ('tawakkul', 'Tawakkul'),
        ('sabr',     'Sabr'),
        ('iman',     'Iman'),
        ('shukr',    'Shukr'),
    ]

    slug        = models.SlugField(unique=True, choices=TOPIC_CHOICES)
    title       = models.CharField(max_length=100)
    subtitle    = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title


class GuidanceEntry(models.Model):
    """A single piece of guidance under a topic."""

    topic      = models.ForeignKey(GuidanceTopic, on_delete=models.CASCADE, related_name='entries')
    text       = models.TextField()
    is_ayah    = models.BooleanField(default=False, help_text="Is this a Quranic reference?")
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.topic.title}: {self.text[:50]}"