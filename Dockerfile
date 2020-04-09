FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If build for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8886
CMD [ "node", "app.js" ]