const fs = require('fs');

function deleteFiles(files) {
    files.forEach(file => {
        fs.unlink(file.path, err => {
            if (err) console.log(err);
        });
    });
}

module.exports = deleteFiles;