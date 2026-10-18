from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app) # Allows your frontend to talk to this backend

# Put your secret key here
genai.configure(api_key="GEMINI_API_KEY")

@app.route('/analyze', methods=['POST'])
def analyze_issue():
    data = request.json
    user_complaint = data.get("complaint", "")
    
    # Simple instructions telling Gemini how to behave
    prompt = f"You are a smart city assistant. Analyze this citizen complaint: '{user_complaint}'. Give me a response in exactly two sentences: 1. Assign a priority score from 1 to 10. 2. Give a clear action step for the city workers."
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)
    
    return jsonify({"ai_analysis": response.text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)