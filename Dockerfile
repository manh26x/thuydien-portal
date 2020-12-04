# stage 1 as builder
FROM node:12-alpine as builder

RUN mkdir /sale-web-portal

WORKDIR /sale-web-portal

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install

RUN npx ngcc --properties es2015 --create-ivy-entry-points

COPY . .

# Build the project and copy the files
RUN npm run ng build -- --prod

# Stage 2
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /var/www/sale-web-portal/*

# Copy from the stage 1
COPY --from=builder /sale-web-portal/dist/sale-web-portal /var/www/sale-web-portal

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
