from django.core.exceptions import BadRequest
from django.db import IntegrityError
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework.authentication import TokenAuthentication
from books.pagination import StandardPagination
from books.models import Book, Language, Location, Status, Topic
from books import serializers
from rest_framework import mixins, permissions, viewsets


@extend_schema(tags=['Books'])
@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='title',
                type=OpenApiTypes.STR,
                description='Filter by title',
            ),
            OpenApiParameter(
                name='author',
                type=OpenApiTypes.STR,
                description='Filter by author',
            ),
            OpenApiParameter(
                name='price_min',
                type=OpenApiTypes.NUMBER,
                description='Filter by minimum price',
            ),
            OpenApiParameter(
                name='price_max',
                type=OpenApiTypes.NUMBER,
                description='Filter by maximum price',
            ),
            OpenApiParameter(
                name='status',
                type=OpenApiTypes.INT,
                description='Filter by status',
            ),
            OpenApiParameter(
                name='location',
                type=OpenApiTypes.INT,
                description='Filter by location',
            ),
            OpenApiParameter(
                name='languages',
                type=OpenApiTypes.STR,
                description='Filter by languages (comma separated)',
            ),
            OpenApiParameter(
                name='keywords',
                type=OpenApiTypes.STR,
                description='Filter by keywords (comma separated)',
            ),
            OpenApiParameter(
                name='topics',
                type=OpenApiTypes.STR,
                description='Filter by topics (comma separated)',
            ),
            OpenApiParameter(
                name='ordering',
                type=OpenApiTypes.STR,
                description='Ordering by field (e.g., updated_at, -price, +ref)',
            ),
        ]
    )
)
class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Books."""
    serializer_class = serializers.BookSerializer
    queryset = Book.objects
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.BookListSerializer
        return serializers.BookSerializer

    def get_queryset(self):
        """Returns a queryset of books based on the action."""
        if self.action == 'list':
            queryset = self.queryset

            title = self.request.query_params.get('title')
            author = self.request.query_params.get('author')
            price_min = self.request.query_params.get('price_min')
            price_max = self.request.query_params.get('price_max')
            location = self.request.query_params.get('location')
            status = self.request.query_params.get('status')
            keywords = self.request.query_params.get('keywords')
            languages = self.request.query_params.get('languages')
            topics = self.request.query_params.get('topics')
            ordering = self.request.query_params.get('ordering')

            # Filtering
            if title:
                queryset = queryset.filter(title__icontains=title)
            if author:
                queryset = queryset.filter(author__icontains=author)
            if price_min:
                queryset = queryset.filter(price__gte=price_min)
            if price_max:
                queryset = queryset.filter(price__lte=price_max)
            if status:
                queryset = queryset.filter(status__id=status)
            if location:
                queryset = queryset.filter(location__id=location)
            if languages:
                languages = [lang.strip() for lang in languages.split(',')]
                queryset = queryset.filter(languages__code__in=languages)
            if keywords:
                keywords = [keyword.strip() for keyword in keywords.split(',')]
                queryset = queryset.filter(keywords__name__in=keywords)
            if topics:
                topics = [topic.strip() for topic in topics.split(',')]
                queryset = queryset.filter(topics__name__in=topics)

            queryset = queryset.select_related('status')

            # Ordering
            # NICETOHAVE: Maybe limit the options to indexed fields
            if ordering:
                # Format: -field_name for descending order, +field_name or field_name for ascending order
                ordering = ordering.lstrip('+')
                field = ordering.lstrip('+-')
                valid_fields = [field.name for field in queryset.model._meta.get_fields()]  # Lista de campos válidos

                if field not in valid_fields:
                    raise BadRequest(f"Invalid ordering field '{ordering}'. Valid fields are: {valid_fields}")
                queryset = queryset.order_by(ordering)
            return queryset

        # NICETOHAVE: Use RawSQL for better performance
        return (
            super().get_queryset()
            .filter()
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
