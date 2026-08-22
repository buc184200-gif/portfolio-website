const fs = require('fs');
let html = fs.readFileSync('see-more.html', 'utf8');

// Find the module script that starts with "import * as THREE"
let match = html.match(/<script type="module">([\s\S]*?)<\/script>/g);

let targetScript = "";
for (let s of match) {
    if (s.includes("import * as THREE")) {
        targetScript = s;
        break;
    }
}

targetScript = targetScript.replace('<script type="module">', '').replace('</script>', '');
targetScript = targetScript.replace("morphNameEl.textContent = shapeNames[idx];", "if (morphNameEl) morphNameEl.textContent = shapeNames[idx];");
targetScript = targetScript.replace("morphCounterEl.textContent = `0${idx + 1} / 0${shapes.length}`;", "if (morphCounterEl) morphCounterEl.textContent = `0${idx + 1} / 0${shapes.length}`;");
targetScript = targetScript.replace("dots.forEach((d, i) => d.classList.toggle('active', i === idx));", "if (dots && dots.length > 0) dots.forEach((d, i) => d.classList.toggle('active', i === idx));");
targetScript = targetScript.replace("dots.forEach(dot => {", "if (dots && dots.length > 0) dots.forEach(dot => {");

fs.writeFileSync('public/shared-bg.js', targetScript);
console.log("Extracted and patched shared-bg.js");
