const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

app.get('/', (req, res) => {
  const {param1} = req.query;

  res.send('Hello World!<br>Param1 = ' + param1);
});

