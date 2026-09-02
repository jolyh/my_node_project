FROM node:20

WORKDIR /app

# Copy dependencies first to use Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

EXPOSE 3000

# Run your nodemon start script
CMD ["npm", "run", "dev"]

# Start the server
# CMD ["npm", "start"]