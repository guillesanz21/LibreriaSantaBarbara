"""
URL mappings for the books app.
"""
from django.urls import include, path

from rest_framework.routers import DefaultRouter

from books.views import BookViewSet, LanguageViewSet, LocationViewSet, StatusViewSet, TopicViewSet


router = DefaultRouter()
router.register('books', BookViewSet, basename='books')
router.register('languages', LanguageViewSet, basename='languages')
router.register('topics', TopicViewSet, basename='topics')
router.register('status', StatusViewSet, basename='status')
router.register('locations', LocationViewSet, basename='locations')

app_name = 'books'

urlpatterns = [
    path('', include(router.urls)),
]
