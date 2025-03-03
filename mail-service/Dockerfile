# Usar una imagen base de Node.js
FROM node:18 AS build

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Compilar el proyecto NestJS
RUN npm run build

# Copiar los archivos .proto a la carpeta dist
RUN mkdir -p dist/shared/protos && cp -r src/shared/protos/* dist/shared/protos/

# Establecer el puerto en el que la app va a correr
EXPOSE 3006

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"]
