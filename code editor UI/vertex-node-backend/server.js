const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT = 8000;

app.use(bodyParser.json())

app.post('/api/query-vertex', (req, res) => {
    const { query } = req.body;
    res.json({ response: query });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});