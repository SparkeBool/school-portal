const apiUrl = 'http://localhost:5000/api/admin';

// Select DOM elements
const addResultForm = document.getElementById('addResultForm');
const pupilNameInput = document.getElementById('pupil_name');
const pupilSuggestions = document.getElementById('pupilSuggestions');
const pupilIdInput = document.getElementById('pupil_id');
const academicYearDropdown = document.getElementById('academic_year');
const subjectsDropdown = document.getElementById('subjects');
const resultsList = document.getElementById('resultsList');

// Fetch and populate academic years
async function fetchAcademicYears() {
    try {
        const response = await axios.get(`${apiUrl}/academic-years`);
        response.data.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            academicYearDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching academic years:', error);
    }
}

// Fetch and populate subjects
async function fetchSubjects() {
    try {
        const response = await axios.get(`${apiUrl}/subjects`);
        response.data.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.name;
            option.textContent = subject.name;
            subjectsDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
}

// Fetch pupils by name
async function fetchPupils(name) {
    try {
        const response = await axios.get(`${apiUrl}/pupils`, { params: { name } });
        return response.data;
    } catch (error) {
        console.error('Error fetching pupils:', error);
        return [];
    }
}

// Handle input changes in the pupil name field
pupilNameInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) {
        pupilSuggestions.innerHTML = ''; // Clear suggestions for short queries
        return;
    }

    const pupils = await fetchPupils(query);
    displayPupilSuggestions(pupils);
});

// Display pupil suggestions
function displayPupilSuggestions(pupils) {
    pupilSuggestions.innerHTML = ''; // Clear existing suggestions

    pupils.forEach(pupil => {
        const li = document.createElement('li');
        li.textContent = pupil.name;
        li.addEventListener('click', () => selectPupil(pupil));
        pupilSuggestions.appendChild(li);
    });
}

// Select a pupil from the suggestions
function selectPupil(pupil) {
    pupilNameInput.value = pupil.name; // Set the input to the selected name
    pupilIdInput.value = pupil.id;    // Set the hidden input to the pupil ID
    pupilSuggestions.innerHTML = ''; // Clear suggestions
}

// Add a new result
addResultForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedSubjects = Array.from(subjectsDropdown.selectedOptions).map(option => ({
        subject_name: option.value,
    }));

    const newResult = {
        pupil_id: pupilIdInput.value,
        term: document.getElementById('term').value,
        academic_year: academicYearDropdown.value,
        subjects: selectedSubjects,
        total_marks: parseFloat(document.getElementById('total_marks').value),
        percentage: parseFloat(document.getElementById('percentage').value),
        overall_grade: document.getElementById('overall_grade').value,
    };

    try {
        await axios.post(`${apiUrl}/results`, newResult);
        addResultForm.reset();
        alert('Result added successfully!');
        fetchResults();
    } catch (error) {
        console.error('Error adding result:', error);
    }
});

// Initialize dropdowns and suggestions
fetchAcademicYears();
fetchSubjects();
