// passes fulfilled sign up form to the auth mechanism
const signUp = async (event) => {
  event.preventDefault();

  const formData = new FormData(document.getElementById('signUpFrm'));
  const signUpRslt = document.getElementById('signUpRslt');
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const passCnfrInpt = document.getElementById('passCnfrInpt');

  // if passwords match
  if (formData.get('password') !== formData.get('passwordConfirmation')) {
    signUpRslt.textContent = 'Passwords must match.';
    passCnfrInpt.value = '';
    passCnfrInpt.focus();
    return;
  }

  // if password didn't fulfill the criterions
  if (
    !/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
      formData.get('password'),
    )
  ) {
    signUpRslt.textContent =
      'Password must be at least 8 characters long, contain capital, special and a numeric character.';
    passwordInput.value = '';
    passCnfrInpt.value = '';
    passwordInput.focus();
    return;
  }

  if (await checkAccountUsername(formData.get('username'))) {
    signUpRslt.textContent = 'Account username already exists';
    usernameInput.value = '';
    usernameInput.focus();
    return;
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('username', formData.get('username'));
  urlencoded.append('password', formData.get('password'));

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };
  const response = await fetch('/auth/offeree/signup', requestOptions);

  // if offeree successfully signed up
  if (response.status === 201) {
    signUpRslt.textContent = 'You have succesfully signed up.';
    setTimeout(() => {
      window.location.replace('/login')
    }, 3000);
  }

  return;
};

const signUpBtn = document.getElementById('signUpBtn');
signUpBtn.addEventListener('click', signUp);

// check if account username already exists
const checkAccountUsername = async (username) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndtdzRtTCIsImlhdCI6MTUxNjIzOTAyMn0.8YIzHb6tiwN0jSfqvlAfjrOnE857oNdEuFafZk1Hp0c',
  );

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `/offerees/username/${username}`,
    requestOptions,
  );

  // if account username already exists
  return response.status === 200 ? true : false;
};
