import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import puppeteer from 'puppeteer';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/api/:brand', async (req, res) => {
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

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
