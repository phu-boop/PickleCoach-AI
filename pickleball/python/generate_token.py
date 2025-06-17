import jwt
from datetime import datetime, timedelta, UTC

secret = "4k2z9jX7pL8mW3nQ5rT2vY6xB0cA1dF9hJ2kM5nP7qR8sT0uV2wX4yZ6"
payload = {
    "sub": "6049cd4a-a647-402e-bbaf-f0fa6a53f068",
    "exp": datetime.now(UTC) + timedelta(hours=24),
    "roles": ["USER"]  # Thêm vai trò USER
}
token = jwt.encode(payload, secret, algorithm="HS256")
print(token)