const fs = require('fs');
let code = fs.readFileSync('temp-three.js', 'utf8');

// Strip the opening and closing script tags
code = code.replace('<script type="module">', '');
code = code.replace('</script>', '');

// Make UI elements safe
code = code.replace("morphNameEl.textContent = shapeNames[idx];", "if (morphNameEl) morphNameEl.textContent = shapeNames[idx];");
code = code.replace("morphCounterEl.textContent = `0${idx + 1} / 0${shapes.length}`;", "if (morphCounterEl) morphCounterEl.textContent = `0${idx + 1} / 0${shapes.length}`;");
code = code.replace("dots.forEach((d, i) => d.classList.toggle('active', i === idx));", "if (dots) dots.forEach((d, i) => d.classList.toggle('active', i === idx));");
code = code.replace("dots.forEach(dot => {", "if (dots) dots.forEach(dot => {");

fs.writeFileSync('public/shared-bg.js', code);
console.log("created public/shared-bg.js");
