FROM kennethreitz/httpbin

# Install curl
RUN apt-get update && apt-get install -y curl

# Clean up to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
