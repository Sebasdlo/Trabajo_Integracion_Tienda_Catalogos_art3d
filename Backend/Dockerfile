FROM python:3.13-alpine

# Instalar dependencias del sistema necesarias para muchas librerías de Python
RUN apk add --no-cache gcc libffi-dev musl-dev openssl-dev

WORKDIR /app

# Copiar primero el archivo de requerimientos para aprovechar el cache de Docker
COPY Requirements.txt .

# Instalar dependencias de Python
RUN pip install --upgrade pip && pip install --no-cache-dir -r Requirements.txt

# Copiar el resto del código
COPY . .

# Puerto que expondrá el contenedor
EXPOSE 5000

# Comando de inicio
CMD ["python", "app.py"]
