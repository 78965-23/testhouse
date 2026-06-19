const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// SERVE STATIC FILES FROM BOTH ROOT AND 'public'
// =============================================
app.use(express.static('.'));        // Serve files from root (including index.html)
app.use(express.static('public'));   // Serve files from public/ (CSS, JS, other HTML)

// =============================================
// CATCH-ALL – serve index.html from root
// =============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
