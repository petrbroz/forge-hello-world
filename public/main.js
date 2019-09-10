window.addEventListener('DOMContentLoaded', async function() {
    const resp = await fetch('/api/documents');
    if (resp.ok) {
        const documents = await resp.json();
        const select = document.getElementById('docs')
        for (const doc of documents) {
            const option = document.createElement('option');
            option.innerText = doc.name;
            option.setAttribute('value', doc.id);
            select.appendChild(option);
        }
    } else {
        console.error(await resp.text());
    }
});
