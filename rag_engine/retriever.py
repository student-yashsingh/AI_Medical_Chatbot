import os
import faiss
import pickle
from sentence_transformers import SentenceTransformer

# -----------------------------
# ✅ PATH FIX (Absolute Paths)
# -----------------------------
BASE_DIR = os.path.dirname(__file__)

INDEX_PATH = os.path.join(BASE_DIR, "faiss_index", "index.faiss")
CHUNKS_PATH = os.path.join(BASE_DIR, "faiss_index", "chunks.pkl")

# -----------------------------
# ✅ Load Embedding Model
# -----------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# ✅ Load FAISS Index + Chunks
# -----------------------------
index = faiss.read_index(INDEX_PATH)

with open(CHUNKS_PATH, "rb") as f:
    chunks = pickle.load(f)

# -----------------------------
# ✅ RETRIEVE FUNCTION
# -----------------------------
def retrieve(query, top_k=5):
    """
    Takes user query, finds top_k most relevant chunks from FAISS,
    and returns them as context.
    """

    # Convert query into embedding
    query_embedding = model.encode([query])

    # Search FAISS index
    distances, indices = index.search(query_embedding, top_k)

    # Collect best chunks
    results = []
    for i in indices[0]:
        if i < len(chunks):
            results.append(chunks[i])

    return results


# -----------------------------
# ✅ TEST RETRIEVER DIRECTLY
# -----------------------------
if __name__ == "__main__":
    question = input("Ask medical question: ")

    retrieved_chunks = retrieve(question)

    print("\n🔍 Top Retrieved Context:\n")
    for idx, chunk in enumerate(retrieved_chunks):
        print(f"\n--- Chunk {idx+1} ---")
        print(chunk[:400])
