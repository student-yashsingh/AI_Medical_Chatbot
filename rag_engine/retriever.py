import faiss
import pickle
from sentence_transformers import SentenceTransformer

# -----------------------------
# PATHS
# -----------------------------
INDEX_PATH = "faiss_index/index.faiss"
CHUNKS_PATH = "faiss_index/chunks.pkl"

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAISS index
index = faiss.read_index(INDEX_PATH)

# Load chunks
with open(CHUNKS_PATH, "rb") as f:
    chunks = pickle.load(f)


# -----------------------------
# RETRIEVE FUNCTION
# -----------------------------
def retrieve(query, top_k=5):
    query_embedding = model.encode([query])

    distances, indices = index.search(query_embedding, top_k)

    results = []
    for i in indices[0]:
        results.append(chunks[i])

    return results


# -----------------------------
# TEST RETRIEVER
# -----------------------------
if __name__ == "__main__":
    question = input("Ask medical question: ")
    retrieved_chunks = retrieve(question)

    print("\n🔍 Top Retrieved Context:\n")
    for idx, chunk in enumerate(retrieved_chunks):
        print(f"\n--- Chunk {idx+1} ---")
        print(chunk[:400])
