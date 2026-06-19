const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// DEBUG – log current directory and check files
// =============================================
console.log('Current directory:', __dirname);
const publicPath = path.join(__dirname, 'public');
console.log('Public folder path:', publicPath);
console.log('Does public folder exist?', fs.existsSync(publicPath));
console.log('Does index.html exist?', fs.existsSync(path.join(publicPath, 'index.html')));

// =============================================
// SERVE STATIC FILES
// =============================================
app.use(express.static(publicPath));

// =============================================
// CATCH-ALL – serve index.html
// =============================================
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.html not found. Make sure it is inside the "public" folder.');
    }
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Open http://localhost:${PORT}`);
});
