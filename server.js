const express = require('express');
const bodyParser = require('body-parser');
const { connection } = require('./connection/db');
const scrapeRoute = require('./routes/scrapeRoute');
const cors = require('cors');
const app = express();
const PORT = 3003;


app.use(cors()); 
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', scrapeRoute);

// MongoDB Connection
connection.then(() => {
console.log('Connected to MongoDB');
}).catch((err) => {
console.error('Failed to connect to MongoDB', err);
});

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

//module.exports = app;