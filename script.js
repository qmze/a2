// script.js
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    console.log('Form submitted'); // Debug logging

    const formData = new FormData(this);

    fetch('/submit-data', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Response from server:', data);
        // Update the webpage with the entered data
        document.getElementById('userDataDisplay').textContent = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
