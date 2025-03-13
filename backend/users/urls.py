"""
URL mapping for the users API.
"""


from django.urls import path

from .views import CreateTokenView, CreateUserView


app_name = "users"


urlpatterns = [
    path('token/', CreateTokenView.as_view(), name='token'),
    path('create/', CreateUserView.as_view(), name='create'),

]
