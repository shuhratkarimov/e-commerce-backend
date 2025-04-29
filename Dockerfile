FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the application
COPY . .
RUN npm run build

# Expose port and run the application
EXPOSE 3000
CMD ["node", "dist/main"]
