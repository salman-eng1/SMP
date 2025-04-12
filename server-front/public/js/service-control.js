
console.log('APP_URL:', window.APP_URL); // Verify this prints the expected URL
document.getElementById('check-services').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    checkServices();
});
document.getElementById('show-running-ports').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    showRunningPorts();
});
document.getElementById('fix-disk-id').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent any default behavior that might reload the page
    fixDiskId();
});


function checkServices() {
    // showProgressBar()
    axios.get(window.APP_URL + '/api/check-services', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add the token here
        },
    })
        .then(response => {
            // Handle the response
            console.log('Services checked successfully:', response.data);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 
                'Error checking services: ' + (error.response ? error.response.data.message : error.message);
    
            if (error.response && error.response.status === 401) {
                window.top.location.assign('index.html'); // Redirect the entire parent page

            }
        });
    
}

function showRunningPorts() {
    // showProgressBar()
    axios.get(
        window.APP_URL + '/api/check-ports',
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add the token here
            },
        }
    )
        .then(response => {
            document.getElementById('messages').innerHTML = JSON.stringify(response.data, null, 2);
            // hideProgressBar()
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 'Error showing running ports: ' + error;
        });
    
}


function fixDiskId() {
    // showProgressBar()
    axios.get(window.APP_URL + '/api/fix-disk-id', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add the token here
        },
    })
        .then(response => {
            // Handle the response
            console.log('disk id successfully fixed:', response.data);
        })
        .catch(error => {
            document.getElementById('messages').innerHTML = 
                'Error checking services: ' + (error.response ? error.response.data.message : error.message);
    
            if (error.response && error.response.status === 401) {
                window.top.location.assign('index.html'); // Redirect the entire parent page

            }
        });
    
}



