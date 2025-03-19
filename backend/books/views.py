from drf_spectacular.utils import extend_schema
from rest_framework.authentication import TokenAuthentication
from books.models import Language, Location, Status, Topic
from books import serializers
from rest_framework import mixins, permissions, viewsets


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
