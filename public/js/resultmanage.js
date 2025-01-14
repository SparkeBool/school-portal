const apiUrl = 'http://localhost:5000/api/admin';

// DOM Elements
const resultForm = document.getElementById('addResultForm');
const pupilNameInput = document.getElementById('pupil-name');
const pupilSuggestions = document.getElementById('pupil-search-dropdown');
const pupilIdInput = document.getElementById('pupil-id');
const academicYearDropdown = document.getElementById('academic_year');
const subjectsDropdown = document.getElementById('subjects');
const marksInput = document.getElementById('marks');
const messageDiv = document.getElementById('message');

// Debounce utility function
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Fetch Academic Years
async function fetchAcademicYears() {
  try {
    const response = await axios.get(`${apiUrl}/academic-years`);
    academicYearDropdown.innerHTML = '<option value="">Select an academic year</option>';
    response.data.forEach((year) => {
      const option = document.createElement('option');
      option.value = year._id;
      option.textContent = year.year;
      academicYearDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching academic years:', error);
  }
}

// Fetch Subjects Assigned to a Specific Pupil
async function fetchSubjects(pupilId) {
  if (!pupilId) {
    subjectsDropdown.innerHTML = '<option value="">Select a subject</option>';
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/pupils/${pupilId}/subjects`);
    subjectsDropdown.innerHTML = '<option value="">Select a subject</option>';
    response.data.subjects.forEach((subject) => {
      const option = document.createElement('option');
      option.value = subject._id;
      option.textContent = subject.name;
      subjectsDropdown.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching assigned subjects:', error);
  }
}

// Debounced Pupil Search
const fetchPupils = debounce(async (event) => {
  const searchTerm = event.target.value.trim();
  if (!searchTerm) {
    pupilSuggestions.style.display = 'none';
    return;
  }

  try {
    const response = await axios.get(`${apiUrl}/pupils/search`, { params: { name: searchTerm } });
    populateDropdown(response.data.results, searchTerm);
  } catch (error) {
    console.error('Error fetching pupils:', error);
  }
}, 300);

// Populate Pupil Dropdown
function populateDropdown(pupils, searchTerm) {
  pupilSuggestions.innerHTML = '';
  if (pupils.length === 0) {
    pupilSuggestions.style.display = 'none';
    return;
  }

  pupils.forEach((pupil) => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = highlightText(pupil.name, searchTerm);
    item.addEventListener('click', () => {
      pupilNameInput.value = pupil.name;
      pupilIdInput.value = pupil._id; // Hidden input for the pupil ID
      pupilSuggestions.style.display = 'none';
      fetchSubjects(pupil._id); // Fetch subjects assigned to the pupil
    });
    pupilSuggestions.appendChild(item);
  });

  pupilSuggestions.style.display = 'block';
}

// Highlight Text
function highlightText(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Handle Form Submission
resultForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const pupilId = pupilIdInput.value;
  const subjectId = subjectsDropdown.value;
  const academicYearId = academicYearDropdown.value;
  const term = document.getElementById('term').value; // Get the term
  const marks = marksInput.value;

  if (!pupilId || !subjectId || !academicYearId || !term || !marks) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const response = await axios.post(`http://localhost:5000/api/results/add-results`, {
      pupilId,
      subjectId,
      academicYearId,
      term,
      marks,
    });

    // Display success message
    messageDiv.style.color = 'green';
    messageDiv.textContent = `Result added successfully! Grade: ${response.data.grade}`;
    resultForm.reset();
    subjectsDropdown.innerHTML = '<option value="">Select a subject</option>';
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to add result. Please try again.';
    messageDiv.style.color = 'red';
    messageDiv.textContent = errorMessage;
  }
});


// Initialize
fetchAcademicYears();
pupilNameInput.addEventListener('input', fetchPupils);
document.addEventListener('click', (e) => {
  if (!pupilNameInput.contains(e.target) && !pupilSuggestions.contains(e.target)) {
    pupilSuggestions.style.display = 'none';
  }
});

const resultsList = document.getElementById('resultsList');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');

let currentPage = 1;
let totalPages = 1;

async function fetchResults(page = 1) {
  try {
    const response = await axios.get(`http://localhost:5000/api/results/all-results`, {
      params: { page, limit: 25 },
    });

    const results = response.data.results;
    totalPages = response.data.totalPages;
    currentPage = response.data.currentPage;

    // Clear the table body
    resultsList.innerHTML = '';

    // Debug: Log the results to check structure
    // console.log('Results:', results);

    // Populate the table with results
    results.forEach((result) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${result.pupil.name}</td>
        <td>${result.pupil.class}</td>
        <td>${result.subject.name}</td>
        <td>${result.marks}</td>
        <td>${result.grade}</td>
        <td>${result.academicYear ? result.academicYear.year || "N/A" : "N/A"}</td>
        <td>${result.term}</td>
        <td>
      <button class="btn btn-sm btn-warning" onclick="editResult('${result._id}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteResult('${result._id}')">Delete</button>
    </td>

      `;
      resultsList.appendChild(row);
    });

    // Update pagination controls
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  } catch (error) {
    console.error('Error fetching results:', error);
  }
}


// Pagination buttons logic
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    fetchResults(currentPage - 1);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    fetchResults(currentPage + 1);
  }
});


async function editResult(resultId) {
  try {
    // Fetch the result details from the server
    const response = await axios.get(`http://localhost:5000/api/results/${resultId}`);
    const result = response.data;

    // Populate the modal fields with the result data
    document.getElementById('editResultId').value = result._id;
    document.getElementById('editPupilName').value = result.pupil.name;
    document.getElementById('editSubject').value = result.subject.name;
    document.getElementById('editMarks').value = result.marks;
    document.getElementById('editTerm').value = result.term;
    document.getElementById('editAcademicYear').value = result.academicYear.year;

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editResultModal'));
    editModal.show();
  } catch (error) {
    console.error('Error fetching result:', error);
  }
}


// Edit result functionality
document.getElementById('editResultForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const resultId = document.getElementById('editResultId').value;
  const updatedMarks = document.getElementById('editMarks').value;
  const updatedTerm = document.getElementById('editTerm').value;

  try {
    // Send the updated data to the server
    await axios.put(`http://localhost:5000/api/results/update/${resultId}`, {
      marks: updatedMarks,
      term: updatedTerm,
    });

    // Close the modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editResultModal'));
    editModal.hide();

    // Refresh the results table
    fetchResults();
  } catch (error) {
    console.error('Error updating result:', error);
  }
});

// Delete result functionality
async function deleteResult(resultId) {
  try {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this result?')) {
      return;
    }

    // Send DELETE request to the backend
    const response = await axios.delete(`http://localhost:5000/api/results/delete-result/${resultId}`);

    if (response.status === 200) {
      alert('Result deleted successfully');
      // Refresh the results table
      fetchResults(currentPage);
    }
  } catch (error) {
    console.error('Error deleting result:', error);
    alert('Failed to delete result. Please try again.');
  }
}


// Fetch the first page of results when the page loads
fetchResults();

