(() => {
  // if JWT is not stored in the session
  if (!sessionStorage.getItem('JWT')) window.location.replace('/signin');
})();
