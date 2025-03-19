"""
Serializers for the books API.
"""

from rest_framework import serializers
from books.models import Language, Location, Status, Topic


# * Language Serializers
class LanguageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Language model.
    """
    class Meta:
        model = Language
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['code'] = validated_data['code'].lower()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['code'] = validated_data['code'].lower()
        return super().update(instance, validated_data)


# * Topic Serializers
class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for the Topic View.
    """
    class Meta:
        model = Topic
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['name'] = validated_data['name'].lower()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['name'] = validated_data['name'].lower()
        return super().update(instance, validated_data)


# * Status Serializers
class StatusSerializer(serializers.ModelSerializer):
    """
    Serializer for the Status View.
    """
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ['id']


class StatusListSerializer(StatusSerializer):
    """
    Serializer for the Status List View.
    """
    class Meta(StatusSerializer.Meta):
        fields = ['id', 'name']


# * Location Serializers
class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Location View.
    """
    class Meta:
        model = Location
        fields = '__all__'
        read_only_fields = ['id']


class LocationListSerializer(LocationSerializer):
    """
    Serializer for the Location List View.
    """
    class Meta(LocationSerializer.Meta):
        fields = ['id', 'name']
