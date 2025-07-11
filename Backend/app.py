from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS 
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)
CORS(app) 
# Instancia perezosa para permitir mock en tests
firebase_service = None

def get_firebase_service():
    global firebase_service
    if firebase_service is None:
        from firebase_service import FirebaseService
        firebase_service = FirebaseService()
    return firebase_service

FIGURA_NO_ENCONTRADA = 'Figura no encontrada'

@app.route('/')
def home():
    return "API de catálogo 3D funcionando correctamente."

@app.route('/figuras', methods=['POST'])
def create_figura():
    try:
        data = request.get_json()
        required_fields = ['imagenUrl', 'categoria', 'estado', 'nombre', 'precio']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Falta algun campo requerido'}), 400

        # 👇 Agrega la fecha de creación si no viene desde el frontend
        if 'createdAt' not in data:
            data['createdAt'] = datetime.now(timezone.utc).isoformat()

        figura_id = get_firebase_service().create_figura(data)
        return jsonify({'id': figura_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/figuras/<figura_id>', methods=['GET'])
def get_figura(figura_id):
    try:
        figura = get_firebase_service().get_figura(figura_id)
        if figura:
            return jsonify(figura), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras', methods=['GET'])
def get_all_figuras():
    try:
        figuras = get_firebase_service().get_all_figuras()
        return jsonify(figuras or {}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras/<figura_id>', methods=['PUT'])
def update_figura(figura_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No sin datos para actualizar'}), 400
        success = get_firebase_service().update_figura(figura_id, data)
        if success:
            return jsonify({'message': 'Figura actualizada correctamente'}), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras/<figura_id>', methods=['DELETE'])
def delete_figura(figura_id):
    try:
        success = get_firebase_service().delete_figura(figura_id)
        if success:
            return jsonify({'message': 'Figura eliminada correctamente'}), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
