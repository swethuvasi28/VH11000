const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing "url" query parameter.' });
    }

    const urlList = Array.isArray(url) ? url : [url];

    const fetchPromises = urlList.map(async (u) => {
        try {
            const response = await axios.get(u, { timeout: 500 });
            return response.data.numbers || [];
        } catch (error) {
            console.error(`Error fetching data from ${u}: ${error.message}`);
            return [];
        }
    });

    try {
        const results = await Promise.all(fetchPromises);
        const allNumbers = results.flat();

        const uniqueSortedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

        res.json({ numbers: uniqueSortedNumbers });
    } catch (error) {
        console.error(`Error processing data: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while processing the data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
