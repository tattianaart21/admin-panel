FROM harbor.sberdevices.ru/proxy/node:22-alpine AS builder

WORKDIR /app
COPY package*.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build

FROM harbor.sberdevices.ru/proxy/nginx:alpine3.23

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
RUN chmod a+rx /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]