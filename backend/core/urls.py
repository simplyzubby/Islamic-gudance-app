from django.urls import path
from .views import CategoryListView, IslamicContentListView

urlpatterns = [
    path('categories/', CategoryListView.as_view()),
    path('contents/', IslamicContentListView.as_view()),
]