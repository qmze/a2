// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3002;

const responseDir = './responses';
if (!fs.existsSync(responseDir)) {
    fs.mkdirSync(responseDir);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-data', (req, res) => {
  const data = req.body.data;
  console.log('Data received from client:', data);

  const fileName = path.join(__dirname, responseDir, 'responses.json');
  const responseData = { data };
  const responseDataString = JSON.stringify(responseData);

  fs.readFile(fileName, 'utf8', (err, fileData) => {
    if (err) {
      // If file does not exist, create it with the current data
      if (err.code === 'ENOENT') {
        fs.writeFile(fileName, `[${responseDataString}]`, 'utf8', (err) => {
          if (err) {
            console.error('Error writing response to file:', err);
            res.status(500).send('Error saving response');
          } else {
            console.log('Response saved to file:', fileName);
            res.sendFile(path.join(__dirname, 'success.html'));
          }
        });
      } else {
        console.error('Error reading response file:', err);
        res.status(500).send('Error saving response');
      }
    } else {
      // If file exists, append new data to it
      let fileContent = JSON.parse(fileData);
      fileContent.push(responseData);
      fs.writeFile(fileName, JSON.stringify(fileContent), 'utf8', (err) => {
        if (err) {
          console.error('Error writing response to file:', err);
          res.status(500).send('Error saving response');
        } else {
          console.log('Response saved to file:', fileName);
          res.sendFile(path.join(__dirname, 'success.html'));
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
