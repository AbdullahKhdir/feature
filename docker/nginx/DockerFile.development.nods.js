FROM nginx:latest

# Install curl
RUN apt-get update && apt-get install -y curl

# Copy over your NGINX configuration
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/blocked_ips.conf /etc/nginx/blocked_ips.conf
COPY ./nginx/logs /var/log/nginx
COPY ./nginx/certs /etc/nginx/certs
COPY ./nginx/error_pages /etc/nginx/error_pages
COPY ./nginx/block_ips.sh /var/nginx/scripts/block_ips.sh