# Using Node 20 as base, installing LibreOffice for PDF conversion.
FROM node:20-bullseye

# Install libreoffice for pdf generation
RUN apt-get update && apt-get install -y libreoffice

WORKDIR /app

# Copy package config
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build step
RUN npx prisma generate
RUN npm run build

# Start the application
CMD ["npm", "start"]
