FROM node:14.18

# Install dependencies
WORKDIR /var/www/html/client
COPY client/package.json .
COPY client/package-lock.json .
RUN npm ci

WORKDIR /var/www/html/server
COPY server/package.json .
COPY server/package-lock.json .
RUN npm ci

# Bundle app source and build
WORKDIR /var/www/html/client
COPY client .
RUN [ "npm", "run", "build" ]

WORKDIR /var/www/html/server
COPY server .
RUN [ "npm", "run", "build" ]

# Expose port
EXPOSE 3000

# Run bot
ENTRYPOINT [ "node", "dist/main.js" ]