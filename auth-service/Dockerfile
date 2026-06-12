# Usa la imagen oficial de Node.js
FROM node:18

# Crea el directorio de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json (para aprovechar la caché de Docker)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copia el resto del código
COPY . .

# Compilar el proyecto NestJS
RUN npm run build

# Instala las dependencias dentro del contenedor
RUN npm ci --omit=dev


# Expone el puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "start:prod"]
