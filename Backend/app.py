from dotenv import load_dotenv
from flask import Flask, request, jsonify

from firebase_service import FirebaseService

load_dotenv()

app = Flask(__name__)
firebase_service = FirebaseService()

FIGURA_NO_ENCONTRADA = 'Figura no encontrada'

@app.route('/figuras', methods=['POST'])
def create_figura():
    try:
        data = request.get_json()
        required_fields = ['base64', 'categoria', 'estado', 'nombre', 'precio']

        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Falta algun campo requerido'}), 400

        figura_id = firebase_service.create_figura(data)
        return jsonify({'id': figura_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras/<figura_id>', methods=['GET'])
def get_figura(figura_id):
    try:
        figura = firebase_service.get_figura(figura_id)
        if figura:
            return jsonify(figura), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras', methods=['GET'])
def get_all_figuras():
    try:
        figuras = firebase_service.get_all_figuras()
        return jsonify(figuras or {}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras/<figura_id>', methods=['PUT'])
def update_figura(figura_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No sin datos para actualizar'}), 400

        success = firebase_service.update_figura(figura_id, data)
        if success:
            return jsonify({'message': 'Figura actualizada correctamente'}), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/figuras/<figura_id>', methods=['DELETE'])
def delete_figura(figura_id):
    try:
        success = firebase_service.delete_figura(figura_id)
        if success:
            return jsonify({'message': 'Figura eliminada correctamente'}), 200
        return jsonify({'error': FIGURA_NO_ENCONTRADA}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
