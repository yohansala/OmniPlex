from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Permite conectar con tu página web

@app.route("/")
def home():
    return {"status": "ok", "message": "API BCV con Flask activa 🚀"}

@app.route("/tasas", methods=["GET"])
def obtener_tasas():
    url = "https://www.bcv.org.ve/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, verify=False, timeout=10)
        soup = BeautifulSoup(response.content, "html.parser")
        
        dolar = soup.find("div", id="dolar").find("strong").text.strip().replace(",", ".")
        euro = soup.find("div", id="euro").find("strong").text.strip().replace(",", ".")
        yuan = soup.find("div", id="yuan").find("strong").text.strip().replace(",", ".")
        lira = soup.find("div", id="lira").find("strong").text.strip().replace(",", ".")
        rublo = soup.find("div", id="rublo").find("strong").text.strip().replace(",", ".")
        
        return jsonify({
            "success": True,
            "tasas": {
                "USD": float(dolar),
                "EUR": float(euro),
                "CNY": float(yuan),
                "TRY": float(lira),
                "RUB": float(rublo)
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "mensaje": "No se pudo conectar con el BCV"
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
