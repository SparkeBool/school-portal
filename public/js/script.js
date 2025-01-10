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

// document.addEventListener('DOMContentLoaded', () => {
//     const deleteButtons = document.querySelectorAll('.delete-btn');
//     deleteButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             if (confirm('Are you sure you want to delete this pupil?')) {
//                 // Add delete functionality here
//                 alert('Pupil deleted!');
//             }
//         });
//     });

//     const addButton = document.querySelector('.add-btn');
//     const cancelButton = document.querySelector('#cancel');
//     const pupilForm = document.querySelector('.pupil-form');
    
//     if (addButton && cancelButton && pupilForm) {
//         // Event listener for the Add button
//         addButton.addEventListener('click', () => {
//             addButton.style.display = 'none';
//             cancelButton.style.display = 'block';
//             pupilForm.style.display = 'block'; // Show the form
//             console.log('Pupil form displayed');
//         });
    
//         // Event listener for the Cancel button
//         cancelButton.addEventListener('click', () => {
//             addButton.style.display = 'block';
//             cancelButton.style.display = 'none';
//             pupilForm.style.display = 'none'; // Hide the form
//             console.log('Pupil form hidden');
//         });
//     } else {
//         console.error('Required elements not found');
//     }
    

//     const editButtons = document.querySelectorAll('.edit-btn');
//     editButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             alert('Edit pupil functionality not implemented yet!');
//         });
//     });
// });
