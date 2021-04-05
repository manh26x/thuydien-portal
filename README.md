# SaleWebPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Triển khai ứng dụng lên Docker
1. Cài đặt biến môi trường cho ứng dụng trên Docker tại: [environment.docker](src/environments/environment.docker.ts).
1. Chạy `docker build -t sale-web-portal .` để tạo Docker image
1. Chạy ứng dụng
- Run command `docker run --name sale-web-portal -d -p 80:80 sale-web-portal`
- Use docker-compose `docker-compose up -d`


## Chạy ứng dụng trên môi trường nhà phát triển
1. Cài đặt proxy cho môi trường phát triển tại: [proxy.conf.json](proxy.conf.json)
1. Chạy `npm start`. 
1. Mở trình duyệt theo đường dẫn `http://localhost:4200/`.

## Tài liệu
- [Angular Docs](https://angular.io/docs)
- [Angular CLI Overview and Command Reference](https://angular.io/cli).
