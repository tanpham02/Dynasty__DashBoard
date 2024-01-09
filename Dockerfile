# Specify the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /pages

# Copy the package.json and package-lock.json files to the container
COPY package.json ./

# Install dependencies
# RUN yarn install
RUN yarn install --frozen-lockfile
# RUN yarn install serve
RUN yarn cache clean

# Copy the rest of the application code to the container
COPY . .


# Expose port 1311
EXPOSE 1311

# Start the server
CMD ["yarn", "dev"]
