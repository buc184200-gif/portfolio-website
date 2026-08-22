const fs = require('fs');

function updateFooter(filename) {
    let html = fs.readFileSync(filename, 'utf8');
    const target = `<a href="https://www.instagram.com/crestiva_web_studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="instagram-pop">@crestiva_web_studio</a>
                </div>`;
    
    const replacement = `<a href="https://www.instagram.com/crestiva_web_studio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="instagram-pop">@crestiva_web_studio</a>
                    <div style="margin-top: 10px; display: flex; gap: 15px; font-size: 0.85rem; opacity: 0.7; justify-content: center;">
                        <a href="/privacy-policy" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Privacy Policy</a>
                        <a href="/terms" style="color: inherit; text-decoration: none; transition: opacity 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">Terms of Service</a>
                    </div>
                </div>`;

    html = html.replace(target, replacement);
    fs.writeFileSync(filename, html);
    console.log(filename + ' footer updated');
}

updateFooter('see-more.html');
updateFooter('privacy-policy.html');
updateFooter('terms.html');
