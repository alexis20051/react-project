// Get all service records
app.get('/api/servicepackages', (req, res) => {
    db.query('SELECT * FROM ServicePackage', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Update service record
app.put('/api/servicepackages/:id', (req, res) => {
    const { ServiceDate, PackageNumber, PlateNumber } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE ServicePackage SET ServiceDate=?, PackageNumber=?, PlateNumber=? WHERE RecordNumber=?';
    db.query(sql, [ServiceDate, PackageNumber, PlateNumber, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Service record updated' });
    });
});

// Delete service record
app.delete('/api/servicepackages/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ServicePackage WHERE RecordNumber=?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Service record deleted' });
    });
});