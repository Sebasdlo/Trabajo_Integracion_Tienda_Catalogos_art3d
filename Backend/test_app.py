import json
import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_create_figura_success(client, mocker):
    input_data = {
        "base64": "imagen_base64",
        "categoria": "anime",
        "estado": "nuevo",
        "nombre": "Figura de prueba",
        "precio": 25.0
    }
    mocker.patch('app.firebase_service.create_figura', return_value='abc123')

    response = client.post('/figuras', data=json.dumps(input_data), content_type='application/json')
    assert response.status_code == 201
    assert response.get_json() == {'id': 'abc123'}

def test_create_figura_missing_fields(client):
    input_data = {
        "nombre": "Figura incompleta"
    }
    response = client.post('/figuras', data=json.dumps(input_data), content_type='application/json')
    assert response.status_code == 400
    assert "Falta algun campo requerido" in response.get_data(as_text=True)

def test_get_figura_found(client, mocker):
    mock_figura = {"nombre": "Figura Mock", "precio": 30.0}
    mocker.patch('app.firebase_service.get_figura', return_value=mock_figura)

    response = client.get('/figuras/abc123')
    assert response.status_code == 200
    assert response.get_json() == mock_figura

def test_get_figura_not_found(client, mocker):
    mocker.patch('app.firebase_service.get_figura', return_value=None)

    response = client.get('/figuras/abc123')
    assert response.status_code == 404
    assert "Figura no encontrada" in response.get_data(as_text=True)

def test_get_all_figuras(client, mocker):
    mock_figuras = {"1": {"nombre": "Figura 1"}, "2": {"nombre": "Figura 2"}}
    mocker.patch('app.firebase_service.get_all_figuras', return_value=mock_figuras)

    response = client.get('/figuras')
    assert response.status_code == 200
    assert response.get_json() == mock_figuras

def test_update_figura_success(client, mocker):
    update_data = {"precio": 99.0}
    mocker.patch('app.firebase_service.update_figura', return_value=True)

    response = client.put('/figuras/abc123', data=json.dumps(update_data), content_type='application/json')
    assert response.status_code == 200
    assert "Figura actualizada correctamente" in response.get_data(as_text=True)

def test_update_figura_not_found(client, mocker):
    update_data = {"precio": 99.0}
    mocker.patch('app.firebase_service.update_figura', return_value=False)

    response = client.put('/figuras/abc123', data=json.dumps(update_data), content_type='application/json')
    assert response.status_code == 404
    assert "Figura no encontrada" in response.get_data(as_text=True)

def test_update_figura_empty_data(client):
    response = client.put('/figuras/abc123', data=json.dumps({}), content_type='application/json')
    assert response.status_code == 400
    assert "No sin datos para actualizar" in response.get_data(as_text=True)

def test_delete_figura_success(client, mocker):
    mocker.patch('app.firebase_service.delete_figura', return_value=True)

    response = client.delete('/figuras/abc123')
    assert response.status_code == 200
    assert "Figura eliminada correctamente" in response.get_data(as_text=True)

def test_delete_figura_not_found(client, mocker):
    mocker.patch('app.firebase_service.delete_figura', return_value=False)

    response = client.delete('/figuras/abc123')
    assert response.status_code == 404
    assert "Figura no encontrada" in response.get_data(as_text=True)
