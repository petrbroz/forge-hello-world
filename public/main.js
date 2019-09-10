let viewer = null;

const options = {
    getAccessToken: async function (callback) {
        const resp = await fetch('/api/auth/token');
        if (resp.ok) {
            const token = await resp.json();
            callback(token.access_token, token.expires_in);
        } else {
            throw new Error(await resp.text());
        }
    }
};

Autodesk.Viewing.Initializer(options, function () {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('preview'));
    viewer.start();
});

function loadDocument(id) {
    function onDocumentLoadSuccess(doc) {
        const geom = doc.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(doc, geom);
    }
    function onDocumentLoadFailure() {
        console.error('Could not load document.');
    }
    Autodesk.Viewing.Document.load('urn:' + id, onDocumentLoadSuccess, onDocumentLoadFailure);
}

window.addEventListener('DOMContentLoaded', async function() {
    const select = document.getElementById('docs');
    const resp = await fetch('/api/documents');
    if (resp.ok) {
        const documents = await resp.json();
        for (const doc of documents) {
            const option = document.createElement('option');
            option.innerText = doc.name;
            option.setAttribute('value', doc.id);
            select.appendChild(option);
        }
        loadDocument(select.value);
    } else {
        console.error(await resp.text());
    }

    select.addEventListener('change', function (ev) {
        loadDocument(ev.target.value);
    });
});
