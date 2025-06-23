import pytest
from unittest.mock import patch, MagicMock
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from firebase_service import FirebaseService

@pytest.fixture
@patch('firebase_service.firebase_admin')
@patch('firebase_service.db')
def firebase_service_mock(mock_db, mock_admin):
    mock_admin._apps = []
    mock_db.reference.return_value = MagicMock()
    return FirebaseService()

def test_create_figura(firebase_service_mock):
    firebase_service_mock.ref.child.return_value.set = MagicMock()
    figura_id = firebase_service_mock.create_figura({'nombre': 'Flor'})
    assert isinstance(figura_id, str)
    assert len(figura_id) > 0

def test_get_figura_encontrada(firebase_service_mock):
    firebase_service_mock.ref.child.return_value.get.return_value = {'nombre': 'Flor'}
    figura = firebase_service_mock.get_figura("123")
    assert figura['nombre'] == 'Flor'

def test_get_figura_no_encontrada(firebase_service_mock):
    firebase_service_mock.ref.child.return_value.get.return_value = None
    figura = firebase_service_mock.get_figura("123")
    assert figura is None

def test_get_all_figuras(firebase_service_mock):
    firebase_service_mock.ref.get.return_value = {
        "1": {"nombre": "A"},
        "2": {"nombre": "B"}
    }
    result = firebase_service_mock.get_all_figuras()
    assert len(result) == 2
    assert result[0]['id'] == "1"

def test_update_figura_exitosa(firebase_service_mock):
    mock_child = firebase_service_mock.ref.child.return_value
    mock_child.get.return_value = {'nombre': 'X'}
    mock_child.update = MagicMock()
    result = firebase_service_mock.update_figura("abc", {"estado": "Nuevo"})
    assert result is True

def test_update_figura_falla(firebase_service_mock):
    firebase_service_mock.ref.child.return_value.get.return_value = None
    result = firebase_service_mock.update_figura("abc", {"estado": "Nuevo"})
    assert result is False

def test_delete_figura_exitosa(firebase_service_mock):
    mock_child = firebase_service_mock.ref.child.return_value
    mock_child.get.return_value = {'nombre': 'X'}
    mock_child.delete = MagicMock()
    result = firebase_service_mock.delete_figura("abc")
    assert result is True

def test_delete_figura_falla(firebase_service_mock):
    firebase_service_mock.ref.child.return_value.get.return_value = None
    result = firebase_service_mock.delete_figura("abc")
    assert result is False
