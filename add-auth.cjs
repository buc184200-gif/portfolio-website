const fs = require('fs');

const css = `
/* --- Premium Auth Styles --- */
.auth-container {
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    margin-left: 16px;
}

.auth-btn {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 500;
    color: var(--color-body, rgba(215, 230, 190, 0.7));
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
}

.auth-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
    transform: skewX(-20deg);
    transition: all 0.6s ease;
}

.auth-btn:hover {
    color: #fff;
    border-color: rgba(212, 175, 55, 0.5);
    background: rgba(212, 175, 55, 0.05);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
}
.auth-btn:hover::before { left: 150%; }

.auth-btn.primary {
    color: #000;
    background: linear-gradient(135deg, #d4af37, #c5a059);
    border: none;
}
.auth-btn.primary:hover {
    color: #000;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    transform: translateY(-1px);
}

.profile-dropdown-wrapper {
    position: relative;
    display: none;
    pointer-events: auto;
    margin-left: 16px;
}

.profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 40px;
    padding: 4px 12px 4px 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.profile-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(212, 175, 55, 0.6);
}

.profile-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37, #c5a059);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-weight: 600;
    font-size: 12px;
}

.profile-name {
    font-size: 11px;
    letter-spacing: 1px;
    color: #fff;
    text-transform: uppercase;
}

.profile-menu {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    background: rgba(10, 10, 10, 0.85);
    border: 1px solid rgba(212, 175, 55, 0.2);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 8px;
    padding: 8px 0;
    min-width: 180px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
}

.profile-dropdown-wrapper.active .profile-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.profile-menu a {
    display: block;
    padding: 10px 20px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    text-decoration: none;
    letter-spacing: 1px;
    transition: all 0.2s;
    font-weight: 500;
}

.profile-menu a:hover {
    color: #d4af37;
    background: rgba(212, 175, 55, 0.05);
    padding-left: 24px;
}

.auth-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
}

.auth-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.auth-modal {
    background: rgba(15, 15, 15, 0.9);
    border: 1px solid rgba(212, 175, 55, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    transform: translateY(20px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.auth-modal-overlay.active .auth-modal {
    transform: translateY(0) scale(1);
}

.auth-modal-close {
    position: absolute;
    top: 20px; right: 20px;
    background: transparent; border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 20px; cursor: pointer;
    transition: color 0.2s;
}
.auth-modal-close:hover { color: #fff; }

.auth-modal h2 {
    font-family: \'Playfair Display\', serif;
    font-size: 28px;
    color: #d4af37;
    margin-bottom: 8px;
    font-weight: 400;
}

.auth-modal p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 24px;
}

.auth-form-group {
    margin-bottom: 16px;
    position: relative;
}

.auth-form-group input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 14px 16px;
    border-radius: 6px;
    color: #fff;
    font-family: \'Inter\', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.3s;
}

.auth-form-group input:focus {
    border-color: rgba(212, 175, 55, 0.5);
    background: rgba(212, 175, 55, 0.02);
}

.auth-form-group label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    transition: all 0.3s;
}

.auth-form-group input:focus + label,
.auth-form-group input:not(:placeholder-shown) + label {
    top: -8px;
    left: 12px;
    font-size: 11px;
    background: #0f0f0f;
    padding: 0 4px;
    color: #d4af37;
}

.auth-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.auth-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
}

.auth-checkbox input {
    appearance: none;
    width: 16px; height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
}

.auth-checkbox input:checked {
    background: #d4af37;
    border-color: #d4af37;
}

.auth-checkbox input:checked::after {
    content: \'✓\';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    font-size: 10px;
    font-weight: bold;
}

.auth-submit {
    width: 100%;
    background: linear-gradient(135deg, #d4af37, #c5a059);
    border: none;
    padding: 14px;
    border-radius: 6px;
    color: #000;
    font-family: \'Inter\', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}

.auth-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
}

.auth-switch {
    text-align: center;
    margin-top: 16px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}

.auth-switch span {
    color: #d4af37;
    cursor: pointer;
    transition: color 0.2s;
}
.auth-switch span:hover { color: #fff; }

.success-message {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(15, 15, 15, 0.95);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
    z-index: 10;
}

.success-message.active {
    opacity: 1;
    visibility: visible;
}

.success-icon {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(212, 175, 55, 0.1);
    border: 2px solid #d4af37;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4af37;
    font-size: 24px;
    margin-bottom: 16px;
    transform: scale(0.5);
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-message.active .success-icon {
    transform: scale(1);
}
`;

const htmlBlock = `
<div class="auth-container" id="authContainer">
    <button class="auth-btn magnetic" data-magnetic-strength="10" onclick="openAuthModal('signin')">Sign In</button>
    <button class="auth-btn primary magnetic" data-magnetic-strength="10" onclick="openAuthModal('signup')">Sign Up</button>
</div>
<div class="profile-dropdown-wrapper" id="profileDropdown">
    <button class="profile-btn magnetic" data-magnetic-strength="10" onclick="toggleProfileMenu(event)">
        <div class="profile-avatar" id="profileAvatar">C</div>
        <span class="profile-name" id="profileName">User</span>
    </button>
    <div class="profile-menu">
        <a href="#">Dashboard</a>
        <a href="#">Saved Quotes</a>
        <a href="#">Settings</a>
        <a href="#" onclick="handleLogout(event)">Logout</a>
    </div>
</div>
`;

const modalAndScript = `
<div class="auth-modal-overlay" id="authModalOverlay" onclick="closeAuthModal(event)">
    <div class="auth-modal" onclick="event.stopPropagation()">
        <button class="auth-modal-close" onclick="closeAuthModal(event)">&times;</button>
        <h2 id="authModalTitle">Sign In</h2>
        <p id="authModalDesc">Enter your details to access your premium account.</p>
        
        <div id="authNameField" class="auth-form-group" style="display: none;">
            <input type="text" id="authName" placeholder=" ">
            <label for="authName">Full Name</label>
        </div>
        
        <div class="auth-form-group">
            <input type="email" id="authEmail" placeholder=" ">
            <label for="authEmail">Email Address</label>
        </div>
        
        <div class="auth-form-group">
            <input type="password" id="authPassword" placeholder=" ">
            <label for="authPassword">Password</label>
        </div>
        
        <div class="auth-options">
            <label class="auth-checkbox">
                <input type="checkbox" id="authRemember" checked>
                Remember me
            </label>
            <a href="#" style="color: rgba(255,255,255,0.5); font-size: 12px; text-decoration: none;">Forgot password?</a>
        </div>
        
        <button class="auth-submit magnetic" data-magnetic-strength="5" onclick="handleAuthSubmit()">Continue</button>
        
        <div class="auth-switch" id="authSwitchText">
            Don't have an account? <span onclick="switchAuthMode('signup')">Sign Up</span>
        </div>
        
        <div class="success-message" id="authSuccessMessage">
            <div class="success-icon">✓</div>
            <h3 style="font-family: 'Playfair Display', serif; color: #d4af37; font-weight: 400; font-size: 24px; margin-bottom: 8px;">Welcome Back</h3>
            <p style="color: rgba(255,255,255,0.6); font-size: 13px;">Authenticating your credentials...</p>
        </div>
    </div>
</div>

<script>
let currentAuthMode = 'signin';

function openAuthModal(mode) {
    currentAuthMode = mode;
    updateAuthModalUI();
    document.getElementById('authModalOverlay').classList.add('active');
}

function closeAuthModal(e) {
    if (e) {
        e.preventDefault();
        if (e.target.id === 'authModalOverlay' || e.target.classList.contains('auth-modal-close')) {
            document.getElementById('authModalOverlay').classList.remove('active');
        }
    } else {
        document.getElementById('authModalOverlay').classList.remove('active');
    }
}

function switchAuthMode(mode) {
    currentAuthMode = mode;
    updateAuthModalUI();
}

function updateAuthModalUI() {
    const title = document.getElementById('authModalTitle');
    const desc = document.getElementById('authModalDesc');
    const nameField = document.getElementById('authNameField');
    const switchText = document.getElementById('authSwitchText');
    const nameInput = document.getElementById('authName');
    
    if (currentAuthMode === 'signup') {
        title.innerText = 'Create Account';
        desc.innerText = 'Join us to experience algorithmic elegance.';
        nameField.style.display = 'block';
        switchText.innerHTML = \`Already have an account? <span onclick="switchAuthMode('signin')">Sign In</span>\`;
    } else {
        title.innerText = 'Sign In';
        desc.innerText = 'Enter your details to access your premium account.';
        nameField.style.display = 'none';
        switchText.innerHTML = \`Don't have an account? <span onclick="switchAuthMode('signup')">Sign Up</span>\`;
        nameInput.value = '';
    }
}

function handleAuthSubmit() {
    let name = document.getElementById('authName').value;
    const email = document.getElementById('authEmail').value;
    
    if (currentAuthMode === 'signup' && !name) {
        name = email.split('@')[0];
    } else if (currentAuthMode === 'signin') {
        name = localStorage.getItem('crestiva_auth_name') || email.split('@')[0];
    }
    
    if (!email) return alert('Please enter your email.');
    
    const successMsg = document.getElementById('authSuccessMessage');
    successMsg.querySelector('h3').innerText = currentAuthMode === 'signup' ? 'Welcome!' : 'Welcome Back';
    successMsg.classList.add('active');
    
    setTimeout(() => {
        localStorage.setItem('crestiva_auth_state', 'loggedIn');
        if (name) localStorage.setItem('crestiva_auth_name', name);
        
        successMsg.classList.remove('active');
        closeAuthModal();
        updateAuthState();
    }, 1500);
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('crestiva_auth_state');
    updateAuthState();
}

function toggleProfileMenu(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('active');
}

document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown && dropdown.classList.contains('active') && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

function updateAuthState() {
    const isLoggedIn = localStorage.getItem('crestiva_auth_state') === 'loggedIn';
    const userName = localStorage.getItem('crestiva_auth_name') || 'User';
    
    const authContainer = document.getElementById('authContainer');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (isLoggedIn) {
        if (authContainer) authContainer.style.display = 'none';
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
            document.getElementById('profileName').innerText = userName;
            document.getElementById('profileAvatar').innerText = userName.charAt(0).toUpperCase();
        }
    } else {
        if (authContainer) authContainer.style.display = 'flex';
        if (profileDropdown) profileDropdown.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthState();
    
    const magneticEls = document.querySelectorAll('.magnetic, .auth-btn, .profile-btn');
    magneticEls.forEach(el => {
        if (!el.classList.contains('magnetic')) el.classList.add('magnetic');
        if (!el.getAttribute('data-magnetic-strength')) el.setAttribute('data-magnetic-strength', '10');
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const strength = el.getAttribute('data-magnetic-strength') || 10;
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
            el.style.transform = \`translate(\${x}px, \${y}px)\`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = \`translate(0px, 0px)\`;
        });
    });
});
</script>
`;

const filesToUpdate = ['index.html', 'projects.html', 'see-more.html'];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Add CSS before </style>
    if (!content.includes('/* --- Premium Auth Styles --- */')) {
        content = content.replace('</style>', css + '\n</style>');
    }
    
    // Add htmlBlock into nav container before hamburger
    if (!content.includes('id="authContainer"')) {
        if (file === 'index.html') {
            // nav structure: <div class="nav-links">...</div>\n\t\t<button class="nav-hamburger"
            content = content.replace(/(<div class="nav-links"[^>]*>[\s\S]*?<\/div>)/, '$1\n' + htmlBlock);
        } else if (file === 'projects.html') {
            // <div class="nav-links">...</div>
            // This is desktop nav.
            content = content.replace(/(<nav class="desktop-nav">[\s\S]*?<div class="nav-links"[^>]*>[\s\S]*?<\/div>)/, '$1\n' + htmlBlock);
        } else if (file === 'see-more.html') {
            content = content.replace(/(<div class="nav-links"[^>]*>[\s\S]*?<\/div>)/, '$1\n' + htmlBlock);
        }
    }
    
    // Add modal and script before </body>
    if (!content.includes('id="authModalOverlay"')) {
        content = content.replace('</body>', modalAndScript + '\n</body>');
    }
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
});
