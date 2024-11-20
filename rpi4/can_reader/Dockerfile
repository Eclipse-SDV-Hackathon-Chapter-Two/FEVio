FROM python:3.11

RUN mkdir /app/

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY can_reader.py /app/can_reader.py

CMD ["python3", "/app/can_reader.py"]