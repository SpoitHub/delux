FROM python:3.11-slim

WORKDIR /app

RUN pip install docker prometheus-client

COPY exporter.py .

EXPOSE 8888

CMD ["python", "exporter.py"]
