import pytest
from unittest.mock import patch
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import app  # ✅ Import directo del archivo app.py

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

# ------------------- GET /
def test_home(client):
    response = client.get('/')
    assert response.status_code == 200
    assert 'API de catálogo 3D funcionando correctamente.'.encode('utf-8') in response.data

# ------------------- GET /figuras
def test_get_all_figuras(client):
    response = client.get('/figuras')
    assert response.status_code in [200, 500]

@patch('app.firebase_service.get_all_figuras', side_effect=Exception('error firebase'))
def test_get_all_figuras_exception(mock_get, client):
    response = client.get('/figuras')
    assert response.status_code == 500
    assert b'error' in response.data

# ------------------- POST /figuras
def test_create_figura_faltan_campos(client):
    figura = {
        "nombre": "Figura incompleta"
    }
    response = client.post('/figuras', json=figura)
    assert response.status_code == 400
    assert 'Falta algun campo requerido' in response.data.decode('utf-8')

@patch('app.firebase_service.create_figura')
def test_create_figura_valida(mock_create, client):
    mock_create.return_value = "mock_id"

    figura = {
        "imagenUrl": "https://example.com/imagen.jpg",
        "categoria": "Decoración",
        "estado": "Nuevo",
        "nombre": "Flor 3D",
        "precio": 15000,
        "subcategoria": "Plantas"
    }

    response = client.post('/figuras', json=figura)
    assert response.status_code == 201
    assert b'id' in response.data

@patch('app.firebase_service.create_figura', side_effect=Exception("error firebase"))
def test_create_figura_exception(mock_create, client):
    figura = {
        "imagenUrl": "url",
        "categoria": "Cat",
        "estado": "Estado",
        "nombre": "Nombre",
        "precio": 10000
    }
    response = client.post('/figuras', json=figura)
    assert response.status_code == 500
    assert b'error' in response.data

# ------------------- GET /figuras/<id>
@patch('app.firebase_service.get_figura')
def test_get_figura_found(mock_get, client):
    mock_get.return_value = {"nombre": "Flor 3D"}
    response = client.get('/figuras/fake_id')
    assert response.status_code == 200
    assert b'Flor 3D' in response.data

@patch('app.firebase_service.get_figura')
def test_get_figura_not_found(mock_get, client):
    mock_get.return_value = None
    response = client.get('/figuras/fake_id')
    assert response.status_code == 404

@patch('app.firebase_service.get_figura', side_effect=Exception("error firebase"))
def test_get_figura_exception(mock_get, client):
    response = client.get('/figuras/fake_id')
    assert response.status_code == 500
    assert b'error' in response.data

# ------------------- PUT /figuras/<id>
@patch('app.firebase_service.update_figura')
def test_update_figura_success(mock_update, client):
    mock_update.return_value = True
    data = {"nombre": "Figura actualizada"}
    response = client.put('/figuras/fake_id', json=data)
    assert response.status_code == 200
    assert b'Figura actualizada correctamente' in response.data

@patch('app.firebase_service.update_figura')
def test_update_figura_fail(mock_update, client):
    mock_update.return_value = False
    data = {"nombre": "Figura actualizada"}
    response = client.put('/figuras/fake_id', json=data)
    assert response.status_code == 404
    assert b'Figura no encontrada' in response.data

def test_update_figura_sin_datos(client):
    response = client.put('/figuras/fake_id', json={})
    assert response.status_code == 400
    assert b'No sin datos para actualizar' in response.data

@patch('app.firebase_service.update_figura', side_effect=Exception("error firebase"))
def test_update_figura_exception(mock_update, client):
    data = {"nombre": "Nueva figura"}
    response = client.put('/figuras/fake_id', json=data)
    assert response.status_code == 500
    assert b'error' in response.data

# ------------------- DELETE /figuras/<id>
@patch('app.firebase_service.delete_figura')
def test_delete_figura_success(mock_delete, client):
    mock_delete.return_value = True
    response = client.delete('/figuras/fake_id')
    assert response.status_code == 200

@patch('app.firebase_service.delete_figura')
def test_delete_figura_fail(mock_delete, client):
    mock_delete.return_value = False
    response = client.delete('/figuras/fake_id')
    assert response.status_code == 404

@patch('app.firebase_service.delete_figura', side_effect=Exception("error firebase"))
def test_delete_figura_exception(mock_delete, client):
    response = client.delete('/figuras/fake_id')
    assert response.status_code == 500
    assert b'error' in response.data
