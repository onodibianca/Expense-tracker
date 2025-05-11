import pytest
from app import app as flask_app
from configure_db import db
from model.user_entity import User
from werkzeug.security import generate_password_hash

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret-key",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })

    with flask_app.app_context():
        db.create_all()
        db.session.commit()

        yield flask_app

        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()
