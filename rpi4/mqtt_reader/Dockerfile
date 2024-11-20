FROM python:3.11

RUN apt update
RUN apt install -y mosquitto
COPY mosquitto.conf /etc/mosquitto/

RUN mkdir /app/

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
COPY mqtt_reader.py /app/mqtt_reader.py
COPY start_mqtt_reader.sh /app/start_mqtt_reader.sh
RUN chmod +x /app/start_mqtt_reader.sh

CMD ["/app/start_mqtt_reader.sh"]
