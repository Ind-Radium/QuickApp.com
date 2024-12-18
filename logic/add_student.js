// File: admission.js

const STUDENTS_FILE = "students.json"; // File to store student data

// Function to load existing data from localStorage (acts as file storage)
function loadExistingData() {
    const data = localStorage.getItem("students");
    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return [];
        }
    }
    return [];
}

// Function to save data to localStorage
function saveData(data) {
    localStorage.setItem("students", JSON.stringify(data));
}

// Handle form submission
document.getElementById("btn").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Fetch values from the form inputs
    const name = document.getElementById("name").value.trim();
    const guardianName = document.getElementById("guardian-name").value.trim();
    const guardianPhone = document.getElementById("guardian-phone").value.trim();
    const studentPhone = document.getElementById("student-phone").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const address = document.getElementById("address").value.trim();
    const studentClass = document.getElementById("class").value.trim();
    const school = document.getElementById("school").value.trim();
    const version = document.getElementById("version").value.trim();

    // Validate required fields
    if (!name || !guardianName || !guardianPhone || !dob || !address || !studentClass || !school || !version) {
        document.getElementById("global-error").innerText = "All required fields must be filled out.";
        return;
    }

    // Prepare the student data object
    const studentData = {
        name: name,
        guardian_name: guardianName,
        guardian_phone: guardianPhone,
        student_phone: studentPhone,
        dob: dob,
        address: address,
        class: studentClass,
        school: school,
        version: version,
    };

    // Load existing data and append the new student data
    const students = loadExistingData();
    students.push(studentData);

    // Save back to localStorage
    saveData(students);

    // Notify success and clear the form
    document.getElementById("notification").innerText = "Student added successfully!";
    document.getElementById("notification").classList.remove("hidden");

    document.getElementById("admission-form").reset(); // Reset the form
});
