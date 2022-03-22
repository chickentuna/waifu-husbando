FROM node:14.18


# Packages
WORKDIR /var/www/html/client
COPY client/package.json .
COPY client/package-lock.json .
WORKDIR /var/www/html/server
COPY client/package.json .
COPY client/package-lock.json .

# NPM dependencies
WORKDIR /var/www/html/client
RUN npm ci
WORKDIR /var/www/html/server
RUN npm ci

# Builds
WORKDIR /var/www/html/client
#44 MB ??? my source code is not that big!
COPY client .
RUN [ "npm", "run", "build" ]

WORKDIR /var/www/html/server
#same here
COPY server .
RUN [ "npm", "run", "build" ]

# Expose port
EXPOSE 3000

# Run bot
ENTRYPOINT [ "node", "dist/main.js" ]