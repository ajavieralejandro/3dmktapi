const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('hello from server');
});

app.listen(port, () => {
  console.log('Im running');
});
