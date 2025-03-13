"""
URL mapping for the users API.
"""


from django.urls import path

from .views import CreateTokenView


app_name = "users"


urlpatterns = [
    path('token/', CreateTokenView.as_view(), name='token'),

]
