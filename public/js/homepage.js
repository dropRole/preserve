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
    const tBRow = document.createElement('tr'),
      tBCellName = document.createElement('td'),
      tBCellAddress = document.createElement('td'),
      tBCellBusinessHours = document.createElement('td'),
      tBCellResponsiveness = document.createElement('td'),
      tBCellCompliance = document.createElement('td'),
      tBCellTimeliness = document.createElement('td'),
      tBCellOptions = document.createElement('th'),
      tBOReqFrmBtn = document.createElement('button');

    tBCellOptions.colspan = 2;

    tBCellName.textContent = offeror.name;
    tBCellAddress.textContent = offeror.address;
    tBCellBusinessHours.textContent = offeror.businessHours;
    tBCellResponsiveness.textContent = offeror.responsiveness;
    tBCellCompliance.textContent = offeror.compliance;
    tBCellTimeliness.textContent = offeror.timeliness;
    tBOReqFrmBtn.textContent = 'Reserve';

    tBOReqFrmBtn.classList = 'btn btn-warning';

    tBOReqFrmBtn.dataset.toggle = 'modal';
    tBOReqFrmBtn.dataset.target = '#resReqMdl';
    tBOReqFrmBtn.dataset.offeror = offeror.name;
    tBOReqFrmBtn.dataset.idOfferors = offeror.idOfferors;
    tBOReqFrmBtn.addEventListener('click', (event) => {
      const form = document.getElementById('resReqFrm');
      form.querySelector('input[name=offeror]').value =
        event.target.dataset.offeror;
      form.querySelector('input[name=idOfferors]').value =
        event.target.dataset.idOfferors;
    });

    tBRow.append(tBCellName);
    tBRow.append(tBCellAddress);
    tBRow.append(tBCellBusinessHours);
    tBRow.append(tBCellResponsiveness);
    tBRow.append(tBCellCompliance);
    tBRow.append(tBCellTimeliness);
    tBCellOptions.append(tBOReqFrmBtn);
    tBRow.append(tBCellOptions);
    tBody.append(tBRow);
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

  div.append(table);
  documentFragment.append(div);

  modalBody.innerHTML = '';
  modalBody.append(documentFragment);
};
