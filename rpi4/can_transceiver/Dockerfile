FROM python:3.11

RUN mkdir /app/

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY can_transceiver.py /app/can_transceiver.py

CMD ["python3", "/app/can_transceiver.py"]