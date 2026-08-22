const http = require('http');

function checkEndpoint(path) {
    http.get('http://localhost:3000' + path, (res) => {
        console.log(path + ' - Status: ' + res.statusCode);
        res.resume();
    }).on('error', (e) => {
        console.error('Error on ' + path + ': ' + e.message);
    });
}

setTimeout(() => checkEndpoint('/privacy-policy'), 1000);
setTimeout(() => checkEndpoint('/terms'), 1500);
setTimeout(() => checkEndpoint('/see-more'), 2000);

