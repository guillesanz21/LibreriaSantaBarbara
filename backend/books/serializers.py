"""
Serializers for the books API.
"""

from rest_framework import serializers
from books.models import Language

# * Language Serializers


class LanguageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Language model.
    """
    class Meta:
        model = Language
        fields = ['id', 'code']
        read_only_fields = ['id']
