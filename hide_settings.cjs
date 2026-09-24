const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Hide the gear and the panel for production safety
html = html.replace('<button class="settings-gear" id="settingsGear" aria-label="Settings">', '<button class="settings-gear" id="settingsGear" aria-label="Settings" style="display: none !important;">');
html = html.replace('<div class="settings-panel" id="settingsPanel"></div>', '<div class="settings-panel" id="settingsPanel" style="display: none !important; pointer-events: none !important;"></div>');

fs.writeFileSync('index.html', html);
console.log('Settings UI hidden successfully.');

