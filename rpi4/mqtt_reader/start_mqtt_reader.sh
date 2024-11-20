#!/bin/bash
mosquitto -c /etc/mosquitto/mosquitto.conf &
python3 /app/mqtt_reader.py
