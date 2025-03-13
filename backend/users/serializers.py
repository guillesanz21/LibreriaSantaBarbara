

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from drf_spectacular.utils import OpenApiExample, extend_schema_serializer
from rest_framework import serializers

from users.models import Customer


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Ejemplo de usuario',
            value={'email': 'user@example.com', 'username': 'user', 'password': 'test1234'}
        )
    ]
)
class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user object."""
    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5, 'validators': [validate_password]}}

    # validated_data is the validated data that is passed to the serializer
    def create(self, validated_data):
        """Create a new user with encrypted password and return it."""
        user = get_user_model().objects.create_user(**validated_data)
        # TODO: Create Token
        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class UserRegisterSerializer(UserSerializer):
    """Serializer for the user register view."""

    class Meta(UserSerializer.Meta):
        fields = ['email', 'username', 'password']


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for the customer object."""
    user = UserSerializer()

    class Meta():
        model = Customer
        # fields = '__all__'
        fields = ['user', 'nif', 'phone', 'address']

    def create(self, validated_data):
        """Create a new customer with the user correctly and return it."""
        user_data = validated_data.pop('user')
        user = UserSerializer.create(UserSerializer(), validated_data=user_data)
        customer, created = Customer.objects.update_or_create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        """Update a customer, setting the user correctly and return it."""
        user_data = validated_data.pop('user', None)
        customer = super().update(instance, validated_data)

        if user_data:
            # user = customer.user
            # TODO: Update the user fields
            pass

        return customer


# * Token serializers
class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication token."""
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        """Validate and authenticate the user."""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )

        if not user:
            msg = 'Unable to authenticate with provided credentials'
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs
