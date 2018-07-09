const button = document.getElementById('submit');
const destination = document.getElementById('destination');
const departureTime = document.getElementById('departureTime');
const vehicleDetails = document.getElementById('vehicleDetails');

button.onclick = () => {
  if (destination.value.length === 0 || departureTime.value.length === 0 || vehicleDetails.value.length === 0) {
    error.setAttribute('style', 'display: initial;')
    error.innerHTML = 'All form fields are required';
  } else {
    window.location.href = '../views/profile.html'
  }
};

clearError = () => {
  error.innerHTML = '';
}

destination.onkeydown = clearError;

departureTime.onkeydown = clearError;

vehicleDetails.onkeydown = clearError;
