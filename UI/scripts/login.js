const button = document.getElementById('submit');
const email = document.getElementById('email');
const password = document.getElementById('password');

button.onclick = () => {
  if (password.value.length === 0 || email.value.length === 0) {
    error.setAttribute('style', 'display: initial;')
    error.innerHTML = 'All form fields are required';
  } else {
    window.location.href = '../views/profile.html'
  }
};

email.onkeydown = () => {
  error.innerHTML = '';
};

password.onkeydown = () => {
  error.innerHTML = '';
};
