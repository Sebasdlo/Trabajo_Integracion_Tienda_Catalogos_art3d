FROM python:3.13-alpine

RUN apk add --no-cache gcc libffi-dev make musl-dev openssl-dev

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
