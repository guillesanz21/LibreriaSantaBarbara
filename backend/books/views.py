from django.db import IntegrityError
from drf_spectacular.utils import extend_schema
from rest_framework.authentication import TokenAuthentication
from books.models import Book, Language, Location, Status, Topic
from books import serializers
from rest_framework import mixins, permissions, viewsets


@extend_schema(tags=['Books'])
class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Books."""
    serializer_class = serializers.BookSerializer
    queryset = Book.objects
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.BookListSerializer
        return serializers.BookSerializer

    def get_queryset(self):
        if self.action == 'list':
            # TODO: Add filters:
            # location, status, keywords, topics, languages
            # title, author
            # price (min, max)
            # TODO: Add pagination
            # TODO: Add ordering
            return super().get_queryset().select_related('status').all()
        # NICETOHAVE: Use RawSQL for better performance
        return (
            super().get_queryset()
            .select_related('status', 'location')
            .prefetch_related('keywords', 'images', 'topics', 'languages')
        )


@extend_schema(tags=['Books / Languages'])
class LanguageViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """ViewSet for managing Languages."""
    serializer_class = serializers.LanguageSerializer
    queryset = Language.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(tags=['Books / Topics'])
class TopicViewSet(mixins.DestroyModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """ViewSet for managing Topic."""
    serializer_class = serializers.TopicSerializer
    queryset = Topic.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Topic already exists')

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Topic already exists')


@extend_schema(tags=['Books / Status'])
class StatusViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Status."""
    serializer_class = serializers.StatusSerializer
    queryset = Status.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.StatusListSerializer
        return serializers.StatusSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Status already exists')

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Status already exists')


@extend_schema(tags=['Books / Locations'])
class LocationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Location."""
    serializer_class = serializers.LocationSerializer
    queryset = Location.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.LocationListSerializer
        return serializers.LocationSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Location already exists')

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            raise serializers.serializers.ValidationError('Location already exists')
