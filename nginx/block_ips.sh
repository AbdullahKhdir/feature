#!/bin/bash

# Path to the NGINX access log
ACCESS_LOG="/var/log/nginx/access.log"

# Path to the NGINX configuration file for blocking IPs
BLOCKED_IPS_CONF="/etc/nginx/blocked_ips.conf"

# Path to the file that tracks blocked IPs and their timestamps
BLOCKED_IPS_TRACK="/etc/nginx/blocked_ips_track.txt"

# Threshold for blocking IPs (number of requests)
REQUEST_THRESHOLD=100

# Get the current date in the log format (e.g., 15/Oct/2024)
CURRENT_DATE=$(date +"%d/%b/%Y")
CURRENT_TIMESTAMP=$(date +%s)

# Temporary file to store IPs that exceed the threshold
TEMP_BLOCKED_IPS="/tmp/blocked_ips.txt"

# Ensure the blocked IPs configuration file exists, if not, create it
if [ ! -f "$BLOCKED_IPS_CONF" ]; then
    echo "# Blocked IPs" > "$BLOCKED_IPS_CONF"
fi

# Ensure the blocked IPs track file exists, if not, create it
if [ ! -f "$BLOCKED_IPS_TRACK" ]; then
    touch "$BLOCKED_IPS_TRACK"
fi

# Find IPs in the access log that made more than the threshold number of requests today
awk -v date="$CURRENT_DATE" '$4 ~ date {print $1}' "$ACCESS_LOG" | sort | uniq -c | awk -v threshold="$REQUEST_THRESHOLD" '$1 > threshold {print $2}' > "$TEMP_BLOCKED_IPS"

# Temporary file for tracking active blocked IPs
TEMP_TRACK="/tmp/blocked_ips_track_temp.txt"
> "$TEMP_TRACK"

# Read the existing blocked IPs and their timestamps, and keep only those blocked for less than 24 hours
if [ -f "$BLOCKED_IPS_TRACK" ]; then
    while IFS= read -r line; do
        IP=$(echo "$line" | awk '{print $1}')
        BLOCKED_TIME=$(echo "$line" | awk '{print $2}')
        # Calculate the time difference in seconds (24 hours = 86400 seconds)
        TIME_DIFF=$((CURRENT_TIMESTAMP - BLOCKED_TIME))
        if [ "$TIME_DIFF" -lt 86400 ]; then
            # IP is still within the 24-hour block period, keep it in the block list
            echo "deny $IP;" >> "$BLOCKED_IPS_CONF"
            echo "$IP $BLOCKED_TIME" >> "$TEMP_TRACK"
        fi
    done < "$BLOCKED_IPS_TRACK"
fi

# Add new IPs to the block list with the current timestamp
while IFS= read -r ip; do
    # If the IP is not already in the list, add it
    if ! grep -q "$ip" "$TEMP_TRACK"; then
        echo "deny $ip;" >> "$BLOCKED_IPS_CONF"
        echo "$ip $CURRENT_TIMESTAMP" >> "$TEMP_TRACK"
    fi
done < "$TEMP_BLOCKED_IPS"

# Update the tracking file with the new list of blocked IPs and their timestamps
mv "$TEMP_TRACK" "$BLOCKED_IPS_TRACK"

# Reload NGINX to apply the changes (avoiding restart)
if nginx -t &> /dev/null; then
    nginx -s reload
    echo "NGINX configuration reloaded successfully."
else
    echo "NGINX configuration test failed. Not reloading."
    exit 1
fi

# Clean up
rm -f "$TEMP_BLOCKED_IPS"
