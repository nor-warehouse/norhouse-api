import * as express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('<h1>sistema</h1>');
});

app.listen(port, () => console.log(`Typescript app listening on port ${port}!`));
