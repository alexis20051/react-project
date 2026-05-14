const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 5001;

// CORS – allow both common dev ports
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'CORS policy does not allow access from this origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(bodyParser.json());
app.use(session({
    secret: 'smartpark_secret_key_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// MySQL connection – adjust credentials if needed
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CWSMS'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('✅ MySQL Connected...');
});

// Auth middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// ==================== AUTH ROUTES ====================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.user = username;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

app.get('/api/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// ==================== CAR ROUTES ====================
app.get('/api/cars', requireAuth, (req, res) => {
    db.query('SELECT * FROM Car', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/cars', requireAuth, (req, res) => {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    const sql = 'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [PlateNumber, CarType, CarSize, DriverName, PhoneNumber], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Car added', insertId: result.insertId });
    });
});

// ==================== PACKAGE ROUTES ====================
app.get('/api/packages', requireAuth, (req, res) => {
    db.query('SELECT * FROM Package', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/packages', requireAuth, (req, res) => {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    const sql = 'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)';
    db.query(sql, [PackageName, PackageDescription, PackagePrice], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Package added', insertId: result.insertId });
    });
});

// ==================== SERVICE PACKAGE ROUTES ====================
app.get('/api/servicepackages', requireAuth, (req, res) => {
    db.query('SELECT * FROM ServicePackage', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/servicepackages', requireAuth, (req, res) => {
    const { ServiceDate, PackageNumber, PlateNumber } = req.body;
    const sql = 'INSERT INTO ServicePackage (ServiceDate, PackageNumber, PlateNumber) VALUES (?, ?, ?)';
    db.query(sql, [ServiceDate, PackageNumber, PlateNumber], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Service record added', insertId: result.insertId });
    });
});

app.put('/api/servicepackages/:id', requireAuth, (req, res) => {
    const { ServiceDate, PackageNumber, PlateNumber } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE ServicePackage SET ServiceDate=?, PackageNumber=?, PlateNumber=? WHERE RecordNumber=?';
    db.query(sql, [ServiceDate, PackageNumber, PlateNumber, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Service record updated' });
    });
});

app.delete('/api/servicepackages/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ServicePackage WHERE RecordNumber=?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Service record deleted' });
    });
});

// ==================== PAYMENT ROUTES ====================
app.post('/api/payments', requireAuth, (req, res) => {
    const { AmountPaid, PaymentDate, RecordNumber } = req.body;
    // Validate that RecordNumber exists
    db.query('SELECT * FROM ServicePackage WHERE RecordNumber = ?', [RecordNumber], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
            return res.status(400).json({ message: 'RecordNumber does not exist' });
        }
        const sql = 'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?)';
        db.query(sql, [AmountPaid, PaymentDate, RecordNumber], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Payment recorded', insertId: result.insertId });
        });
    });
});

// ==================== BILL GENERATION ====================
app.get('/api/bill/:recordNumber', requireAuth, (req, res) => {
    const { recordNumber } = req.params;
    const sql = `
        SELECT sp.RecordNumber, sp.ServiceDate, c.PlateNumber, c.DriverName,
               p.PackageName, p.PackageDescription, p.PackagePrice,
               pay.AmountPaid, pay.PaymentDate
        FROM ServicePackage sp
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package p ON sp.PackageNumber = p.PackageNumber
        LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
        WHERE sp.RecordNumber = ?
    `;
    db.query(sql, [recordNumber], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
        res.json(results[0]);
    });
});

// ==================== DAILY REPORTS ====================
app.get('/api/reports/daily', requireAuth, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const sql = `
        SELECT c.PlateNumber, p.PackageName, p.PackageDescription,
               pay.AmountPaid, pay.PaymentDate
        FROM Payment pay
        JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package p ON sp.PackageNumber = p.PackageNumber
        WHERE DATE(pay.PaymentDate) = ?
    `;
    db.query(sql, [today], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});