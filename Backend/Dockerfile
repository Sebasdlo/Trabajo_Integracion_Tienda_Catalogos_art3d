FROM python:3.13-alpine

WORKDIR /app

COPY Requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r Requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
