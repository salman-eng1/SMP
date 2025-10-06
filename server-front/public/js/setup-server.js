document.addEventListener('DOMContentLoaded', () => {
    const projectButtonsContainer = document.createElement('div');
    projectButtonsContainer.className = 'button-container';
    projectButtonsContainer.id = 'project-buttons';
    document.querySelector('.container').appendChild(projectButtonsContainer);
    loadProjects();

    function loadProjects() {
        axios.get(window.APP_URL + '/api/get-systems', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
            .then(response => {
                const projects = response.data.message;
                if (Array.isArray(projects)) {
                    projectButtonsContainer.innerHTML = '';
                    projects.forEach(project => {
                        const button = document.createElement('button');
                        button.textContent = project;
                        button.style.width = '100%';
                        button.style.padding = '15px 20px';
                        button.style.fontSize = '18px';
                        button.style.margin = '10px 0';
                        button.style.borderRadius = '8px';
                        button.style.border = 'none';
                        button.style.cursor = 'pointer';
                        button.style.backgroundColor = '#495057';
                        button.style.color = '#ffffff';
                        button.style.transition = 'background-color 0.3s, transform 0.2s ease-in-out';

                        button.addEventListener('mouseover', () => {
                            button.style.backgroundColor = '#535c64';
                        });

                        button.addEventListener('mouseout', () => {
                            button.style.backgroundColor = '#495057';
                        });

                        button.addEventListener('click', () => {
                            window.parent.postMessage({action: 'load-project', project: project}, '*');
                        });

                        projectButtonsContainer.appendChild(button);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }
});