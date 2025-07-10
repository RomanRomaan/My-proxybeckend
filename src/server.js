import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZzjfv8iH_nf58SV8t1DK6QUeRFmcb4mb_hvC2zJY6cKLueKvSnUKOjW5nEVjNwfg/exec';

app.get('/', (req, res) => {
    console.log('GET / received');
    res.send('Hello from proxy server!');
});

app.post('/api/submit', async (req, res) => {
    console.log('POST /api/submit', req.body);
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy failed', details: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
