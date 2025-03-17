"""
Tests for the user API
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


CREATE_USER_URL = reverse('users:create')
TOKEN_URL = reverse('users:token')
ME_URL = reverse('users:me')

create_user_payload = {
    'email': 'test@example.com',
    'password': 'prueba12345',
    'username': 'testName12345'
}


def create_user(**params):
    """Create and return a new user."""
    return get_user_model().objects.create_user(**params)


class PublicUserApiTests(TestCase):
    """Test the users API (public)."""

    def setUp(self):
        self.client = APIClient()

    def test_create_valid_user_success(self):
        """
        Test creating user with valid payload is successful. Checks:
            - A user is created with a valid payload.
            - The status code is 201.
            - The password is encrypted, and is not returned in the response.
            - A profile is created for the user, with the user as the foreign key.
            - A token is created for the user, and the token is returned in the response.
        """
        res = self.client.post(CREATE_USER_URL, create_user_payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=create_user_payload['email'])
        self.assertTrue(user.check_password(create_user_payload['password']))
        # Ensure password is not returned in response
        self.assertNotIn('password', res.data)  # type: ignore
        # Ensure customer is created for the user
        self.assertTrue(hasattr(user, 'customer'))
        # Ensure token is created for the user
        self.assertTrue(hasattr(user, 'auth_token'))

    def test_user_exists(self):
        """
        Test creating a user that already exists. Checks:
            - The status code is 400.
        """
        create_user(**create_user_payload)
        res = self.client.post(CREATE_USER_URL, create_user_payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_too_short(self):
        """
        Test that the password must be more than 5 characters. Checks:
            - The status code is 400.
            - The user is not created.
        """
        payload = {
            'email': 'test@example.com',
            'password': 'pw',
            'username': 'testName12345'
        }
        res = self.client.post(CREATE_USER_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user_exists = get_user_model().objects.filter(
            email=payload['email']
        ).exists()
        self.assertFalse(user_exists)

    def test_create_token_for_user(self):
        """
        Test that a token is created for the user. Checks:
            - The status code is 200.
            - The token is created.
        """
        create_user(**create_user_payload)

        payload = {
            'email': create_user_payload['email'],
            'password': create_user_payload['password']
        }
        res = self.client.post(TOKEN_URL, payload)

        self.assertIn('token', res.data)  # type: ignore
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_token_invalid_credentials(self):
        """
        Test that a token is not created if invalid credentials are given. Checks:
            - The status code is 400.
            - The token is not created.
        """
        create_user(**create_user_payload)

        payload = {'email': 'test@example.com', 'password': 'badpass'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)  # type: ignore
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_blank_password(self):
        """
        Test that a token is not created if the password is blank. Checks:
            - The status code is 400.
            - The token is not created.
        """
        payload = {'email': 'test@example.com', 'password': ''}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)  # type: ignore
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_token_no_user(self):
        """
        Test that a token is not created if the user does not exist. Checks:
            - The status code is 400.
            - The token is not created.
        """
        payload = {'email': 'not-existing-email@example.com', 'password': 'testpass'}
        res = self.client.post(TOKEN_URL, payload)

        self.assertNotIn('token', res.data)  # type: ignore
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_user_unauthorized(self):
        """
        Test that authentication is required for users. Checks:
            - The status code is 401.
        """
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateUserApiTests(TestCase):
    """Test the users API (private)."""

    def setUp(self):
        self.user = create_user(**create_user_payload)
        self.client = APIClient()
        # Authenticate the user with the client. Every request made with this client will be authenticated from now on.
        self.client.force_authenticate(user=self.user)

    def test_retrieve_customer_success(self):
        """
        Test retrieving customer for logged in user. Checks:
            - The status code is 200.
            - The response contains the user data (email, username)
            - The response contains customer data (example: nif). The nif is None because it is not set.
        """
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.data  # type: ignore
        self.assertTrue('user' in data)
        self.assertEqual(data['user']['email'], self.user.email)
        self.assertEqual(data['user']['username'], self.user.username)
        self.assertTrue('nif' in data)
        self.assertIsNone(data['nif'])

    def test_post_me_not_allowed(self):
        """
        Test that POST is not allowed on the me URL. Checks:
            - The status code is 405.
        """
        res = self.client.post(ME_URL, {})

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_user_data(self):
        """
        Test updating the user data for authenticated user. Checks:
            - The status code is 200.
            - The user data is updated.
        """
        payload = {
            'user': {
                'username': 'newUsername123',
                'password': 'newPassword123',
                'first_name': 'newFirstName',
            }
        }
        res = self.client.patch(ME_URL, payload, format='json')

        self.user.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.username, payload['user']['username'])
        self.assertTrue(self.user.check_password(payload['user']['password']))
        self.assertEqual(self.user.first_name, payload['user']['first_name'])

    def test_update_customer_data(self):
        """
        Test updating the customer data for authenticated user. Checks:
            - The status code is 200.
            - The customer data is updated.
        """
        payload = {
            'nif': '12345678Z',
            'phone': '123456789'
        }
        res = self.client.patch(ME_URL, payload)

        self.user.customer.refresh_from_db()  # type: ignore
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.customer.nif, payload['nif'])  # type: ignore
        self.assertEqual(self.user.customer.phone, payload['phone'])  # type: ignore
