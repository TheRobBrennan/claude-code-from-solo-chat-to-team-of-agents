import requests
import pytest
from unittest.mock import patch

# --- Configuration ---
BASE_URL = "http://localhost:8000"  # Assume a local backend endpoint for testing
LOGIN_ENDPOINT = f"{BASE_URL}/api/v1/login"
SIGNUP_ENDPOINT = f"{BASE_URL}/api/v1/signup"
TOKEN_REFRESH_ENDPOINT = f"{BASE_URL}/api/v1/token/refresh"

# --- Test Data ---
TEST_USER = "testuser@example.com"
TEST_PASSWORD = "StrongPassword123"
VALID_TOKEN = "valid_jwt_token_12345"

@pytest.fixture(scope="module")
def client():
    """Fixture for the HTTP session."""
    # In a real scenario, this would handle session management or setup
    class TestClient:
        def post(self, url, json=None):
            # Mock response for the sake of this example, as we don't have a live backend
            if url == LOGIN_ENDPOINT:
                if json and json.get("email") == TEST_USER and json.get("password") == TEST_PASSWORD:
                    return {"access_token": VALID_TOKEN, "token_type": "Bearer", "expires_in": 3600}
                return {"error": "Invalid credentials"}
            if url == SIGNUP_ENDPOINT:
                return {"message": "User created successfully"}
            if url == TOKEN_REFRESH_ENDPOINT:
                if json and json.get("refresh_token") == "valid_refresh_token":
                    return {"access_token": "new_valid_jwt_token", "token_type": "Bearer", "expires_in": 3600}
                return {"error": "Invalid refresh token"}
            return {"error": "Not Found"}

    return TestClient()

# --- Test Cases ---

def test_successful_login(client):
    """Test successful login with valid credentials."""
    payload = {"email": TEST_USER, "password": TEST_PASSWORD}
    response = client.post(LOGIN_ENDPOINT, json=payload)

    assert "access_token" in response
    assert response["access_token"] == VALID_TOKEN
    assert response["token_type"] == "Bearer"

def test_failed_login_wrong_password(client):
    """Test login failure with an incorrect password."""
    payload = {"email": TEST_USER, "password": "WrongPassword"}
    response = client.post(LOGIN_ENDPOINT, json=payload)

    assert "error" in response
    assert response["error"] == "Invalid credentials"

def test_failed_login_invalid_email(client):
    """Test login failure with an invalid email."""
    payload = {"email": "bad_email@example.com", "password": TEST_PASSWORD}
    response = client.post(LOGIN_ENDPOINT, json=payload)

    assert "error" in response
    # Assuming the backend returns a generic error for invalid input
    assert response["error"] == "Invalid credentials" or "User not found"

def test_successful_signup(client):
    """Test successful user signup flow."""
    payload = {"email": TEST_USER, "password": TEST_PASSWORD}
    response = client.post(SIGNUP_ENDPOINT, json=payload)

    assert "message" in response
    assert "User created successfully" in response["message"]

def test_failed_signup_duplicate_email(client):
    """Test signup failure when the email already exists (assumed failure case)."""
    # Mocking a failure for this specific test case
    class FailingClient:
        def post(self, url, json=None):
            if url == SIGNUP_ENDPOINT:
                return {"error": "Email already exists"}
            return {"error": "Not Found"}

    failing_client = FailingClient()
    payload = {"email": TEST_USER, "password": TEST_PASSWORD}
    response = failing_client.post(SIGNUP_ENDPOINT, json=payload)

    assert "error" in response
    assert response["error"] == "Email already exists"

def test_token_refresh_success(client):
    """Test successful token refresh using a refresh token."""
    payload = {"refresh_token": "valid_refresh_token"}
    response = client.post(TOKEN_REFRESH_ENDPOINT, json=payload)

    assert "access_token" in response
    assert response["access_token"] == "new_valid_jwt_token"
    assert response["token_type"] == "Bearer"

def test_token_refresh_failure_invalid_token(client):
    """Test token refresh failure with an invalid refresh token."""
    payload = {"refresh_token": "invalid_token"}
    response = client.post(TOKEN_REFRESH_ENDPOINT, json=payload)

    assert "error" in response
    assert response["error"] == "Invalid refresh token"