const fs = require('fs');

const injection = `
    <!-- AI Concierge -->
    <link rel="stylesheet" href="/ai-concierge.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="/ai-concierge.js"></script>
</body>
`;

['projects.html', 'see-more.html'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('ai-concierge.css')) {
        content = content.replace('</body>', injection);
        fs.writeFileSync(file, content);
        console.log(`Injected into ${file}`);
    } else {
        console.log(`Already injected in ${file}`);
    }
});
