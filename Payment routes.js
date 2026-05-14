app.post('/api/payments', (req, res) => {
    const { AmountPaid, PaymentDate, RecordNumber } = req.body;
    const sql = 'INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?)';
    db.query(sql, [AmountPaid, PaymentDate, RecordNumber], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Payment recorded', insertId: result.insertId });
    });
});