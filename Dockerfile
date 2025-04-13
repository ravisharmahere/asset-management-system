# Use an official lightweight Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (assumes you have a build script defined)
RUN npm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Start the application (adjust to your start script)
CMD ["npm", "run", "start:prod"]
