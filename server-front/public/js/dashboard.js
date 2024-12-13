document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('authToken') !== window.token) {
        // If no token, redirect to login page
        window.top.location.assign('index.html'); // Redirect the entire parent page

        // return
    }
    const troubleshootingLink = document.getElementById('troubleshooting-link');
    const setupNetworkInterfaceLink = document.getElementById('setup-network-interface-link');
    const setupServerLink = document.getElementById('setup-server-link');
    const configurationLink = document.getElementById('configuration-link');
    const terminalLink = document.getElementById('terminal-link');
    const monitoringLink = document.getElementById('monitoring-link'); // Link for Monitoring section
    const logoutLink = document.getElementById('logout-link'); // Link for Monitoring section

    const troubleshootingSection = document.getElementById('troubleshooting-section');
    const setupNetworkInterfaceSection = document.getElementById('setup-network-interface-section');
    const setupNewServerSection = document.getElementById('setup-new-server-section');
    const configurationSection = document.getElementById('configuration-section');
    const terminalSection = document.getElementById('terminal-section');
    const monitoringSection = document.getElementById('monitoring-section'); // Monitoring section

    const projectButtonsContainer = document.getElementById('project-buttons');

    // Function to hide all content sections
    function hideAllSections() {
        console.log('Hiding all sections');
        troubleshootingSection.style.display = 'none';
        setupNetworkInterfaceSection.style.display = 'none';
        setupNewServerSection.style.display = 'none';
        configurationSection.style.display = 'none';
        terminalSection.style.display = 'none';
        monitoringSection.style.display = 'none'; // Hide monitoring section
    }
 // Show troubleshooting section
 troubleshootingLink.addEventListener('click', () => {

    hideAllSections();
    troubleshootingSection.style.display = 'block';

});

// Show setup network interface section and load the networking.html page
setupNetworkInterfaceLink.addEventListener('click', () => {
    hideAllSections();
    setupNetworkInterfaceSection.style.display = 'block';
    loadNetworkingPage(); // Load networking.html
});

// Show setup new server section and load projects
setupServerLink.addEventListener('click', () => {
    hideAllSections();
    setupNewServerSection.style.display = 'block';
    loadProjects(); // Load projects for the setup new server section
});

// Show configuration section
configurationLink.addEventListener('click', () => {
    hideAllSections();
    configurationSection.style.display = 'block';
    loadConfigurationPage()
});
terminalLink.addEventListener('click', () => {
    hideAllSections();
    terminalSection.style.display = 'block';
    loadTerminalPage()
});

logoutLink.addEventListener('click', () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');

    // Optionally clear other stored data
    // localStorage.clear(); // Uncomment to clear all localStorage data

    // Redirect the user to the login page
    window.top.location.assign('index.html');
});

    monitoringLink.addEventListener('click', () => {
        hideAllSections();
        monitoringSection.style.display = 'block';
    
        // Clear existing content
        monitoringSection.innerHTML = '';
    
        // Create a container for the cards
        const cardContainer = document.createElement('div');
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'column'; // Arrange cards vertically
        cardContainer.style.alignItems = 'center'; // Center-align the cards
        cardContainer.style.gap = '20px'; // Spacing between cards
    
        // Common card styles
        const cardStyle = {
            width: '500px',
            height: '250px',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s, box-shadow 0.3s',
        };
    
        const labelStyle = {
            color: 'white',
            padding: '10px 15px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
        };
    
        // Create Prometheus card
        const prometheusCard = document.createElement('div');
        Object.assign(prometheusCard.style, cardStyle);
        prometheusCard.style.backgroundImage = 'url("./images/prometheus.jpg")';
    
        const prometheusLabel = document.createElement('div');
        Object.assign(prometheusLabel.style, labelStyle);
        prometheusLabel.textContent = 'Prometheus';
        prometheusCard.appendChild(prometheusLabel);
    
        // Create PhpMyAdmin card
        const phpmyadminCard = document.createElement('div');
        Object.assign(phpmyadminCard.style, cardStyle);
        phpmyadminCard.style.backgroundImage = 'url("./images/phpmyadmin.png")';
    
        const phpmyadminLabel = document.createElement('div');
        Object.assign(phpmyadminLabel.style, labelStyle);
        phpmyadminLabel.textContent = 'PhpMyAdmin';
        phpmyadminCard.appendChild(phpmyadminLabel);
    
        // Now add event listeners after the cards have been created
        prometheusCard.addEventListener('click', () => {
            window.open(window.prometheus, '_blank');
        });
    
        phpmyadminCard.addEventListener('click', () => {
            window.open(window.phpmyadmin, '_blank');
        });
    
        // Append cards to the container
        cardContainer.appendChild(prometheusCard);
        cardContainer.appendChild(phpmyadminCard);
    
        // Append the container to the monitoring section
        monitoringSection.appendChild(cardContainer);
    });
    
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
                    projectButtonsContainer.innerHTML = ''; // Clear existing buttons
    
                    projects.forEach(project => {
                        const button = document.createElement('button');
                        button.textContent = project;
    
                        // Apply the styles directly to the button
                        button.style.width = '100%'; // Full width
                        button.style.padding = '15px 20px'; // Larger padding
                        button.style.fontSize = '18px'; // Larger font size
                        button.style.margin = '10px 0'; // Margin between buttons
                        button.style.borderRadius = '8px'; // Rounded corners
                        button.style.border = 'none'; // No border
                        button.style.cursor = 'pointer'; // Pointer on hover
                        button.style.backgroundColor = '#495057'; // Gray background color
                        button.style.color = '#ffffff'; // White text color
                        button.style.transition = 'background-color 0.3s, transform 0.2s ease-in-out'; // Transitions

                        // Hover effect
                        button.addEventListener('mouseover', () => {
                            button.style.backgroundColor = '#535c64'; // Darker gray on hover
                        });
    
                        button.addEventListener('mouseout', () => {
                            button.style.backgroundColor = '#495057'; // Revert to original gray
                        });
    
                        button.addEventListener('click', () => {
                            console.log(`Button clicked: ${project}`); // Debug log to check if the click event is fired
                            loadProjectPage(project); // Load the corresponding project page
                        });
    
                        projectButtonsContainer.appendChild(button); // Add the button to the container
                    });
                } else {
                    console.error('Expected an array of projects, but received:', projects);
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                if (error.response && error.response.status === 401) {
                    window.top.location.assign('index.html'); // Redirect the entire parent page
                    // Redirect to login if unauthorized
                }
            });
    }
    
    function loadProjectPage(project) {
        // Clear existing content
        setupNewServerSection.innerHTML = '';
    
        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `project.html?projectName=${encodeURIComponent(project)}`; // Pass the project name as a query parameter
    
        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';
    
        // Append the iframe to the section
        setupNewServerSection.appendChild(iframe);
    
        console.log(`Iframe created for project: ${project}`); // Debug log to confirm iframe creation
    }
    


    
    // Function to load the networking.html page into an iframe
    function loadNetworkingPage() {
        // Clear existing content
        setupNetworkInterfaceSection.innerHTML = '';

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `networking.html`; // Path to your networking page

        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';

        // Append the iframe to the section
        setupNetworkInterfaceSection.appendChild(iframe);

        console.log(`Iframe created for networking page`); // Debug log to confirm iframe creation
    }
    // Function to load the networking.html page into an iframe
    function loadConfigurationPage() {
        // Clear existing content
        configurationSection.innerHTML = '';

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `configuration.html`; // Path to your networking page

        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';

        // Append the iframe to the section
        configurationSection.appendChild(iframe);

        console.log(`Iframe created for configuration page`); // Debug log to confirm iframe creation
    }


    function loadTerminalPage() {
        if (!window.Terminal_URL) {
            console.error('Terminal URL is not defined.');
            return;
        }
    
        // Clear existing content
        terminalSection.innerHTML = '';
    
        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.src = `${window.Terminal_URL}`; // Path to your networking page
    
        // Dynamically adjust iframe height based on .main-content height
        const mainContentHeight = document.querySelector('.main-content').offsetHeight;
        iframe.style.width = '100%';
        iframe.style.height = `${mainContentHeight}px`; // Match the height of .main-content
        iframe.style.border = 'none';
    
        // Append the iframe to the section
        terminalSection.appendChild(iframe);
    
        console.log(`Loading terminal from: ${window.Terminal_URL}`);
        console.log('Iframe created successfully:', iframe);
    }
    
    // Default section shown on page load
    if (troubleshootingSection) {
        troubleshootingSection.style.display = 'block'; // Show troubleshooting section by default
    } else {
        console.error('troubleshootingSection not found');
    }
});