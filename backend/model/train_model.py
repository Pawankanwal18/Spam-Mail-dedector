import os
import sys
import json
import pickle
import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)


class TextPreprocessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    def preprocess(self, text):
        if not isinstance(text, str) or not text.strip():
            return ""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        tokens = word_tokenize(text)
        tokens = [t for t in tokens if t not in self.stop_words and len(t) > 2]
        return " ".join(tokens)


def load_dataset(path=None):
    if path is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path = os.path.join(base_dir, "dataset", "SMSSpamCollection")

    if not os.path.exists(path):
        print(f"Dataset not found at {path}")
        print("Please download the dataset from: https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip")
        print("Extract SMSSpamCollection to backend/dataset/")
        sys.exit(1)

    df = pd.read_csv(path, sep='\t', header=None, names=['label', 'message'])
    df['label'] = df['label'].map({'ham': 0, 'spam': 1})
    df = df.dropna()
    df = df.drop_duplicates()
    print(f"Dataset loaded: {len(df)} messages")
    print(f"Spam: {df['label'].sum()}, Ham: {len(df) - df['label'].sum()}")
    return df


def train():
    print("Loading dataset...")
    df = load_dataset()

    print("Preprocessing text...")
    preprocessor = TextPreprocessor()
    df['processed'] = df['message'].apply(preprocessor.preprocess)

    X = df['processed']
    y = df['label']

    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("TF-IDF Vectorization...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        max_features=5000
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("Training Multinomial Naive Bayes...")
    nb_model = MultinomialNB(alpha=0.1)
    nb_model.fit(X_train_tfidf, y_train)
    nb_pred = nb_model.predict(X_test_tfidf)
    nb_acc = accuracy_score(y_test, nb_pred)
    print(f"Naive Bayes Accuracy: {nb_acc:.4f}")

    print("Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42, C=1.0)
    lr_model.fit(X_train_tfidf, y_train)
    lr_pred = lr_model.predict(X_test_tfidf)
    lr_acc = accuracy_score(y_test, lr_pred)
    print(f"Logistic Regression Accuracy: {lr_acc:.4f}")

    # Select best model
    if lr_acc >= nb_acc:
        model = lr_model
        model_name = "LogisticRegression"
        best_acc = lr_acc
    else:
        model = nb_model
        model_name = "MultinomialNB"
        best_acc = nb_acc

    print(f"Selected model: {model_name} (accuracy: {best_acc:.4f})")

    # Final evaluation with best model
    y_pred = model.predict(X_test_tfidf)
    y_prob = model.predict_proba(X_test_tfidf)[:, 1]

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred)),
        "recall": float(recall_score(y_test, y_pred)),
        "f1_score": float(f1_score(y_test, y_pred)),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "model_name": model_name,
        "test_size": len(y_test)
    }

    print("\nFinal Metrics:")
    print(f"  Accuracy:  {metrics['accuracy']:.4f}")
    print(f"  Precision: {metrics['precision']:.4f}")
    print(f"  Recall:    {metrics['recall']:.4f}")
    print(f"  F1 Score:  {metrics['f1_score']:.4f}")
    print(f"  Confusion Matrix: {metrics['confusion_matrix']}")

    # Save artifacts
    model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model")
    os.makedirs(model_dir, exist_ok=True)

    with open(os.path.join(model_dir, "spam_model.pkl"), "wb") as f:
        pickle.dump(model, f)
    with open(os.path.join(model_dir, "vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)
    with open(os.path.join(model_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    # Save preprocessor config (stopwords list)
    with open(os.path.join(model_dir, "preprocessor_config.json"), "w") as f:
        json.dump({"stopwords": list(stopwords.words('english'))}, f)

    print(f"\nModel and artifacts saved to {model_dir}")
    return metrics


if __name__ == "__main__":
    train()
