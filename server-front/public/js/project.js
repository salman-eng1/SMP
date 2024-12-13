document.addEventListener('DOMContentLoaded', () => {
    // Extract the project name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('projectName'); // Ensure this matches the key in loadProjectPage

    // Check if the project name exists and handle errors
    if (projectName) {
        // Get the elements by ID and check if they exist
        const projectNameElement = document.getElementById('project-name');
        const enableSystemButton = document.getElementById('enable-system');
        const disableSystemButton = document.getElementById('disable-system');

        // Only update the elements if they exist
        if (projectNameElement && enableSystemButton && disableSystemButton) {
            // Update the project title and button labels
            projectNameElement.textContent = projectName;
            enableSystemButton.textContent = `${projectName} Enable System`;
            disableSystemButton.textContent = `${projectName} Disable System`;
        } else {
            console.error('One or more required elements are missing in the HTML.');
        }
    } else {
        console.error('Project name is missing from the URL parameters.');
        // You may want to redirect the user or show an error message
        alert("Project name is missing. Please check the URL.");
        window.location.href = 'index.html'; // Redirect to home page or any other fallback URL
    }

    // Continue with your system enabling/disabling code as before...

    // Function to handle system enabling
    document.getElementById('enable-system').addEventListener('click', () => {
        if (!projectName) {
            console.error('Project name is not defined.');
            return;
        }
        
        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim(); // Use extracted projectName directly

        showProgressModal(); // Show modal when request starts

        axios.post(
            window.APP_URL + '/api/enable-system',
            {
                deleteAll: deleteAll,
                systemName: systemName
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token here
                },
            }
        )
        .then(response => {
            console.log('System enabled successfully:', response.data);
            refreshEnabledProjects();
        })
        .catch(error => {
            console.error('Error enabling system:', error);
            if (error.response && error.response.status === 401) {
                window.top.location.assign('index.html'); // Redirect the entire parent page
            }
        })
        .finally(() => {
            hideProgressModal(); // Hide modal when request completes
        });
    });

    // Function to handle system disabling
    document.getElementById('disable-system').addEventListener('click', () => {
        if (!projectName) {
            console.error('Project name is not defined.');
            return;
        }

        const deleteAll = document.getElementById('disable-all-checkbox').checked;
        const systemName = projectName.trim(); // Use extracted projectName directly

        showProgressModal(); // Show modal when request starts

        axios.post(window.APP_URL + '/api/disable-system', {
            deleteAll: deleteAll,
            systemName: systemName
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token here
            },
        })
        .then(response => {
            console.log('System disabled successfully:', response.data);
            refreshEnabledProjects();
        })
        .catch(error => {
            console.error('Error disabling system:', error);
            if (error.response && error.response.status === 401) {
                window.top.location.assign('index.html'); // Redirect the entire parent page
            }
        })
        .finally(() => {
            hideProgressModal(); // Hide modal when request completes
        });
    });

    // Function to refresh the enabled projects table
    function refreshEnabledProjects() {
        showProgressModal(); // Show modal while fetching
        axios.get(window.APP_URL + '/api/get-enabled-projects', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token here
            },
        })
        .then(response => {
            const projects = response.data.message;
            const tableBody = document.getElementById('enabled-projects-table').getElementsByTagName('tbody')[0];

            tableBody.innerHTML = ''; // Clear any existing rows

            // Populate table with enabled projects
            projects.forEach(project => {
                const projectName = project.replace('.conf', '');
                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.textContent = projectName;
                cell.style.backgroundColor = 'black'; // Black background for table rows
                cell.style.color = 'white'; // White text for table rows
            });
        })
        .catch(error => {
            console.error('Error fetching enabled projects:', error);
            if (error.response && error.response.status === 401) {
                window.top.location.assign('index.html'); // Redirect the entire parent page
            }
        })
        .finally(() => {
            hideProgressModal(); // Hide modal when request completes
        });
    }

    // Initial fetch of enabled projects on page load
    refreshEnabledProjects();
});

// Show the progress modal
function showProgressModal() {
    document.getElementById('progress-modal-backdrop').style.display = 'block';
    document.getElementById('progress-modal').style.display = 'block';
}

// Hide the progress modal
function hideProgressModal() {
    document.getElementById('progress-modal-backdrop').style.display = 'none';
    document.getElementById('progress-modal').style.display = 'none';
}
