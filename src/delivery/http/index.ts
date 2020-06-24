import runAPI from './api';

let port = process.env.PORT;
if (port == null || port == "") {
  port = '8080';
}

runAPI(process.env.PORT);
