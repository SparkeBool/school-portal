const apiBaseURL = 'http://localhost:5000/api/admin'; // Replace with your API base URL

// Select DOM elements
const subjectTableBody = document.getElementById('subject-table-body');
const prevSubjectPageBtn = document.getElementById('prev-page');
const nextSubjectPageBtn = document.getElementById('next-page');
const subjectPageInfo = document.getElementById('page-info');
const form = document.getElementById('add-subject-form');


let currentSubjectPage = 1;
const subjectPageLimit = 10;
let rowsPerPage = 25;

async function fetchSubjects(page = 1) {
  try {
    const response = await axios.get(`${apiBaseURL}/subjects`, {
      params: { page, limit: subjectPageLimit },
    });

    const { subjects, totalPages, currentPage: current } = response.data;

    // Clear existing table rows
    subjectTableBody.innerHTML = '';

    if (subjects.length === 0) {
      subjectTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No subjects found.</td>
        </tr>
      `;
      return;
    }

    // Populate the table with subject data
    subjects.forEach((subject, index) => {
      const row = `
        <tr>
          <td>${(page - 1) * subjectPageLimit + index + 1}</td>
          <td>${subject.name}</td>
          
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteSubject('${subject._id}')">Delete</button>
          </td>
        </tr>
      `;
      subjectTableBody.insertAdjacentHTML('beforeend', row);
    });

    // Update pagination info
    subjectPageInfo.textContent = `Page ${current} of ${totalPages}`;
    prevSubjectPageBtn.disabled = current === 1;
    nextSubjectPageBtn.disabled = current === totalPages;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    alert('Failed to fetch subjects.');
  }
}

// Pagination controls
prevSubjectPageBtn.addEventListener('click', () => {
  if (currentSubjectPage > 1) {
    currentSubjectPage--;
    fetchSubjects(currentSubjectPage);
  }
});

nextSubjectPageBtn.addEventListener('click', () => {
  currentSubjectPage++;
  fetchSubjects(currentSubjectPage);
});

// Initial fetch
fetchSubjects();




// Add new pupil
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = {
        name: formData.get('name'),
        teacher: formData.get('teacher'),
       };

       console.log(subject);

    try {
        await axios.post(`${apiBaseURL}/create-subject`, subject);
        alert('Subject added successfully!');
        form.reset();
        fetchSubjects(currentPage, rowsPerPage);
    } catch (error) {
        console.error('Error adding Subject:', error.response.data.message);
        alert('Failed to add Subject. Please try again.');
    }
});


async function fetchSubjectList() {
    try {
        // Make the request using axios
        const response = await axios.get(`${apiBaseURL}/subjects`);

        // Safely extract the subjects array
        const subjects = Array.isArray(response.data.subjects) ? response.data.subjects : [];
        const subjectSelect = document.getElementById('subject-select');

        // Clear any existing options in the select element
        subjectSelect.innerHTML = '';

        // Populate the select element with the retrieved subjects
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject._id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
}

fetchSubjectList();
// Debounce wrapper to limit function execution
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
const pupilInput = document.getElementById('pupil-name');
const pupilDropdown = document.getElementById('pupil-search-dropdown');
const pupilIdField = document.getElementById('pupil-id'); // Hidden input field for pupil ID

// Fetch and display search results using Axios
const fetchAndDisplayPupils = debounce(async (event) => {
  const searchTerm = event.target.value.trim();

  if (searchTerm.length > 0) {
    try {
      const response = await axios.get(`${apiBaseURL}/pupils/search`, {
        params: { name: searchTerm }, // Pass `name` as query param
      });

      const pupils = response.data.results; // Access the `results` array from the response
      populateDropdown(pupils, searchTerm);
    } catch (error) {
      console.error('Error fetching pupils:', error);
      pupilDropdown.style.display = 'none'; // Hide the dropdown if an error occurs
    }
  } else {
    pupilDropdown.style.display = 'none'; // Hide the dropdown if input is cleared
  }
}, 300); // Delay of 300ms

pupilInput.addEventListener('input', fetchAndDisplayPupils);

// Populate dropdown with search results
function populateDropdown(pupils, searchTerm) {
  pupilDropdown.innerHTML = ''; // Clear existing dropdown content

  if (pupils.length === 0) {
    pupilDropdown.style.display = 'none';
    return;
  }

  pupils.forEach((pupil) => {
    const dropdownItem = document.createElement('div');
    dropdownItem.className = 'dropdown-item';
    dropdownItem.style.cursor = 'pointer';

    // Highlight matching text
    dropdownItem.innerHTML = highlightText(pupil.name, searchTerm);

    // Handle click on a dropdown item
    dropdownItem.addEventListener('click', () => {
      pupilInput.value = pupil.name; // Set input value to selected name
      pupilIdField.value = pupil._id; // Set the hidden field value to selected pupil ID
      pupilDropdown.style.display = 'none'; // Hide the dropdown
    });

    pupilDropdown.appendChild(dropdownItem);
  });

  pupilDropdown.style.display = 'block'; // Show the dropdown
}

// Highlight matching text in the dropdown
function highlightText(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>'); // Wrap the matching text with <mark>
}

// Hide dropdown when clicking outside the input and dropdown
document.addEventListener('click', (event) => {
  if (!pupilInput.contains(event.target) && !pupilDropdown.contains(event.target)) {
    pupilDropdown.style.display = 'none';
  }
});


const assignForm = document.getElementById('assign-pupil-form');
const subjectSelect = document.getElementById('subject-select');

assignForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const pupilId = pupilIdField.value; // Get selected pupil ID
  const subjectId = subjectSelect.value; // Get selected subject ID

  // Validate form inputs
  if (!pupilId || !subjectId) {
    alert('Please select a valid pupil and subject.');
    return;
  }

  try {
    const response = await axios.post(`${apiBaseURL}/subject/assign-pupil`, {
      pupilId,
      subjectId,
    });

    alert(response.data.message); // Success message
fetchAssignedPupils();

  } catch (error) {
    console.error('Error assigning pupil to subject:', error);

    // Show error message from server if available
    alert(
      (error.response && error.response.data.message) || 
      'Failed to assign pupil to subject. Please try again.'
    );
  }
});

const pupilAssignmentTableBody = document.getElementById('pupil-assignment-table-body');
const prevPageBtn = document.getElementById('prev-pupil-page');
const nextPageBtn = document.getElementById('next-pupil-page');
const pageInfo = document.getElementById('pupil-page-info');


const pageLimit = 10;
const currentPage = 1;

async function fetchAssignedPupils(page = 1) {
  try {
    const response = await axios.get(`${apiBaseURL}/pupils/assignments`, {
      params: { page, limit: pageLimit },
    });

    const { pupils, totalPages, currentPage: current } = response.data;

    // Clear existing table rows
    pupilAssignmentTableBody.innerHTML = '';

    if (pupils.length === 0) {
      pupilAssignmentTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No assignments found.</td>
        </tr>
      `;
      return;
    }

    // Populate the table with pupil and subject data
    pupils.forEach((pupil, index) => {
      const subjectNames = pupil.subjects.map((subject) => subject.name).join(', ') || 'No subjects assigned';
      const row = `
        <tr>
          <td>${(page - 1) * pageLimit + index + 1}</td>
          <td>${pupil.name}</td>
          <td>${subjectNames}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="removeAssignment('${pupil._id}')">Remove</button>
          </td>
        </tr>
      `;
      pupilAssignmentTableBody.insertAdjacentHTML('beforeend', row);
    });

    // Update pagination info
    pageInfo.textContent = `Page ${current} of ${totalPages}`;
    prevPageBtn.disabled = current === 1;
    nextPageBtn.disabled = current === totalPages;
  } catch (error) {
    console.error('Error fetching assigned pupils:', error);
    alert('Failed to fetch assignments.');
  }
}

// Pagination controls
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchAssignedPupils(currentPage);
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  fetchAssignedPupils(currentPage);
});

// Initial fetch
fetchAssignedPupils();



// Update pagination controls
// Update pagination controls
function updatePaginationControls(total, page, limit) {
    const totalPages = Math.ceil(total / limit); // Calculate the total number of pages
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // Update the page info text (e.g., Page 1 of 5)
    pageInfo.textContent = `total Records `;

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
fetchSubjects(currentPage, rowsPerPage);


async function removeAssignment(pupilId) {
  if (!confirm('Are you sure you want to remove this assignment?')) return;

  try {
    const response = await axios.delete(`${apiBaseURL}/subject/unassign-pupil`, {
      data: { pupilId }, // Send pupilId in the request body
    });

    alert(response.data.message);
    fetchAssignedPupils(currentPage); // Refresh the table
  } catch (error) {
    console.error('Error removing assignment:', error);
    alert('Failed to remove assignment.');
  }
}


async function deleteSubject(subjectId) {
  if (!confirm('Are you sure you want to delete this subject?')) return;

  try {
    const response = await axios.delete(`${apiBaseURL}/subjects/${subjectId}`);

    alert(response.data.message);
    fetchSubjects(currentSubjectPage); // Refresh the table
  } catch (error) {
    console.error('Error deleting subject:', error);
    alert('Failed to delete subject.');
  }
}
