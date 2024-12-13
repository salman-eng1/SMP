document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('authToken')) {
        // If no token, redirect to login page
        window.top.location.assign('index.html'); // Redirect the entire parent page

        // return
    }
    const troubleshootingLink = document.getElementById('troubleshooting-link');
    const setupNetworkInterfaceLink = document.getElementById('setup-network-interface-link');
    const monitoringLink = document.getElementById('monitoring-link'); // Link for Monitoring section
    const logoutLink = document.getElementById('logout-link'); // Link for Monitoring section

    
    const troubleshootingSection = document.getElementById('troubleshooting-section');
    const setupNetworkInterfaceSection = document.getElementById('setup-network-interface-section');
    const monitoringSection = document.getElementById('monitoring-section'); // Monitoring section


    // Function to hide all content sections
    function hideAllSections() {
        console.log('Hiding all sections');
        troubleshootingSection.style.display = 'none';
        setupNetworkInterfaceSection.style.display = 'none';
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

logoutLink.addEventListener('click', () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');

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
    // Default section shown on page load
    if (troubleshootingSection) {
        troubleshootingSection.style.display = 'block'; // Show troubleshooting section by default
    } else {
        console.error('troubleshootingSection not found');
    }
});