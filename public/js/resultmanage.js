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
