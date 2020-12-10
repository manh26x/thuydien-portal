# SaleWebPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Mock API
- Run `npm run mock` for mock api on port 3000
- Run `npm run start-mock` for a mock server on port 4200

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
- Run `docker build -t sale-web-portal .` to build docker image
## Running

- Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
- Run `docker run --name sale-web-portal -d -p 80:80 sale-web-portal` to start on docker container
## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
