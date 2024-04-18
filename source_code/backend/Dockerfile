# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and possibly package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port for the backend, aligning with the server's default
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
