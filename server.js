require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

app.post('/call', async (req, res) => {
  const { target, spoof } = req.body;
  try {
    const call = await client.calls.create({
      url: `${process.env.BASE_URL}/twiml?spoof=${spoof}&target=${target}`,
      to: target,
      from: spoof
    });
    res.json({ success: true, sid: call.sid });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

app.get('/twiml', (req, res) => {
  res.type('text/xml');
  res.send(`
    <Response>
      <Dial callerId="${req.query.spoof}">${req.query.target}</Dial>
    </Response>
  `);
});

app.listen(3000, () => console.log('running on 3000'));
