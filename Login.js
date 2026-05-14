// Hardcoded user for simplicity
const USER = { username: 'admin', password: '1234' };

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.user = username;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Middleware to check auth
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Protect routes
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'You have access' });
});