const fs = require('fs');

const replacementHtml = `
<div class="auth-modal-overlay" id="authModalOverlay" onclick="closeAuthModal(event)">
    <div class="auth-modal" onclick="event.stopPropagation()">
        <button class="auth-modal-close" onclick="closeAuthModal(event)">&times;</button>
        <h2 id="authModalTitle">Sign In</h2>
        <p id="authModalDesc">Enter your details to access your premium account.</p>
        
        <div id="authErrorMsg" style="color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.2); padding: 10px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; display: none;"></div>
        
        <div id="authNameField" class="auth-form-group" style="display: none;">
            <input type="text" id="authName" placeholder=" ">
            <label for="authName">Full Name</label>
        </div>
        
        <div class="auth-form-group" id="authEmailField">
            <input type="email" id="authEmail" placeholder=" ">
            <label for="authEmail">Email Address</label>
        </div>
        
        <div class="auth-form-group" id="authPasswordField">
            <input type="password" id="authPassword" placeholder=" ">
            <label for="authPassword">Password</label>
        </div>
        
        <div class="auth-options" id="authOptions">
            <label class="auth-checkbox" id="authRememberWrapper">
                <input type="checkbox" id="authRemember" checked>
                Remember me
            </label>
            <a href="javascript:void(0)" onclick="switchAuthMode('forgot')" id="authForgotLink" style="color: rgba(255,255,255,0.5); font-size: 12px; text-decoration: none;">Forgot password?</a>
        </div>
        
        <button class="auth-submit magnetic" data-magnetic-strength="5" onclick="handleAuthSubmit()">Continue</button>
        
        <div class="auth-switch" id="authSwitchText">
            Don't have an account? <span onclick="switchAuthMode('signup')">Sign Up</span>
        </div>
        
        <div class="success-message" id="authSuccessMessage">
            <div class="success-icon">✓</div>
            <h3 id="authSuccessTitle" style="font-family: 'Playfair Display', serif; color: #d4af37; font-weight: 400; font-size: 24px; margin-bottom: 8px;">Welcome Back</h3>
            <p id="authSuccessDesc" style="color: rgba(255,255,255,0.6); font-size: 13px;">Authenticating your credentials...</p>
        </div>
    </div>
</div>

<script>
let currentAuthMode = 'signin';
let resetEmailContext = '';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('crestiva_users')) || {};
    } catch(e) { return {}; }
}

function saveUsers(users) {
    localStorage.setItem('crestiva_users', JSON.stringify(users));
}

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

function showError(msg) {
    const errorEl = document.getElementById('authErrorMsg');
    if (msg) {
        errorEl.innerText = msg;
        errorEl.style.display = 'block';
    } else {
        errorEl.style.display = 'none';
    }
}

function updateAuthModalUI() {
    showError('');
    const title = document.getElementById('authModalTitle');
    const desc = document.getElementById('authModalDesc');
    const nameField = document.getElementById('authNameField');
    const passwordField = document.getElementById('authPasswordField');
    const options = document.getElementById('authOptions');
    const switchText = document.getElementById('authSwitchText');
    const nameInput = document.getElementById('authName');
    const passInput = document.getElementById('authPassword');
    const forgotLink = document.getElementById('authForgotLink');
    const rememberWrapper = document.getElementById('authRememberWrapper');
    
    if (currentAuthMode === 'signup') {
        title.innerText = 'Create Account';
        desc.innerText = 'Join us to experience algorithmic elegance.';
        nameField.style.display = 'block';
        passwordField.style.display = 'block';
        options.style.display = 'flex';
        forgotLink.style.display = 'none';
        rememberWrapper.style.display = 'flex';
        switchText.style.display = 'block';
        switchText.innerHTML = \`Already have an account? <span onclick="switchAuthMode('signin')">Sign In</span>\`;
    } else if (currentAuthMode === 'signin') {
        title.innerText = 'Sign In';
        desc.innerText = 'Enter your details to access your premium account.';
        nameField.style.display = 'none';
        passwordField.style.display = 'block';
        options.style.display = 'flex';
        forgotLink.style.display = 'block';
        rememberWrapper.style.display = 'flex';
        switchText.style.display = 'block';
        switchText.innerHTML = \`Don't have an account? <span onclick="switchAuthMode('signup')">Sign Up</span>\`;
        nameInput.value = '';
    } else if (currentAuthMode === 'forgot') {
        title.innerText = 'Reset Password';
        desc.innerText = 'Enter your email to reset your password.';
        nameField.style.display = 'none';
        passwordField.style.display = 'none';
        options.style.display = 'none';
        switchText.style.display = 'block';
        switchText.innerHTML = \`Remember your password? <span onclick="switchAuthMode('signin')">Sign In</span>\`;
    } else if (currentAuthMode === 'reset') {
        title.innerText = 'New Password';
        desc.innerText = 'Enter a new password for ' + resetEmailContext;
        nameField.style.display = 'none';
        passwordField.style.display = 'block';
        options.style.display = 'none';
        switchText.style.display = 'none';
        passInput.value = '';
    }
}

function handleAuthSubmit() {
    showError('');
    const name = document.getElementById('authName').value.trim();
    const email = document.getElementById('authEmail').value.trim().toLowerCase();
    const password = document.getElementById('authPassword').value;
    
    if (!email) return showError('Please enter your email address.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return showError('Please enter a valid email address.');
    
    const users = getUsers();
    
    if (currentAuthMode === 'signup') {
        if (!name) return showError('Please enter your full name.');
        if (!password) return showError('Please enter a password.');
        if (password.length < 8) return showError('Password must be at least 8 characters long.');
        if (users[email]) return showError('An account with this email already exists.');
        
        users[email] = { name, password };
        saveUsers(users);
        loginSuccess(email, name, 'Welcome!', 'Account created successfully.');
        
    } else if (currentAuthMode === 'signin') {
        if (!password) return showError('Please enter your password.');
        if (!users[email]) return showError('No account found with this email.');
        if (users[email].password !== password) return showError('Incorrect password.');
        
        loginSuccess(email, users[email].name, 'Welcome Back', 'Authenticating your credentials...');
        
    } else if (currentAuthMode === 'forgot') {
        if (!users[email]) return showError('No account found with this email.');
        resetEmailContext = email;
        switchAuthMode('reset');
        
    } else if (currentAuthMode === 'reset') {
        if (!password) return showError('Please enter a new password.');
        if (password.length < 8) return showError('Password must be at least 8 characters long.');
        
        users[resetEmailContext].password = password;
        saveUsers(users);
        loginSuccess(resetEmailContext, users[resetEmailContext].name, 'Password Updated', 'Your password has been reset successfully.');
    }
}

function loginSuccess(email, name, titleMsg, descMsg) {
    const successMsg = document.getElementById('authSuccessMessage');
    document.getElementById('authSuccessTitle').innerText = titleMsg;
    document.getElementById('authSuccessDesc').innerText = descMsg;
    successMsg.classList.add('active');
    
    setTimeout(() => {
        localStorage.setItem('crestiva_auth_state', 'loggedIn');
        localStorage.setItem('crestiva_auth_email', email);
        localStorage.setItem('crestiva_auth_name', name);
        
        successMsg.classList.remove('active');
        closeAuthModal();
        updateAuthState();
    }, 1500);
}

function handleLogout(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('crestiva_auth_state');
    updateAuthState();
}

function toggleProfileMenu(e) {
    e.stopPropagation();
    e.currentTarget.closest('.profile-dropdown-wrapper').classList.toggle('active');
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.profile-dropdown-wrapper.active').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
});

function updateAuthState() {
    const isLoggedIn = localStorage.getItem('crestiva_auth_state') === 'loggedIn';
    const userName = localStorage.getItem('crestiva_auth_name') || 'User';
    
    const authContainers = document.querySelectorAll('.auth-container');
    const profileDropdowns = document.querySelectorAll('.profile-dropdown-wrapper');
    
    if (isLoggedIn) {
        authContainers.forEach(c => c.style.display = 'none');
        profileDropdowns.forEach(p => {
            p.style.display = 'flex';
            const nameEl = p.querySelector('.profile-name');
            const avatarEl = p.querySelector('.profile-avatar');
            if(nameEl) nameEl.innerText = userName;
            if(avatarEl) avatarEl.innerText = userName.charAt(0).toUpperCase();
        });
    } else {
        authContainers.forEach(c => c.style.display = 'flex');
        profileDropdowns.forEach(p => p.style.display = 'none');
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

const files = ['index.html', 'projects.html', 'see-more.html'];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const overlayStart = content.indexOf('<div class="auth-modal-overlay"');
    const scriptEnd = content.indexOf('</script>', overlayStart);
    if (overlayStart !== -1 && scriptEnd !== -1) {
        const toReplace = content.substring(overlayStart, scriptEnd + 9);
        content = content.replace(toReplace, replacementHtml);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find auth block in ${file}`);
    }
});

