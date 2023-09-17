const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const puppeteer = require('puppeteer');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/:brand", async (req, res) => { 
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  let complaintList = [];
  for (let i = 1; i < 2; i++) {
      await page.goto(`https://www.sikayetvar.com/${req.params.brand}?page=${i}`);
      const complaints = await page.$$eval('.card-v2', (elements) => elements.map((e) => {
          if (e.querySelector('.complaint-hidden')) {
              return;
          }
          return {
              title: e.querySelector('.complaint-title').innerText,
              username: e.querySelector('.username').innerText,
              time: e.querySelector('.time').innerText,
              description: e.querySelector('.complaint-description').innerText,
              link: e.querySelector('.complaint-title a').href
          };
      }));
      complaintList.push(complaints);
  }
  complaintList = complaintList.flat();
  console.log(complaintList);
  res.json(complaintList);
  await browser.close();
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
