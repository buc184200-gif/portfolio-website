const fs = require('fs');

const filesToUpdate = ['index.html', 'projects.html', 'see-more.html'];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Remove the !important from display: flex
    content = content.replace('display: flex !important; /* to override hidden */', '/* display flex handled by js */');
    
    // Change JS to use flex instead of block for profileDropdown
    content = content.replace(/p\.style\.display = 'block';/g, "p.style.display = 'flex';");
    content = content.replace(/profileDropdown\.style\.display = 'block';/g, "profileDropdown.style.display = 'flex';");
    
    fs.writeFileSync(file, content, 'utf-8');
});

