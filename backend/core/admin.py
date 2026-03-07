"""
Django Admin configuration.
Visit /admin to manage Ayahs, Habits, Reflections and Guidance content.
"""

from django.contrib import admin
from .models import Ayah, Habit, HabitLog, Reflection, GuidanceTopic, GuidanceEntry


@admin.register(Ayah)
class AyahAdmin(admin.ModelAdmin):
    list_display  = ('ayah_ref', 'surah', 'mood', 'is_daily', 'text_preview')
    list_filter   = ('mood', 'is_daily')
    search_fields = ('text', 'arabic', 'surah', 'ayah_ref')
    list_editable = ('is_daily', 'mood')

    def text_preview(self, obj):
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
    text_preview.short_description = 'Translation'


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display  = ('user', 'habit_type', 'display_label', 'is_active', 'created_at')
    list_filter   = ('habit_type', 'is_active')
    search_fields = ('user__username',)


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ('habit', 'date', 'completed')
    list_filter  = ('completed', 'date')
    date_hierarchy = 'date'


@admin.register(Reflection)
class ReflectionAdmin(admin.ModelAdmin):
    list_display  = ('user', 'created_at', 'text_preview')
    search_fields = ('user__username', 'text')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')

    def text_preview(self, obj):
        return obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
    text_preview.short_description = 'Entry'


class GuidanceEntryInline(admin.TabularInline):
    model  = GuidanceEntry
    extra  = 1
    fields = ('text', 'is_ayah', 'order')


@admin.register(GuidanceTopic)
class GuidanceTopicAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title', 'subtitle')
    inlines      = [GuidanceEntryInline]