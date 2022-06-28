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

      // if response successfully returned
      if (response.status === 200) {
        const geocoding = await response.json();
        const estGeoMun = document.getElementById('estGeoMun');
        const srchOffrBtn = document.getElementById('srchOffrBtn');
        estGeoMun.textContent = `Search offerors for ${geocoding.address.town}`;
        srchOffrBtn.disabled = false;
        srchOffrBtn.dataset.municipality = geocoding.address.town;
        srchOffrBtn.addEventListener('click', getOfferorsByGeolocation);
      }
    },
    () => console.warn('Geolocation API is not present.'),
    {
      enableHighAccuracy: true,
    },
  );
};
establishGeolocation();

// create and return table element populated with offeror data
const createOfferorTable = (offerors) => {
  const table = document.createElement('table'),
    tHead = document.createElement('thead'),
    tHdRow = document.createElement('tr'),
    tHdCellName = document.createElement('th'),
    tHdCellAddress = document.createElement('th'),
    tHdCellBusinessHours = document.createElement('th'),
    tHdCellResponsiveness = document.createElement('th'),
    tHdCellCompliance = document.createElement('th'),
    tHdCellTimeliness = document.createElement('th'),
    tBody = document.createElement('tbody');

  table.classList = 'table table-borderless';

  tHdCellName.textContent = 'Name';
  tHdCellAddress.textContent = 'Address';
  tHdCellBusinessHours.textContent = 'Business hours';
  tHdCellResponsiveness.textContent = 'Responsiveness(mark)';
  tHdCellCompliance.textContent = 'Compliance(mark)';
  tHdCellTimeliness.textContent = 'Timeliness(mark)';

  tHdRow.append(tHdCellName);
  tHdRow.append(tHdCellAddress);
  tHdRow.append(tHdCellBusinessHours);
  tHdRow.append(tHdCellResponsiveness);
  tHdRow.append(tHdCellCompliance);
  tHdRow.append(tHdCellTimeliness);

  tHead.append(tHdRow);

  offerors.forEach((offeror) => {
    const tBdRow = document.createElement('tr'),
      tBdCellName = document.createElement('td'),
      tBdCellAddress = document.createElement('td'),
      tBdCellBusinessHours = document.createElement('td'),
      tBdCellResponsiveness = document.createElement('td'),
      tBdCellCompliance = document.createElement('td'),
      tBdCellTimeliness = document.createElement('td');

    tBdCellName.textContent = offeror.name;
    tBdCellAddress.textContent = offeror.address;
    tBdCellBusinessHours.textContent = offeror.businessHours;
    tBdCellResponsiveness.textContent = offeror.responsiveness;
    tBdCellCompliance.textContent = offeror.compliance;
    tBdCellTimeliness.textContent = offeror.timeliness;

    tBdRow.append(tBdCellName);
    tBdRow.append(tBdCellAddress);
    tBdRow.append(tBdCellBusinessHours);
    tBdRow.append(tBdCellResponsiveness);
    tBdRow.append(tBdCellCompliance);
    tBdRow.append(tBdCellTimeliness);
    tBody.append(tBdRow);
  });

  table.append(tHead);
  table.append(tBody);

  return table;
};

// fetch an offeror list based on the offeree geolocation and render the DocumentFragment
const getOfferorsByGeolocation = async (event) => {
  const municipality = event.target.dataset.municipality;

  const headers = new Headers();
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `/offerors/geolocation/${municipality}`,
    requestOptions,
  );

  const offerors = await response.json();

  const documentFragment = new DocumentFragment(),
    div = document.createElement('div'),
    table = createOfferorTable(offerors),
    modalBody = document.querySelector('.modal-body');

  div.classList = 'table-responsive';

  div.append(table)
  documentFragment.append(div);

  modalBody.innerHTML = '';
  modalBody.append(documentFragment);
};
