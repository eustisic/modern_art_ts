# Base image
FROM node:latest

# current working directory
WORKDIR /opt/app

# Copy package and package lock
COPY package*.json ./

# Install dependencies
RUN npm i

# copy src code
COPY . .

# Install dependecies and compile TypeScript
RUN npm run build

EXPOSE 5000

# start application
CMD ["npm", "start"]
