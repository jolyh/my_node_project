FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Vite dev server default port
EXPOSE 5173

# Run the Vite dev server with host flag so Docker can expose it
CMD ["npm", "run", "dev", "--", "--host"]