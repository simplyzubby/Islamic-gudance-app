from rest_framework import serializers
from .models import IslamicContent, Category, Reflection

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class IslamicContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IslamicContent
        fields = '__all__'


class ReflectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reflection
        fields = '__all__'