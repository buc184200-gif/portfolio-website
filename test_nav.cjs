const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');
let sm = fs.readFileSync('see-more.html', 'utf8');

if(index.includes('/privacy-policy') || index.includes('/terms')) {
    console.log("index.html STILL HAS THE LINKS");
} else {
    console.log("index.html is clean");
}

if(sm.indexOf('/privacy-policy') !== sm.lastIndexOf('/privacy-policy')) {
    console.log("see-more.html HAS MULTIPLE LINKS");
} else {
    console.log("see-more.html has exactly one pair of links");
}
