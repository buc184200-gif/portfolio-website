const fs = require('fs');

const cssOverride = `
@media (max-width: 768px) {
    .nav-mobile-overlay .auth-container,
    .mobile-nav .auth-container,
    .nav-links .auth-container {
        margin-left: 0;
        justify-content: center;
        width: 100%;
        margin-top: 15px;
    }
    .nav-mobile-overlay .profile-dropdown-wrapper,
    .mobile-nav .profile-dropdown-wrapper,
    .nav-links .profile-dropdown-wrapper {
        margin-left: 0;
        display: flex !important; /* to override hidden */
        justify-content: center;
        width: 100%;
        margin-top: 15px;
    }
    
    .mobile-nav {
        flex-wrap: wrap;
    }
    .mobile-nav .auth-container, .mobile-nav .profile-dropdown-wrapper {
        order: 3;
        flex-basis: 100%;
    }
}
`;

const filesToUpdate = ['index.html', 'projects.html', 'see-more.html'];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Add mobile CSS if not present
    if (!content.includes('.nav-mobile-overlay .auth-container')) {
        content = content.replace('</style>', cssOverride + '\n</style>');
    }
    
    fs.writeFileSync(file, content, 'utf-8');
});

