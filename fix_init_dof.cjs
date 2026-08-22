const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('let dofEnabled = true;', 'let dofEnabled = false;');
html = html.replace('postProcessing.outputNode = isMobile ? sceneColor : dofOutput;', 'postProcessing.outputNode = sceneColor;');

fs.writeFileSync('index.html', html);
console.log('Initial DoF completely disabled.');

