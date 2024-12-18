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

// Example usage:
// showNotification("Operation successful!", "success");
// showNotification("An error occurred!", "error");
// showNotification("This is a warning!", "warning");
// showNotification("Here is some information.", "info");
