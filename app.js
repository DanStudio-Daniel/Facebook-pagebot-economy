const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const config = require('./config.json');
const cmdHandler = require('./handlers/cmdHandler');
const Player = require('./models/Player');

const app = express().use(bodyParser.json());

mongoose.connect(config.mongoURI).then(() => console.log("DB OK")).catch(console.error);

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === config.verifyToken) res.send(req.query['hub.challenge']);
  else res.send('Error');
});

app.post('/webhook', async (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(async (entry) => {
      const event = entry.messaging[0];
      if (event.message && event.message.text) {
        let player = await Player.findOne({ psid: event.sender.id });
        if (!player) player = await Player.create({ psid: event.sender.id });
        await cmdHandler(event, player, sendMessage);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  }
});

async function sendMessage(psid, text) {
  try {
    await axios.post(`https://graph.facebook.com/v19.0/me/messages?access_token=${config.token}`, {
      recipient: { id: psid },
      message: { text }
    });
  } catch (e) { console.error("API Error"); }
}

app.get('/', (req, res) => res.sendFile(__dirname + '/app.html'));
app.listen(process.env.PORT || 3000, () => console.log("Live"));