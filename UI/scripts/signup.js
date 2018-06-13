const button = document.getElementById('submit');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

button.onclick = () => {
  if (password.value.length === 0 || email.value.length === 0) {
    error.setAttribute('style', 'display: initial;')
    error.innerHTML = 'All form fields are required';
  } else if (password.value !== confirmPassword.value) {
    error.setAttribute('style', 'display: initial;')
    error.innerHTML = 'Passwords do not match';
  } else {
    window.location.href = '../views/profile.html'
  }
};

clearError = () => {
  error.innerHTML = '';
}

email.onkeydown = clearError;

password.onkeydown = clearError;

confirmPassword.onkeydown = clearError;
