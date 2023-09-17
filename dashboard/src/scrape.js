const fs = require('fs');
const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    // await page.goto('https://www.sikayetvar.com/turkcell')

    // const html = await page.content();

    // const title = await page.evaluate(() => document.title);

    // const text = await page.evaluate(() => document.body.innerText);

    // const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), (e) => e.href));

    // const courses = await page.evaluate(() => Array.from(document.querySelectorAll('#cscourses .card'), (e) => ({
    //     title: e.querySelector('.card-body h3').innerText,
    //     level: e.querySelector('.card-body .level').innerText,
    //     url: e.querySelector('.card-footer a').href
    // })));

    let complaintList = [];
    for (let i = 1; i < 4; i++) {
        await page.goto(`https://www.sikayetvar.com/turkcell?page=${i}`);
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

    // Save data to JSON file
    fs.writeFile('src/complaints.json', JSON.stringify(complaintList), (err) => {
        if (err) throw err;
        console.log('File saved');
    });

    await browser.close();
}

run();