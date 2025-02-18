const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logMessage = `Request received for path: ${req.url} and from IP: ${req.ip}\nTime: ${timestamp}\n\n`;

    fs.appendFile('logs.log', logMessage, (err) => {
        if (err) {
            console.log('Error in logging');
        }
    });

    next();
});


app.get('/logs', (req, res) => {
    fs.readFile('logs.log', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading log file');
        }
        const logs = data.split('\n').filter(Boolean).map(line => {
            const [path, ip, time] = line.split('\n');
            return { path, ip, time };
        });
        res.json(logs);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});