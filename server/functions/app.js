const puppeteer = require('puppeteer');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

router.get("/api/:brand", async (req, res) => { 
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

app.use('/api/', router);

export const handler = serverless(app);

app.listen(5000, () => console.log("Server started on port 5000"));