from rest_framework import generics
from .models import IslamicContent, Category
from .serializers import IslamicContentSerializer, CategorySerializer

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class IslamicContentListView(generics.ListCreateAPIView):
    queryset = IslamicContent.objects.all()
    serializer_class = IslamicContentSerializer