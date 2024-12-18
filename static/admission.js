// Function to show notifications
function showNotification(message, type = 'error') {
    const notification = document.getElementById('notification');

    if (!notification) {
        console.error("Notification element not found");
        return;
    }

    // Clear existing styles and content
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${getIconForType(type)}</span>
        <span>${message}</span>
    `;

    // Dynamically adjust position for screen size (optional, already centered with CSS)
    const viewportHeight = window.innerHeight;
    notification.style.top = `${viewportHeight * 0.1}px`; // 10% from the top of the viewport

    // Show the notification
    notification.classList.remove('hidden');
    notification.classList.add('visible');

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('visible');
        notification.classList.add('hidden');
    }, 3000);
}

// Helper function to get icons based on type
function getIconForType(type) {
    switch (type) {
        case 'success':
            return '✔️'; // Checkmark
        case 'error':
            return '❌'; // Cross
        case 'warning':
            return '⚠️'; // Warning symbol
        case 'info':
            return 'ℹ️'; // Info symbol
        default:
            return ''; // Default to no icon
    }
}








document.getElementById('admission-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        'guardian-name': formData.get('guardian-name'),
        'guardian-phone': formData.get('guardian-phone'),
        'student-phone': formData.get('student-phone'),
        dob: formData.get('dob'),
        address: formData.get('address'),
        class: formData.get('class'),
        school: formData.get('school'),
        version: formData.get('version')
    };

    fetch('https://quickserver-com.onrender.com/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Handle success - you can show a success message here
        if (data.message) {
            document.getElementById('notification').classList.remove('hidden');
            document.getElementById('notification').innerText = data.message;
            document.getElementById('admission-form').reset();
        }
        showNotification("Added student.","success");
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('global-error').innerText = 'There was an error submitting the form. Please try again.';
    });
});
