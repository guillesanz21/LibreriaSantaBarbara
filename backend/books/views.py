from drf_spectacular.utils import extend_schema
from rest_framework.authentication import TokenAuthentication
from books.models import Language
from books.serializers import LanguageSerializer
from rest_framework import permissions, viewsets


@extend_schema(tags=['Books / Languages'])
class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(code=serializer.validated_data['code'].lower())

    def perform_update(self, serializer):
        serializer.save(code=serializer.validated_data['code'].lower())
