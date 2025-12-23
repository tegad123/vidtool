# Base image with Node 18 (Bookworm has Python 3.11+)
FROM node:18-bookworm-slim

# Install system dependencies (FFmpeg, Python, etc.)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Install Whisper (OpenAI)
# Note: This pulls in PyTorch which makes the image large.
# We upgrade pip first to avoid issues.
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir openai-whisper

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
