const fs = require('fs');

const htmlBlock = `
<div class="auth-container">
    <button class="auth-btn magnetic" data-magnetic-strength="10" onclick="openAuthModal('signin')">Sign In</button>
    <button class="auth-btn primary magnetic" data-magnetic-strength="10" onclick="openAuthModal('signup')">Sign Up</button>
</div>
<div class="profile-dropdown-wrapper">
    <button class="profile-btn magnetic" data-magnetic-strength="10" onclick="toggleProfileMenu(event)">
        <div class="profile-avatar">C</div>
        <span class="profile-name">User</span>
    </button>
    <div class="profile-menu">
        <a href="#">Dashboard</a>
        <a href="#">Saved Quotes</a>
        <a href="#">Settings</a>
        <a href="#" onclick="handleLogout(event)">Logout</a>
    </div>
</div>
`;

// index.html mobile nav
let idxContent = fs.readFileSync('index.html', 'utf-8');
if (!idxContent.includes('data-nav-mobile="5">Contact</a>\n\t\t<div class="auth-container">')) {
    idxContent = idxContent.replace(/(<a href="javascript:void\(0\)" data-nav-mobile="5">Contact<\/a>)/, '$1\n\t\t' + htmlBlock.replace(/id="[^"]*"/g, ''));
    
    // Also we need to fix JS logic to use class selectors instead of id
    idxContent = idxContent.replace(/const authContainer = document\.getElementById\('authContainer'\);/, "const authContainers = document.querySelectorAll('.auth-container');");
    idxContent = idxContent.replace(/const profileDropdown = document\.getElementById\('profileDropdown'\);/, "const profileDropdowns = document.querySelectorAll('.profile-dropdown-wrapper');");
    
    idxContent = idxContent.replace(/if \(isLoggedIn\) {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'none';[\s\S]*?if \(profileDropdown\) {[\s\S]*?profileDropdown\.style\.display = 'block';[\s\S]*?document\.getElementById\('profileName'\)\.innerText = userName;[\s\S]*?document\.getElementById\('profileAvatar'\)\.innerText = userName\.charAt\(0\)\.toUpperCase\(\);[\s\S]*?}[\s\S]*?} else {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'flex';[\s\S]*?if \(profileDropdown\) profileDropdown\.style\.display = 'none';[\s\S]*?}/, `if (isLoggedIn) {
        authContainers.forEach(c => c.style.display = 'none');
        profileDropdowns.forEach(p => {
            p.style.display = 'block';
            p.querySelector('.profile-name').innerText = userName;
            p.querySelector('.profile-avatar').innerText = userName.charAt(0).toUpperCase();
        });
    } else {
        authContainers.forEach(c => c.style.display = 'flex');
        profileDropdowns.forEach(p => p.style.display = 'none');
    }`);

    // Update toggleProfileMenu function to find closest profile-menu
    idxContent = idxContent.replace(/document\.getElementById\('profileDropdown'\)\.classList\.toggle\('active'\);/, "e.currentTarget.closest('.profile-dropdown-wrapper').classList.toggle('active');");
    
    // Update global click listener for profile dropdown
    idxContent = idxContent.replace(/const dropdown = document\.getElementById\('profileDropdown'\);[\s\S]*?if \(dropdown && dropdown\.classList\.contains\('active'\) && !dropdown\.contains\(e\.target\)\) {[\s\S]*?dropdown\.classList\.remove\('active'\);[\s\S]*?}/, `document.querySelectorAll('.profile-dropdown-wrapper.active').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });`);
    fs.writeFileSync('index.html', idxContent, 'utf-8');
}

// projects.html mobile nav
let projContent = fs.readFileSync('projects.html', 'utf-8');
if (!projContent.includes('<nav class="mobile-nav">\n        <a href="/" class="brand-compact">Crestiva</a>\n' + htmlBlock)) {
    projContent = projContent.replace(/(<nav class="mobile-nav">\n\s*<a href="\/" class="brand-compact">Crestiva<\/a>)/, '$1\n        ' + htmlBlock.replace(/id="[^"]*"/g, ''));
    
    projContent = projContent.replace(/const authContainer = document\.getElementById\('authContainer'\);/, "const authContainers = document.querySelectorAll('.auth-container');");
    projContent = projContent.replace(/const profileDropdown = document\.getElementById\('profileDropdown'\);/, "const profileDropdowns = document.querySelectorAll('.profile-dropdown-wrapper');");
    
    projContent = projContent.replace(/if \(isLoggedIn\) {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'none';[\s\S]*?if \(profileDropdown\) {[\s\S]*?profileDropdown\.style\.display = 'block';[\s\S]*?document\.getElementById\('profileName'\)\.innerText = userName;[\s\S]*?document\.getElementById\('profileAvatar'\)\.innerText = userName\.charAt\(0\)\.toUpperCase\(\);[\s\S]*?}[\s\S]*?} else {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'flex';[\s\S]*?if \(profileDropdown\) profileDropdown\.style\.display = 'none';[\s\S]*?}/, `if (isLoggedIn) {
        authContainers.forEach(c => c.style.display = 'none');
        profileDropdowns.forEach(p => {
            p.style.display = 'block';
            p.querySelector('.profile-name').innerText = userName;
            p.querySelector('.profile-avatar').innerText = userName.charAt(0).toUpperCase();
        });
    } else {
        authContainers.forEach(c => c.style.display = 'flex');
        profileDropdowns.forEach(p => p.style.display = 'none');
    }`);

    projContent = projContent.replace(/document\.getElementById\('profileDropdown'\)\.classList\.toggle\('active'\);/, "e.currentTarget.closest('.profile-dropdown-wrapper').classList.toggle('active');");
    
    projContent = projContent.replace(/const dropdown = document\.getElementById\('profileDropdown'\);[\s\S]*?if \(dropdown && dropdown\.classList\.contains\('active'\) && !dropdown\.contains\(e\.target\)\) {[\s\S]*?dropdown\.classList\.remove\('active'\);[\s\S]*?}/, `document.querySelectorAll('.profile-dropdown-wrapper.active').forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });`);
    fs.writeFileSync('projects.html', projContent, 'utf-8');
}

// see-more.html doesn't have a separate mobile nav container, it shares .nav-links
let seeMoreContent = fs.readFileSync('see-more.html', 'utf-8');
seeMoreContent = seeMoreContent.replace(/const authContainer = document\.getElementById\('authContainer'\);/, "const authContainers = document.querySelectorAll('.auth-container');");
seeMoreContent = seeMoreContent.replace(/const profileDropdown = document\.getElementById\('profileDropdown'\);/, "const profileDropdowns = document.querySelectorAll('.profile-dropdown-wrapper');");

seeMoreContent = seeMoreContent.replace(/if \(isLoggedIn\) {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'none';[\s\S]*?if \(profileDropdown\) {[\s\S]*?profileDropdown\.style\.display = 'block';[\s\S]*?document\.getElementById\('profileName'\)\.innerText = userName;[\s\S]*?document\.getElementById\('profileAvatar'\)\.innerText = userName\.charAt\(0\)\.toUpperCase\(\);[\s\S]*?}[\s\S]*?} else {[\s\S]*?if \(authContainer\) authContainer\.style\.display = 'flex';[\s\S]*?if \(profileDropdown\) profileDropdown\.style\.display = 'none';[\s\S]*?}/, `if (isLoggedIn) {
    authContainers.forEach(c => c.style.display = 'none');
    profileDropdowns.forEach(p => {
        p.style.display = 'block';
        p.querySelector('.profile-name').innerText = userName;
        p.querySelector('.profile-avatar').innerText = userName.charAt(0).toUpperCase();
    });
} else {
    authContainers.forEach(c => c.style.display = 'flex');
    profileDropdowns.forEach(p => p.style.display = 'none');
}`);

seeMoreContent = seeMoreContent.replace(/document\.getElementById\('profileDropdown'\)\.classList\.toggle\('active'\);/, "e.currentTarget.closest('.profile-dropdown-wrapper').classList.toggle('active');");

seeMoreContent = seeMoreContent.replace(/const dropdown = document\.getElementById\('profileDropdown'\);[\s\S]*?if \(dropdown && dropdown\.classList\.contains\('active'\) && !dropdown\.contains\(e\.target\)\) {[\s\S]*?dropdown\.classList\.remove\('active'\);[\s\S]*?}/, `document.querySelectorAll('.profile-dropdown-wrapper.active').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});`);
fs.writeFileSync('see-more.html', seeMoreContent, 'utf-8');

