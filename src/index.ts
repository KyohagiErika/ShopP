import express from 'express';
import ShopPConfig from './utils/shopp.config';
import routes from './routes';
import { ShopPDataSource } from './data';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import chalk from 'chalk';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(routes);

const server = http.createServer(app);

ShopPDataSource.initialize()
  .then(source => {
    server.listen(ShopPConfig.PORT, () => {
      console.log(
        chalk.bold(
          chalk.magenta(`Server is listenning at port ${ShopPConfig.PORT}!`)
        )
      );
      server.emit('ok');
    });
  })
  .catch(err => {
    console.error(
      chalk.red('There are some errors while initialzing data source!')
    );
    console.error('Detail:');
    console.log(err);
    process.exit(1);
  });

export default server;
