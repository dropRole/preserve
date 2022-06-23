// establish clients geolocation and expose it on the template
const establishGeolocation = () => {
  // if Geolocation API is present
  if (!('geolocation' in navigator)) return;
  navigator.geolocation.getCurrentPosition(
    async (geolocation) => {
      const requestOptions = {
        method: 'GET',
      };

      const response = await fetch(
        `/geolocation/geocoding?lat=${geolocation.coords.latitude}&long=${geolocation.coords.longitude}`,
        requestOptions,
      );
      const geocoding = await response.json();
      document.getElementById(
        'geolocation',
      ).textContent = `Search offerors for ${geocoding.address.town}`;
    },
    () => console.warn('Geolocation API is not present.'),
    {
      enableHighAccuracy: true,
    },
  );
};
establishGeolocation();
