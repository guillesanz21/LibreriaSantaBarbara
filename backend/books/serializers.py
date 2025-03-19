"""
Serializers for the books API.
"""

from rest_framework import serializers
from books.models import Language, Topic

# * Language Serializers


class LanguageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Language model.
    """
    class Meta:
        model = Language
        fields = ['id', 'code']
        read_only_fields = ['id']


# * Topic Serializers
class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for the Topic model.
    """
    class Meta:
        model = Topic
        fields = ['id', 'name']
        read_only_fields = ['id']
