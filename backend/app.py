from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock de sinais com nomes de animações .glb
banco_de_sinais = {
    "menino": "menino.glb",
    "gosta": "gosta.glb",
    "jogar": "jogar.glb",
    "bola": "bola.glb"
}

@app.route('/traducao', methods=['GET'])
def traducao():
    texto = request.args.get('texto', '').lower()
    palavras = texto.split()
    sinais = []

    for palavra in palavras:
        if palavra in banco_de_sinais:
            sinais.append(banco_de_sinais[palavra])

    return jsonify({
        "texto": texto,
        "sinais": sinais
    })

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
