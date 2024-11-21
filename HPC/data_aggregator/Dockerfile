FROM python:3.13

RUN mkdir /app/

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY data_aggregator.py /app/data_aggregator.py

CMD ["python3", "/app/data_aggregator.py"]