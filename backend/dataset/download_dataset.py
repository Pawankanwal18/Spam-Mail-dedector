import os
import urllib.request
import zipfile

def download_dataset():
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00228/smsspamcollection.zip"
    dataset_dir = os.path.join(os.path.dirname(__file__), "..", "dataset")
    os.makedirs(dataset_dir, exist_ok=True)

    zip_path = os.path.join(dataset_dir, "smsspamcollection.zip")
    extract_dir = dataset_dir

    if not os.path.exists(os.path.join(extract_dir, "SMSSpamCollection")):
        print(f"Downloading dataset from {url}...")
        urllib.request.urlretrieve(url, zip_path)
        print("Extracting...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        os.remove(zip_path)
        print("Dataset downloaded and extracted.")
    else:
        print("Dataset already exists.")

if __name__ == "__main__":
    download_dataset()
