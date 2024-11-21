import express from 'express';
import { WebSocketServer } from 'ws'; // Correct import for ES modules
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/func', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quadEqa.html'));
});
app.get('/factor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'factor.html'));
});
// Start the HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
