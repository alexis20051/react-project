app.get('/api/reports/daily', (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const sql = `
        SELECT c.PlateNumber, p.PackageName, p.PackageDescription,
               pay.AmountPaid, pay.PaymentDate
        FROM Payment pay
        JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
        JOIN Car c ON sp.PlateNumber = c.PlateNumber
        JOIN Package p ON sp.PackageNumber = p.PackageNumber
        WHERE pay.PaymentDate = ?
    `;
    db.query(sql, [today], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});