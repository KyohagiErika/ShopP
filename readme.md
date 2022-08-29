# ShopP Project
_Author_:
* _Le Thanh Long_
* _Vo Minh Tien_
* _Pham Cong Minh_
* _Thai Thi Ngoc Kim_
* _Nguyen Gia Linh_
* _Tran Van Tho_
* _Bui Phan Long_

_Created day_: 08/04/2022

## How It Work?
This is a `Typescript` web application server powered by [Express](https://expressjs.com/) framework. Run the project by the following terminal command:
```
npm run build
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
* `models` - contains the models.

Outside the `src` dir, we also want to specify the `.env` which contains the environment variables.