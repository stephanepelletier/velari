module.exports = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(__dirname, 'public', 'index.html');
  res.setHeader('Content-Type', 'text/html');
  res.end(fs.readFileSync(file));
};
