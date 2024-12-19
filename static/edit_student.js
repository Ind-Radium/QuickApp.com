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


document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const studentIdInput = document.getElementById("student-id");
    const errorMessage = document.querySelector(".error-message");

    searchButton.addEventListener("click", async () => {
        const studentId = studentIdInput.value.trim();
    
        // Reset error message
        errorMessage.textContent = "";
    
        if (studentId === "") {
            showNotification("Please enter a valid Student ID.","error");
            return;
        }
    
        try {
            // Fetch student details from the API
            const studentData = await fetchStudentDetails(studentId);
    
            if (studentData) {
                // Populate fields with student data
                populateFormFields(studentData);
            } else {
                // Show error message if student not found
                showNotification("Student not found. Please try again.","error");
            }
        } catch (error) {
            // Handle API errors
            showNotification("An error occurred while searching. Please try again later.","error");
            console.error("API Error:", error);
        }
    });
    

    /**
     * Fetches student details from the API
     * @param {string} studentId - The ID of the student to search for
     * @returns {Promise<object|null>} - A promise that resolves to student data or null if not found
     */
    async function fetchStudentDetails(studentId) {
        try {
            const response = await fetch(`https://quickserver-com.onrender.com/students/${studentId}`);
    
            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} - ${response.statusText}`);
                if (response.status === 404) {
                    return null; // Student not found
                }
                throw new Error(`API returned status ${response.status}`);
            }
    
            const data = await response.json();
            console.log("API Response:", data); // Log the response
            return data; // Return parsed JSON if successful
        } catch (error) {
            console.error("Error fetching student details:", error);
            throw error; // Ensure errors are propagated
        }
    }

    /**
     * Populates the form fields with the student data
     * @param {object} studentData - The student data to populate
     */
    function populateFormFields(studentData) {
        document.getElementById("name").value = studentData.name || "";
        document.getElementById("guardian-name").value = studentData.guardian_name || ""; // Adjust key
        document.getElementById("guardian-phone").value = studentData.guardian_phone || ""; // Adjust key
        document.getElementById("student-phone").value = studentData.studentPhone || "";
        document.getElementById("dob").value = studentData.dob || "";
        document.getElementById("address").value = studentData.address || "";
        document.getElementById("class").value = studentData.class || "";
        document.getElementById("school").value = studentData.school || "";
        document.getElementById("version").value = studentData.version || "";
    }
    
});

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const updateButton = document.getElementById("btn");
    const studentIdInput = document.getElementById("student-id");
    const errorMessage = document.querySelector(".error-message");

    let currentStudentId = null;

    // Search for the student details
    searchButton.addEventListener("click", async () => {
        const studentId = studentIdInput.value.trim();

        // Reset error message
        errorMessage.textContent = "";
        updateButton.disabled = true; // Disable update button initially

        if (studentId === "") {
            showNotification("Please enter a valid Student ID.","error");
            return;
        }

        try {
            // Fetch student details from the API
            const studentData = await fetchStudentDetails(studentId);

            if (studentData) {
                currentStudentId = studentId; // Store the current student ID
                populateFormFields(studentData);
                updateButton.disabled = false; // Enable update button
            } else {
                showNotification("Student not found. Please try again.","error");
            }
        } catch (error) {
            errorMessage.textContent = "An error occurred while searching. Please try again later.";
            console.error("API Error:", error);
        }
    });

    // Update student details
    updateButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        if (!currentStudentId) {
            showNotification("No student selected for updating.","warning")
            return;
        }

        const updatedDetails = collectFormData();

        try {
            const isUpdated = await updateStudentDetails(currentStudentId, updatedDetails);

            if (isUpdated) {
                showNotification("Details updated successfully.","success")
            } else {
                showNotification("Failed to update details. Please try again.","error")
            }
        } catch (error) {
            showNotification("An error occurred while updating. Please try again later.","error")
            console.error("API Error:", error);
        }
    });

    // Fetch student details from the API
    async function fetchStudentDetails(studentId) {
        try {
            const response = await fetch(`https://quickserver-com.onrender.com/students/${studentId}`);

            if (!response.ok) {
                console.error(`Fetch Error: ${response.status} - ${response.statusText}`);
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);
            return data;
        } catch (error) {
            console.error("Error fetching student details:", error);
            throw error;
        }
    }

    // Update student details on the server
    async function updateStudentDetails(studentId, updatedDetails) {
        try {
            const response = await fetch(`https://quickserver-com.onrender.com/students/${studentId}`, {
                method: "PUT", // Use PUT or POST depending on your server's requirements
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                console.error(`Update Error: ${response.status} - ${response.statusText}`);
                return false;
            }

            const data = await response.json();
            console.log("Update Response:", data);
            return true;
        } catch (error) {
            console.error("Error updating student details:", error);
            throw error;
        }
    }

    // Populate the form fields with fetched data
    function populateFormFields(studentData) {
        document.getElementById("name").value = studentData.name || "";
        document.getElementById("guardian-name").value = studentData.guardian_name || "";
        document.getElementById("guardian-phone").value = studentData.guardian_phone || "";
        document.getElementById("student-phone").value = studentData.studentPhone || "";
        document.getElementById("dob").value = studentData.dob || "";
        document.getElementById("address").value = studentData.address || "";
        document.getElementById("class").value = studentData.class || "";
        document.getElementById("school").value = studentData.school || "";
        document.getElementById("version").value = studentData.version || "";
    }

    // Collect data from the form for updating
    function collectFormData() {
        return {
            name: document.getElementById("name").value.trim(),
            guardian_name: document.getElementById("guardian-name").value.trim(),
            guardian_phone: document.getElementById("guardian-phone").value.trim(),
            studentPhone: document.getElementById("student-phone").value.trim(),
            dob: document.getElementById("dob").value,
            address: document.getElementById("address").value.trim(),
            class: document.getElementById("class").value,
            school: document.getElementById("school").value.trim(),
            version: document.getElementById("version").value,
        };
    }
});

