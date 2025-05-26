FROM python:3.12-slim

WORKDIR /app

COPY Requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r Requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
