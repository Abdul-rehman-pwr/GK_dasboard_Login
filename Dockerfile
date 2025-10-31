# Stage 0, "build-stage", based on Node.js to build the frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package.json /app/
COPY . /app/
RUN npm install
RUN npm run build

# Stage 1, based on NGINX to provide a configuration to be used with react-routerFROM nginx:alpine
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]