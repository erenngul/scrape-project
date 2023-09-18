const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

async function getHtml(req, res, path = '') {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        let complaintList = [];
        if (path === "game") {
            await page.goto(`https://www.sikayetvar.com/geforce-now-powered-by-game?page=2`);
        }
        else {
            await page.goto(`https://www.sikayetvar.com/${path === '' ? '' : path + '/'}${req.params.brand}?page=${1}`);
        }
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
        complaintList = complaintList.flat();
        console.log(complaintList);
        res.json(complaintList);
        await browser.close();
    }
    catch (err) {
        res.json([{
            title: "Error",
            username: "",
            time: "",
            description: "",
            link: ""
        }]);
    }
}

app.get("/:brand", (req, res) => {
    if (req.params.brand === "game") {
        getHtml(req, res, "game");
    }
    else {
        getHtml(req, res);
    }
});

app.get("/turkcell/:brand", (req, res) => {
    getHtml(req, res, "turkcell");
});

app.listen(5000, () => console.log("Server started on port 5000"));