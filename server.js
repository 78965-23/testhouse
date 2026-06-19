const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================
// 1. SERVE STATIC FILES FROM THE 'public' FOLDER
// ============================================================
app.use(express.static('public'));

// ============================================================
// 2. DATA STORAGE (persistent disk on Render)
// ============================================================
const DATA_DIR = process.env.RENDER_DISK_PATH || './data';
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ applications: [] }));
}

// Helper functions
function readData() {
    try {
        const raw = fs.readFileSync(DATA_FILE);
        return JSON.parse(raw);
    } catch (e) {
        return { applications: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ============================================================
// 3. API ROUTES
// ============================================================
app.get('/api/applications', (req, res) => {
    const data = readData();
    res.json(data.applications);
});

app.post('/api/applications', (req, res) => {
    const data = readData();
    const newApp = req.body;
    newApp.id = Date.now();
    data.applications.push(newApp);
    writeData(data);
    res.status(201).json(newApp);
});

app.put('/api/applications/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.applications.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }
    data.applications[index] = { ...data.applications[index], ...req.body };
    writeData(data);
    res.json(data.applications[index]);
});

app.delete('/api/applications/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    data.applications = data.applications.filter(a => a.id !== id);
    writeData(data);
    res.status(204).send();
});

// ============================================================
// 4. FALLBACK – serve index.html for any unknown route
// ============================================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// 5. START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Data stored at ${DATA_FILE}`);
    console.log(`🔑 Admin password: 08092003`);
});
