FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Service này sẽ chạy ở cổng 5001 (vì 5000 là của student-service)
EXPOSE 5001 
CMD ["npm", "start"]