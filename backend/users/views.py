"""
Views for login, logout, registration, and updating user and customer information.
"""

# Create your views here.

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings

from users.serializers import AuthTokenSerializer


# TODO: Hide password value in the browsable API


# The default ObtainAuthToken view provided by Django REST framework takes the username and password, and
# we want to use the email address instead of the username.
class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user."""
    serializer_class = AuthTokenSerializer
    # Use the default renderer classes for the ObtainAuthToken view
    # to render the response in the browsable API.
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
