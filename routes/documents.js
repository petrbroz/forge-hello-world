const express = require('express');

let router = express.Router();

// GET /api/documents
router.get('/', function (req, res) {
    res.json([
        { id: 'a', name: 'Document A' },
        { id: 'b', name: 'Document B' },
        { id: 'c', name: 'Document C' }
    ]);
});

module.exports = router;
