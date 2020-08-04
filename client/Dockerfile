FROM nginx:stable-alpine
COPY build/ /app-build
RUN cp -r app-build/* /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]