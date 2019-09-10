const express = require('express');
const { DataManagementClient, urnify } = require('forge-server-utils');

const { FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_BUCKET } = process.env;

let dataManagementClient = new DataManagementClient({
    client_id: FORGE_CLIENT_ID,
    client_secret: FORGE_CLIENT_SECRET
});
let router = express.Router();

// GET /api/documents
router.get('/', async function (req, res) {
    try {
        const objects = await dataManagementClient.listObjects(FORGE_BUCKET);
        res.json(objects.map(function (obj) {
            return { id: urnify(obj.objectId), name: obj.objectKey };
        }));
    } catch(err) {
        res.status(500).send(err);
    }
});

module.exports = router;
