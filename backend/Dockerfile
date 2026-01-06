FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create uploads directory for product images
RUN mkdir -p uploads/products

EXPOSE 3000

CMD ["node", "dist/main"]
