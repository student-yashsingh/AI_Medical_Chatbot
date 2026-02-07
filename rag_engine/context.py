import sys
from retriever import retrieve

if __name__ == "__main__":
    query = sys.argv[1]

    chunks = retrieve(query, top_k=5)

    context = "\n\n".join(chunks)

    print(context)
