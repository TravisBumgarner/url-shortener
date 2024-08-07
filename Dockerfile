# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install production dependencies.
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application code.
COPY . .

# Make port 8080 available to the world outside this container.
EXPOSE 8080

# Run the web service on container startup.
CMD [ "node", "server.js" ]