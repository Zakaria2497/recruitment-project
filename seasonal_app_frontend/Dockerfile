# Use Node.js 20 alpine image
FROM node:20-alpine

# Set work directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy project files
COPY . .

# Expose port
EXPOSE 5173

# Run the development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
