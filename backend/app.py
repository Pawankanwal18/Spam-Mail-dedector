from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import json
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

app = Flask(__name__)
CORS(app)

# Global model storage
model = None
vectorizer = None
metrics = None
preprocessor_stopwords = None


def load_artifacts():
    global model, vectorizer, metrics, preprocessor_stopwords
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base_dir, "model")
    if not os.path.exists(os.path.join(model_dir, "spam_model.pkl")):
        model_dir = os.path.join(os.path.dirname(base_dir), "model")

    model_path = os.path.join(model_dir, "spam_model.pkl")
    vectorizer_path = os.path.join(model_dir, "vectorizer.pkl")
    metrics_path = os.path.join(model_dir, "metrics.json")
    config_path = os.path.join(model_dir, "preprocessor_config.json")

    if not all(os.path.exists(p) for p in [model_path, vectorizer_path, metrics_path]):
        print("ERROR: Model artifacts not found. Run train_model.py first.")
        return False

    with open(model_path, "rb") as f:
        model = pickle.load(f)
    with open(vectorizer_path, "rb") as f:
        vectorizer = pickle.load(f)
    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            config = json.load(f)
            preprocessor_stopwords = set(config.get("stopwords", []))
    else:
        preprocessor_stopwords = set(stopwords.words('english'))

    print(f"Model loaded: {metrics.get('model_name', 'Unknown')}")
    print(f"Accuracy: {metrics.get('accuracy', 0):.4f}")
    return True


def preprocess_text(text):
    if not isinstance(text, str) or not text.strip():
        return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = word_tokenize(text)
    tokens = [t for t in tokens if t not in preprocessor_stopwords and len(t) > 2]
    return " ".join(tokens)


@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})


@app.route('/predict', methods=['POST'])
@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' field"}), 400

    message = data['message']
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "Message cannot be empty"}), 400

    if len(message) > 10000:
        return jsonify({"error": "Message too long (max 10000 characters)"}), 400

    processed = preprocess_text(message)
    if not processed:
        return jsonify({"error": "Message contains no recognizable text"}), 400

    try:
        tfidf = vectorizer.transform([processed])
        spam_prob = float(model.predict_proba(tfidf)[0][1])
        ham_prob = float(model.predict_proba(tfidf)[0][0])
        prediction = "spam" if spam_prob >= 0.5 else "ham"

        return jsonify({
            "prediction": prediction,
            "spam_probability": round(spam_prob, 4),
            "ham_probability": round(ham_prob, 4),
            "confidence": round(max(spam_prob, ham_prob), 4)
        })
    except Exception:
        return jsonify({"error": "Prediction failed"}), 500


@app.route('/metrics', methods=['GET'])
@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    if metrics is None:
        return jsonify({"error": "Metrics not available"}), 503
    return jsonify(metrics)


if __name__ == '__main__':
    load_artifacts()
    app.run(host='0.0.0.0', port=5000, debug=False)
