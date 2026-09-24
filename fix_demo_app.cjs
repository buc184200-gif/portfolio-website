const fs = require('fs');

let content = fs.readFileSync('src/demo/App.tsx', 'utf8');

// Change fake projects to concept descriptions
content = content.replace('title: "Automotive Motion"', 'title: "Interactive Concept"');
content = content.replace('title: "Urban Architecture"', 'title: "Design Layout Demo"');
content = content.replace('title: "Human Perspective"', 'title: "Web Experience Concept"');
content = content.replace('title: "Brand Identity"', 'title: "UI Prototype"');

// Change fake journal to conceptual topics or remove fake dates
content = content.replace('title: "The Future of Interaction Design"', 'title: "Design Philosophy Concept"');
content = content.replace('title: "Building Scalable Design Systems"', 'title: "Architecture Demo"');
content = content.replace('title: "Motion as Meaning"', 'title: "Animation Concept"');
content = content.replace('title: "Typography in Digital Spaces"', 'title: "Typography Showcase"');

content = content.replace(/date: ".*?"/g, 'date: "Demo Format"');
content = content.replace(/readTime: ".*?"/g, 'readTime: "Example Data"');

// Fix the H2 tags that should be changed to maintain one H1
// Wait, is there a second H1 in demo/App.tsx? Let's check:
// <h1 className="name-reveal ...">Crestiva Web Studio</h1>
// There's only one H1.

fs.writeFileSync('src/demo/App.tsx', content);
