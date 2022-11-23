# ShopP Project
_Author_:
* _Le Thanh Long_ - Project Leader
* _Pham Cong Minh_ - Front-End Leader
* _Vo Minh Tien_ - Back-End Leader
* _Thai Thi Ngoc Kim_ - Front-End Developer
* _Bui Phan Long_ - Front-End Developer
* _Nguyen Gia Linh_ - Back-End Developer
* _Tran Van Tho_ - Back-End Developer

_Created day_: 04/08/2022

## Build with Docker
```
docker compose --env-file .env.deploy build
docker compose --env-file .env.deploy up -d
```

## How It Work?
This is a `Typescript` web application server powered by [Express](https://expressjs.com/) framework.

* First copy the `.env.local` to `.env` at the same folder (don't remove the `.env.local`).

* Create a MySQL database and specify the configuration in the `.env` file.

* Run the project by the following terminal command:
```
npm install
npm run build
npm run init-database
npm start
```
### Prerequisites
* WEB architecture and organization
* REST API
* [NodeJS](https://nodejs.dev/en/learn/introduction-to-nodejs)
* [Typescript](https://www.typescriptlang.org/docs/)
* [Express](https://expressjs.com/)
* [TypeOrm](https://typeorm.io/)
* [MySQL Server](https://www.mysql.com/)
### Organization
The `root` dir of the project is the `src` folder which has the following structure:
* `index.ts` - the main file to be started.
* `data.ts` - contains the data source of the project.
* `utils` - contains utilies of the project.
* `routes` - where to specify routes.
* `middlewares` - place to push middlewares.
* `entities` - contains the specifications of models (TypeOrm Entity).
* `migrations` - contains the migrations.
* `models` - contains the models.

Outside the `src` dir, we also want to specify the `.env` which contains the environment variables.

__NOTE:__
* Always have the `.env` up-to-dated with the `.env.local`.
* Update the `.env.local` (if necessary) before pushing again. 
### CLI
```
npm run <cli>
```
* `build` - build the project.
* `start` - start the project.
* `init-database` - synchronize the database with the entities.
* `generate-migration` - generate migration files with schema changes
