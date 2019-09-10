const express = require('express');

const port = process.env.PORT || 3000;

let app = express();
app.use(express.static('public'));
app.use('/api/documents', require('./routes/documents'));
app.listen(port, () => console.log(`Server listening on port ${port}...`));
