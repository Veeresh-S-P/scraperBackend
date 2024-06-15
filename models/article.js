const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title: String,
    author: String,
    publicationDate: String,
    url: String
}, {
    versionKey: false,
    timestamps: true
});

const Article = mongoose.model('article', articleSchema);

module.exports = {
    Article
};
