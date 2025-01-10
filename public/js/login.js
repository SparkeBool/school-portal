
const apiBaseURL = 'http://localhost:5000/api/auth'; // Replace with your API base URL

document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');
  
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    document.getElementById('loading').classList.add('spinner-border');
    document.getElementById('loading').classList.add('spinner-border-sm');
    document.getElementById('btn1').classList.add('disabled');
  
    // Clear previous messages
    messageContainer.innerHTML = '';
  
  
    // Get form data
    const formData = new FormData(signinForm);
  
    // Convert form data to JSON object
    const formDataJSON = {};
    formData.forEach(function(value, key) {
      formDataJSON[key] = value;
    });
  
    // Send form data to the server using Axios
    axios.post(`${apiBaseURL}/login`, formDataJSON)
      .then(response => {
        // Handle successful response
        console.log(response.data)
        window.location.href = '../admin-dashboard.html'; // Replace 'home.html' with the actual URL of your home page
  
      })
      .catch(error => {
        // Handle error
       console.error('Error during signin:', error.message);
     document.getElementById('loading').classList.remove('spinner-border');
     document.getElementById('loading').classList.remove('spinner-border-sm');
     document.getElementById('btn1').classList.remove('disabled');
        // Extract error message from the API response
        if (error.response && error.response.data && error.response.data.message) {
          showMessage(error.response.data.message, 'danger');
        } else {
          showMessage('An unknown error occurred. Please try again later.', 'danger');
        }
      });
  });
  
  
   // Function to display messages using toast
   function showMessage(message, messageType) {
      // Create alert element
      const alertElement = document.createElement('div');
      alertElement.classList.add('alert');
      alertElement.classList.add(`alert-${messageType}`);
      alertElement.setAttribute('role', 'alert');
    
      // Add message to the alert
      alertElement.textContent = message;
    
      // Append alert to the message container
      messageContainer.appendChild(alertElement);
    
      // Automatically remove alert after 5 seconds
      setTimeout(() => {
        alertElement.remove();
      }, 5000);
    }
  
  
  });