const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Change hero text
content = content.replace(
    '<span class="hero-tag" data-reveal data-delay="1">Crafting Digital Experiences</span>',
    '<span class="hero-tag" data-reveal data-delay="1">Premium Web Design & Development</span>'
);

content = content.replace(
    '<p class="hero-sub" data-reveal data-delay="3">Where creativity meets cutting-edge technology. We are a premier web studio dedicated to building immersive digital portfolios and experiences.</p>',
    '<p class="hero-sub" data-reveal data-delay="3">We design and develop custom, high-performance websites for businesses. Combining stunning visual design, thoughtful UX, and modern AI-assisted workflows, we build digital experiences that drive real conversion.</p>'
);

fs.writeFileSync('index.html', content);
