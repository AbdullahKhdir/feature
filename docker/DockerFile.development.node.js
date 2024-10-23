# Use Node.js v22.9.0 as the base image
FROM node:22.9.0

# Install tzdata and set timezone to Berlin
RUN apt-get update && apt-get install -y tzdata sudo && \
    ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

# Set the working directory
WORKDIR /nodeApp

# Copy only package.json and package-lock.json first, for efficient caching
COPY package*.json ./

# Set environment (Development as default for flexibility)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies for development
RUN npm install

# Install pm2, nodemon, and concurrently globally
RUN npm install pm2 nodemon concurrently -g

# Copy the rest of the application files
COPY . .

# Set ownership of the directory to the node user (if needed)
RUN chown -R node:node /nodeApp

# Clean up apt cache to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose ports for the app
EXPOSE 8010
# EXPOSE 9229

# Add a health check to ensure the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8010/ || exit 1

# Set environment variables for PM2
ENV PM2_PUBLIC_KEY vhzoouw1069v524
ENV PM2_SECRET_KEY kdyn98t082ipw3y

# Use the wait-for-db.sh script as the entrypoint
# ENTRYPOINT ["/nodeApp/wait-for-db.sh"]

# CMD to run database migration first, then start PM2
CMD ["concurrently", "\"node dist/core/database/migrations/execute_migrations/ExecuteSQL.js\"", "\"node_modules/pm2/bin/pm2-runtime start dist/Server.js -i max --watch\""]

RUN ls -al /nodeApp/dist/
