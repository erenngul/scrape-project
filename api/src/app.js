const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/:brand", async (req, res) => {
  try {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: 'new',
      ignoreHTTPSErrors: true
    });
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
  } catch (err) { }
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
