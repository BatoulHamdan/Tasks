# Use official Node.js image
FROM node:20

# Set working directory in container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
