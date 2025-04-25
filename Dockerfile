FROM nginx:1.19-alpine as prod
# COPY /app/dist /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d
