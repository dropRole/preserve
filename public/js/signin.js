// mediate user credentials, validate them and, regarding the sincerness, return the JWT
const signin = async (event) => {
  event.preventDefault();

  const formData = new FormData(document.getElementById('signInFrm'));
  const signInRslt = document.getElementById('signInRslt');

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlenconded = new URLSearchParams();
  urlenconded.append('username', formData.get('username'));
  urlenconded.append('password', formData.get('password'));

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlenconded,
  };

  const response = await fetch('/auth/signin', requestOptions);

  // if credentials are valid
  if (response.status === 201) {
    const { accessToken } = await response.json();
    sessionStorage.setItem('JWT', accessToken);
    signInRslt.textContent = 'Sign in was successful.';
    setTimeout(() => {
      window.location.replace('/requests');
    }, 3000);
    return;
  }

  signInRslt.textContent = 'Check your credentials.';
  return;
};

const signInBtn = document.getElementById('signInBtn');
signInBtn.addEventListener('click', signin);
