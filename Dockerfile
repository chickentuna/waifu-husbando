FROM node:14.18

# Client
WORKDIR /var/www/html/client
COPY client/package.json .
COPY client/package-lock.json .
RUN npm ci

WORKDIR /var/www/html/client
COPY client .
RUN [ "npm", "run", "build" ]

# Server
WORKDIR /var/www/html/server
COPY server/package.json .
COPY server/package-lock.json .
RUN npm ci

WORKDIR /var/www/html/server
COPY server .
RUN [ "npm", "run", "build" ]

# Expose port
EXPOSE 3000

# Run bot
ENTRYPOINT [ "node", "dist/main.js" ]