# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install
RUN npm install -g nodemon

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port on which your Express app runs
EXPOSE 3000

# Command to run your application using nodemon
CMD ["npm", "start"]
