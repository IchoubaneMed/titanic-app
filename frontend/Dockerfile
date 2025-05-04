# Use specific Node.js version
FROM node:18.18.0-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json ./
RUN npm install

# Copy app code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]