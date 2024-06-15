const express = require('express');
const { scrapeArticles, getArticles } = require('../controllers/scrapeController');

const router = express.Router();

router.post('/scrape', scrapeArticles);
router.get('/articles', getArticles);

module.exports = router;
