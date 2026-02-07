import os
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss
import pickle

# -----------------------------
# CONFIG
# -----------------------------
PDF_PATH = "data/Medical_data.pdf"
INDEX_PATH = "faiss_index/index.faiss"
CHUNKS_PATH = "faiss_index/chunks.pkl"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100

# -----------------------------
# STEP 1: Load PDF Text
# -----------------------------
def load_pdf_text(pdf_path):
    reader = PdfReader(pdf_path)
    full_text = ""

    for page in reader.pages:
        full_text += page.extract_text() + "\n"

    return full_text


# -----------------------------
# STEP 2: Chunking Function
# -----------------------------
def chunk_text(text, chunk_size, overlap):
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap

    return chunks


# -----------------------------
# MAIN INGEST PIPELINE
# -----------------------------
def main():
    print("📌 Loading PDF...")
    text = load_pdf_text(PDF_PATH)

    print("📌 Chunking text...")
    chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)

    print(f"✅ Total chunks created: {len(chunks)}")

    print("📌 Loading embedding model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("📌 Generating embeddings...")
    embeddings = model.encode(chunks)

    print("📌 Creating FAISS index...")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)

    print("📌 Saving index + chunks...")
    faiss.write_index(index, INDEX_PATH)

    with open(CHUNKS_PATH, "wb") as f:
        pickle.dump(chunks, f)

    print("🎉 Ingestion Complete! FAISS index ready.")


if __name__ == "__main__":
    main()
