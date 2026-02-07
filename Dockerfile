FROM python:3.10-slim

# Install Node.js + build tools
RUN apt-get update && apt-get install -y curl build-essential \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy full project
COPY . .

# Expose Render port
ENV PORT=8000
EXPOSE 8000

# Start backend server
CMD ["sh", "-c", "cd backend && node server.js"]
