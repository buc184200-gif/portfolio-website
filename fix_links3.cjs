const fs = require('fs');

let seeMore = fs.readFileSync('see-more.html', 'utf8');

// I want to ensure the formatting matches EXACTLY:
// @crestiva_web_studio
// Privacy Policy    Terms of Service

const htmlToReplace = `<a href="https://www.instagram.com/crestiva_web_studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="instagram-pop">@crestiva_web_studio</a>`;
const newHtml = `<a href="https://www.instagram.com/crestiva_web_studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="instagram-pop" style="display: block; margin-bottom: 5px;">@crestiva_web_studio</a>
                    <div class="legal-links" style="display: flex; gap: 15px; font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.08em; color: var(--c-text-dim);">
                        <a href="/privacy-policy" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Privacy Policy</a>
                        <a href="/terms" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Terms of Service</a>
                    </div>`;

// Actually wait, let me just check what the footer-left currently looks like.
