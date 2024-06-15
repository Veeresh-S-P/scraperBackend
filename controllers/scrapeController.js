const puppeteer = require('puppeteer');
const { Article } = require('../models/article');

const scrapeArticles = async (req, res) => {
    try {
        const { topic } = req.body;
        console.log(`Scraping articles for topic: ${topic}`);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://medium.com/search?q=${topic}`, {
            waitUntil: 'networkidle2'
        });

        // Wait for the selector to be available
        await page.waitForSelector('article');

        const articles = await page.evaluate(() => {
            let articles = [];
            const articleElements = document.querySelectorAll('article');
            articleElements.forEach((element) => {
                const title = element.querySelector('a > h2')?.innerText || 'No title';
                const author = element.querySelector('div > div > a > p')?.innerText || 'No author';
                const publicationDate = element.querySelector('.b1 > span')?.innerText || 'No date';
                let url;
                const divWithRoleLink = element.querySelector('div[role="link"]');
                if (divWithRoleLink) {
                    url = (divWithRoleLink.getAttribute('data-href')) || 'No URL';
                }

                articles.push({ title, author, publicationDate, url });
            });

            return articles.slice(0, 5);
        });

        await browser.close();

        // Save articles to the database
        if (articles.length > 0) {
            await Article.insertMany(articles);
            console.log(`Inserted ${articles.length} articles into the database`);
            res.status(200).json(articles);
        } else {
            throw new Error('No articles found');
        }
    } catch (error) {
        console.error('Scraping error:', error.message);
        res.status(500).json({ error: 'Scraping failed. Please try again later.' });
    }
};

const getArticles = async (req, res) => {
    try {
        const articles = await Article.find({});
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        res.status(500).json({ error: 'Failed to fetch articles.' });
    }
};

module.exports = {
    scrapeArticles,
    getArticles
};



// root co bg cp cq cr cs

//url be b in z ee hl ef eg eh ei ej ek bj

//tittle <h2 class="be jh my mz na nb nc nd ne nf ng nh ni nj nk nl nm nn no np nq nr ns nt nu nv nw ee ef eg ei ek bj">Deep Dive into JavaScript Scope and Hoisting</h2>

//#root > div > div.l.c > div.ca.cb.l > div > main > div > div > div: nth - child(2) > div > div: nth - child(9) > article > div > div > div > div > div: nth - child(1) > div > div: nth - child(2) > div.l.ck.jk > div.mo.mp.mq.mr.ms.mt.mu.mv.mw.mx > a > h2

// publication date .b1 > span

//*[@id="root"]/div/div[3]/div[2]/div/main/div/div/div[2]/div/div[1]/article/div/div/div/div/div[1]/div/div[2]/div[1]/div[2]/div/span

// image <img alt="5 amazing new JavaScript features in ES15 (2024)" class="bw pd" src="https://miro.medium.com/v2/resize:fill:80:53/1*IPn6YG_9vnMs3vktlz1x5A.png" width="80" height="53" loading="lazy">
// author <p class="be b in z ee hl ef eg eh ei ej ek bj">Tari Ibaba</p>




