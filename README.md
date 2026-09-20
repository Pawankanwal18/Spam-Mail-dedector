# Spam Mail Detector

A complete Machine Learning web application that detects spam vs ham messages using NLP and TF-IDF classification.

## Features

- Spam detection using Multinomial Naive Bayes / Logistic Regression
- NLP text preprocessing
- TF-IDF feature extraction
- Confidence scoring with probability visualization
- Model performance metrics dashboard
- Responsive React frontend
- Dark/Light mode toggle
- Example messages for quick testing
- Loading states and error handling

## Tech Stack

### Frontend
- React.js 18
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend
- Python Flask
- Flask-CORS

### Machine Learning / NLP
- scikit-learn
- Pandas
- NumPy
- NLTK
- TF-IDF Vectorizer
- Multinomial Naive Bayes / Logistic Regression

## Project Structure

```text
spam-mail-detector/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MessageAnalyzer.jsx
│   │   │   ├── ModelPerformance.jsx
│   │   │   └── HowItWorks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── backend/
│   ├── app.py
│   ├── model/
│   │   ├── train_model.py
│   │   ├── spam_model.pkl (generated)
│   │   ├── vectorizer.pkl (generated)
│   │   ├── metrics.json (generated)
│   │   └── preprocessor_config.json (generated)
│   ├── dataset/
│   │   ├── download_dataset.py
│   │   └── SMSSpamCollection (raw dataset)
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Dataset Setup

Download the SMS Spam Collection dataset from UCI ML Repository:
```bash
cd backend/dataset
python download_dataset.py
```

Or manually download from: https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip

Extract `SMSSpamCollection` to `backend/dataset/`.

### Train the Model

```bash
cd backend/model
python train_model.py
```

This generates:
- `spam_model.pkl`
- `vectorizer.pkl`
- `metrics.json`
- `preprocessor_config.json`

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Start Flask Backend
```bash
cd backend
python app.py
```

### Terminal 2 - Start Vite Frontend
```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser.

## API Documentation

### GET /health
Returns backend health status and model availability.

### POST /predict
Request:
```json
{ "message": "Congratulations! You won a prize!" }
```

Response:
```json
{
  "prediction": "spam",
  "spam_probability": 0.94,
  "ham_probability": 0.06,
  "confidence": 0.94
}
```

### GET /metrics
Returns model evaluation metrics (accuracy, precision, recall, f1_score, confusion_matrix).

## Machine Learning Workflow

```
Dataset (SMSSpamCollection)
  ↓
Text Preprocessing (lowercase, remove punctuation, tokenize, remove stopwords)
  ↓
TF-IDF Vectorization (ngram_range=(1,2), max_features=5000)
  ↓
Model Training (Multinomial Naive Bayes vs Logistic Regression)
  ↓
Evaluation (Accuracy, Precision, Recall, F1, Confusion Matrix)
  ↓
Model Persistence (pickle files)
  ↓
Prediction via REST API
  ↓
Spam / Ham Classification
```

## Future Improvements

- Email attachment analysis
- URL detection and analysis
- Explainable AI (SHAP/LIME)
- Multilingual spam detection
- Gmail integration
- Phishing detection
- Advanced transformer models (BERT, RoBERTa)
- Real-time email monitoring
- User feedback loop for model improvement
