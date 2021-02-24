# stage 1 as builder
FROM ebit-registry.tpb.vn/node:12-alpine as builder

RUN mkdir /sale-web-portal

WORKDIR /sale-web-portal

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

RUN npm config set proxy ${TPB_PROXY}
RUN npm set strict-ssl false


# Install the dependencies and make the folder
RUN npm install

RUN npx ngcc --properties es2015 --create-ivy-entry-points

COPY . .

# Build the project and copy the files
RUN npm run ng build -- --configuration=docker

# Stage 2
FROM ebit-registry.tpb.vn/rhel8-nginx118:latest

USER 0

COPY ./nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /var/www/sale-web-portal/*

# Copy from the stage 1
COPY --from=builder /sale-web-portal/dist/sale-web-portal /var/www/sale-web-portal

RUN chown -R 1001:0 /var/www/sale-web-portal

USER 1001

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
