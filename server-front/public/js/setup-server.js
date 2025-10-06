document.addEventListener('DOMContentLoaded', () => {
    console.log('Setup server page loaded');

    // Function to load projects
    function loadProjects() {
        axios.get(window.APP_URL + '/api/get-systems', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add the token here
            },
        })
            .then(response => {
                console.log('API response:', response.data); // Log the API response
                const projects = response.data.message;

                if (Array.isArray(projects)) {
                    const container = document.querySelector('.container');
                    // Clear existing content except the h1 and modal
                    container.innerHTML = `
                        <h1 class="text-center mb-4">Available Projects</h1>
                        <div class="modal fade" id="progress-modal" tabindex="-1" role="dialog" aria-labelledby="progressModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content bg-dark text-white">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="progressModalLabel">Processing...</h5>
                                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <div class="progress">
                                            <div id="progress-bar" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <p>Processing, please wait...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    projects.forEach(project => {
                        const button = document.createElement('button');
                        button.textContent = project;
                        button.className = 'btn btn-primary btn-block mb-2'; // Use Bootstrap classes
                        button.addEventListener('click', () => {
                            console.log(`Button clicked: ${project}`); // Debug log
                            // Send message to parent to load the project
                            window.parent.postMessage({ action: 'load-project', project: project }, '*');
                        });
                        container.appendChild(button);
                    });
                } else {
                    console.error('Expected an array of projects, but received:', projects);
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                if (error.response && error.response.status === 401) {
                    // Redirect to login if unauthorized
                    window.parent.postMessage({ action: 'unauthorized' }, '*');
                }
            });
    }

    // Load projects on page load
    loadProjects();
});