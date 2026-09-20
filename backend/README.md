# Backend - Spam Mail Detector

Flask API server for spam mail detection using Machine Learning and NLP.

## Setup

```bash
cd backend
pip install -r requirements.txt
```

## Download Dataset

```bash
cd dataset
python download_dataset.py
```

## Train Model

```bash
cd model
python train_model.py
```

## Run API

```bash
cd ..
python app.py
```

API runs at http://localhost:5000

## Endpoints

- `GET /health` - Health check
- `POST /predict` - Predict spam/ham
- `GET /metrics` - Model evaluation metrics
