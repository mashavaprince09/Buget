const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const client = require('twilio')(
  "ACb044a06545af89e5705dc79d0644ea51",
  "9e617a9a6c897faf968e12ec5e6678ad"
);
const cors = require('cors');

const app = express();

// Use cors middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
const PORT = 30030;
console.log("fine1");
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});


app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');

  const { to, body } = req.body;

  if (!to || !body) {
    return res.status(400).json({ success: false, error: 'Both "to" and "body" are required in the request body.' });
  }
console.log("fine");
  client.messages
    .create({
      from: "+14158010952",
      to,
      body,
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to send SMS.' });
    });
});




