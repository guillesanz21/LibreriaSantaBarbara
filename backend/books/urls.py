"""
URL mappings for the books app.
"""
from django.urls import include, path

from rest_framework.routers import DefaultRouter

from books.views import LanguageViewSet, TopicViewSet


router = DefaultRouter()
router.register('languages', LanguageViewSet, basename='languages')
router.register('topics', TopicViewSet, basename='topics')

app_name = 'books'

urlpatterns = [
    path('', include(router.urls)),
]
