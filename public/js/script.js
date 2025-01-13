// Get the sidebar, toggle button, and body
const sidebar = document.getElementById('sidebar');
const navbarToggle = document.getElementById('navbar-toggle');
const body = document.getElementById('body');

// Toggle the sidebar on and off when clicking the navbar button
navbarToggle.addEventListener('click', function(event) {
    event.stopPropagation();  // Prevent click event from propagating to the body
    sidebar.classList.toggle('active');
});

// // Hide the sidebar if the body is clicked
// body.addEventListener('click', (event)=> {

//     // Check if the sidebar is not active and if the clicked target is not the sidebar or the navbar toggle button
//     if (!sidebar.contains(event.target) && !navbarToggle.contains(event.target)) {
//         sidebar.classList.remove('active');
//     }
// });



document.querySelector('.logout-link').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default link behavior
    // Add your logout logic here (like clearing session/cookies or redirecting to login page)
    alert('Logged out!');
    // Redirect to the login page or home page
    window.location.href = "/login";  // Redirect to login page
});

const apiUrl = 'http://localhost:5000/api/admin'; // Backend API URL
const dropdownElement = document.getElementById('academic-years-dropdown');
const newYearInput = document.getElementById('new-year');
const addYearButton = document.getElementById('add-year-btn');
const errorMessage = document.getElementById('error-message');

// Fetch and populate academic years in the dropdown
async function fetchAcademicYears() {
  try {
    const response = await axios.get(`${apiUrl}/academic-years`);
    const academicYears = response.data;

    academicYears.sort((a, b) => {
        const yearA = parseInt(a.year, 10); // Convert to number for proper sorting
        const yearB = parseInt(b.year, 10);
        return yearB - yearA; // Descending order
      });
      
    dropdownElement.innerHTML = ''; // Clear existing options
    academicYears.forEach((year) => {
      const option = document.createElement('option');
      option.value = year._id; // Use the ID as the value
      option.textContent = year.year;
      dropdownElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching academic years:', error);
    errorMessage.textContent = 'Failed to fetch academic years.';
  }
}

// Add a new academic year
async function addAcademicYear() {
  const newYear = newYearInput.value.trim();
  if (!newYear) {
    errorMessage.textContent = 'Please enter a valid year.';
    return;
  }
  try {
    const response = await axios.post(apiUrl, { year: newYear });
    const addedYear = response.data;
    // Add the new year to the dropdown
    const option = document.createElement('option');
    option.value = addedYear._id;
    option.textContent = addedYear.year;
    dropdownElement.appendChild(option);
    newYearInput.value = ''; // Clear input
    errorMessage.textContent = ''; // Clear error message
  } catch (error) {
    console.error('Error adding academic year:', error);
    errorMessage.textContent = 'Failed to add academic year.';
  }
}

// Event listeners
addYearButton.addEventListener('click', addAcademicYear);

// Fetch academic years on page load
fetchAcademicYears();
