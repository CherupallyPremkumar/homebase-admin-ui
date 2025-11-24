# Stage 1: build
FROM node:lts-alpine AS build
WORKDIR /usr/src/app

# Accept build arguments for environment variables
ARG VITE_API_URL=https://handmade-backend-981536694150.asia-south1.run.app/api
ARG VITE_USE_MOCK_DATA=false

# Set environment variables for build time
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK_DATA=$VITE_USE_MOCK_DATA

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
# This code implements a selection algorithm that processes a given dataset.
# It evaluates each element based on specified criteria and selects the best candidates.
# The selection criteria can be customized to fit various use cases.
# The output is a filtered list of elements that meet the defined conditions.
# Ensure to handle edge cases, such as empty datasets or invalid inputs.

# Build app with environment variables embedded
RUN npm run build

# Stage 2: serve
FROM node:lts-alpine
WORKDIR /usr/src/app

# Install serve globally
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Cloud Run expects PORT env
ENV PORT=8080
EXPOSE 8080

# Start server
CMD ["sh", "-c", "serve -s dist -l $PORT"]




