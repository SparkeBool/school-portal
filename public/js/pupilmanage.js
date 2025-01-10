const apiBaseURL = 'http://localhost:5000/api/admin'; // Replace with your API base URL

// Select DOM elements
const form = document.getElementById('add-pupil-form');
const pupilTableBody = document.getElementById('pupil-table-body');
const editForm = document.getElementById('edit-pupil-form');

// Pagination variables
const rowsPerPage = 25; // Number of pupils per page
let currentPage = 1; // Current page number

// Fetch pupils and populate the table with pagination
async function fetchPupils(page = 1, limit = rowsPerPage) {
    try {
        const response = await axios.get(`${apiBaseURL}/pupils`, {
            params: { page, limit }
        });

        const pupils = Array.isArray(response.data.pupils) ? response.data.pupils : [];
        const total = response.data.total || 0;

        if (!Array.isArray(pupils)) {
            console.error('Unexpected data format:', pupils);
            return;
        }

        pupilTableBody.innerHTML = ''; // Clear the table

        // Calculate the starting serial number for the current page
        const startSerial = (page - 1) * limit + 1;

        // Populate the table with current pupils
        pupils.forEach((pupil, index) => {
            const serialNumber = startSerial + index; // Calculate serial number
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${serialNumber}</td>
                <td>${pupil.name}</td>
                <td>${pupil.class}</td>
                <td>${pupil.rollNumber}</td>
                <td>
                    <button onclick="editPupil('${pupil.email}')" class="btn btn-warning">Edit</button>
                    <button onclick="deletePupil('${pupil._id}')" class="btn btn-danger">Delete</button>
                    
                </td>
            `;
            pupilTableBody.appendChild(row);
        });

        // Update pagination controls
        updatePaginationControls(total, page, limit);
    } catch (error) {
        console.error('Error fetching pupils:', error.message);
        alert('Failed to fetch pupils.');
    }
}




// Add new pupil
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const pupil = {
        name: formData.get('fullname'),
        email: formData.get('email'),
        password: "12345678"
    };

    try {
        await axios.post(`${apiBaseURL}/create-pupil`, pupil);
        alert('Pupil added successfully!');
        form.reset();
        fetchPupils(currentPage, rowsPerPage);
    } catch (error) {
        console.error('Error adding pupil:', error.message);
        alert('Failed to add pupil. Please try again.');
    }
});

// Edit pupil
async function editPupil(pupilId) {
    try {
        const response = await axios.get(`${apiBaseURL}/pupil/${pupilId}`);
        const pupil = response.data.pupil;

        // Populate the modal form with pupil details
        document.getElementById('edit-name').value = pupil.name;
        document.getElementById('edit-rollnumber').value = pupil.rollNumber;
        document.getElementById('edit-class').value = pupil.class;
        document.getElementById('edit-age').value = pupil.age || '';
        document.getElementById('edit-email').value = pupil.email;

        // Show the modal
        const editPupilModal = new bootstrap.Modal(document.getElementById('editPupilModal'));
        editPupilModal.show();
    } catch (error) {
        console.error('Error fetching pupil data:', error.message);
        alert('Failed to fetch pupil details.');
    }
}

// Update pupil
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const pupilId = document.getElementById('edit-email').value;
    const updatedPupilData = {
        name: document.getElementById('edit-name').value,
        rollNumber: document.getElementById('edit-rollnumber').value,
        class: document.getElementById('edit-class').value,
        age: document.getElementById('edit-age').value
    };

    try {
        await axios.put(`${apiBaseURL}/pupil/${pupilId}`, updatedPupilData);
        alert('Pupil updated successfully!');
        const editPupilModal = bootstrap.Modal.getInstance(document.getElementById('editPupilModal'));
        editPupilModal.hide();
        fetchPupils(currentPage, rowsPerPage);
    } catch (error) {
        console.error('Error updating pupil:', error.message);
        alert('Failed to update pupil.');
    }
});

// Delete pupillet pupilIdToDelete = null; // Store the pupil ID for deletion

// Show the confirmation modal before deleting
function showDeleteConfirmation(pupilId) {
    pupilIdToDelete = pupilId; // Store the pupil ID to delete
    const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    deleteModal.show(); // Show the modal
}

// Handle the "Yes" button click (delete the pupil)
document.getElementById('confirm-delete-btn').addEventListener('click', async function () {
    if (pupilIdToDelete) {
        try {
            // Proceed to delete pupil
            await axios.delete(`${apiBaseURL}/pupil/${pupilIdToDelete}`);
            alert('Pupil deleted successfully!');
            fetchPupils(currentPage, rowsPerPage); // Refresh the pupil list
        } catch (error) {
            console.error('Error deleting pupil:', error.message);
            alert('Failed to delete pupil.');
        }
    }
    // Close the modal after action
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    deleteModal.hide();
});

// Handle the "No" button click (close the modal without deleting)
document.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', function () {
    console.log('Pupil deletion canceled.');
});

// Trigger the confirmation modal when the delete button is clicked
async function deletePupil(pupilId) {
    showDeleteConfirmation(pupilId); // Show confirmation modal
}


// Update pagination controls
// Update pagination controls
function updatePaginationControls(total, page, limit) {
    const totalPages = Math.ceil(total / limit); // Calculate the total number of pages
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // Update the page info text (e.g., Page 1 of 5)
    pageInfo.textContent = `Page ${page} of ${totalPages}`;

    // Disable or enable the 'Previous' and 'Next' buttons based on the current page
    prevButton.disabled = page === 1; // Disable 'Previous' on the first page
    nextButton.disabled = page === totalPages; // Disable 'Next' on the last page

    // Set up the click handlers for 'Previous' and 'Next' buttons
    prevButton.onclick = () => {
        if (page > 1) {
            currentPage--;
            fetchPupils(currentPage, rowsPerPage); // Fetch the previous page
        }
    };

    nextButton.onclick = () => {
        if (page < totalPages) {
            currentPage++;
            fetchPupils(currentPage, rowsPerPage); // Fetch the next page
        }
    };
}

// Initialize the table with the first page of pupils
fetchPupils(currentPage, rowsPerPage);
