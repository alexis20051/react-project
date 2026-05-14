// Get all cars
app.get('/api/cars', (req, res) => {
    db.query('SELECT * FROM Car', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Insert car
app.post('/api/cars', (req, res) => {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    const sql = 'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [PlateNumber, CarType, CarSize, DriverName, PhoneNumber], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Car added', insertId: result.insertId });
    });
});