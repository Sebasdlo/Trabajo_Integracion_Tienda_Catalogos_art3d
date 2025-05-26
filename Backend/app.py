from flask import Flask, jsonify  # type: ignore


app = Flask(__name__)


@app.route('/')
def home():
    return "API de catálogo 3D funcionando correctamente."

@app.route('/api/figuras', methods=['GET'])
def get_figuras():
    figuras = [
        {"id": 1, "nombre": "Dinosaurio 3D", "precio": 15000},
        {"id": 2, "nombre": "Florero moderno", "precio": 20000},
        {"id": 3, "nombre": "Abeja decorativa", "precio": 10000}
    ]
    return jsonify(figuras)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
