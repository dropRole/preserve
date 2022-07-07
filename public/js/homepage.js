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

// create and return cards populated with reservation requests data for the subject offeror
const renderRequestInsightCards = (requests) => {
  const documentFragment = new DocumentFragment(),
    modalBody = document.querySelector('#insightModal .modal-body');
  requests.forEach((request) => {
    const card = document.createElement('div'),
      unorderedList = document.createElement('ul'),
      lstItmOffr = document.createElement('li'),
      lstItmAddr = document.createElement('li'),
      lstItmReqAt = document.createElement('li'),
      lstItmReqFor = document.createElement('li'),
      lstItmReqSeats = document.createElement('li'),
      lstItmReqCause = document.createElement('li'),
      lstItmReqNote = document.createElement('li');

    card.classList = 'card';
    unorderedList.classList = 'list-group list-group-flush';

    lstItmOffr.textContent = `Offeror: ${request.offeror.name}`;
    lstItmAddr.textContent = `Address: ${request.offeror.address}`;
    lstItmReqAt.textContent = `Requested at: ${new Date(
      request.requestedAt,
    ).toLocaleTimeString()}`;
    lstItmReqFor.textContent = `Requested for: ${new Date(
      request.requestedFor,
    ).toLocaleTimeString()}`;
    lstItmReqSeats.textContent = `Seats: ${request.seats}`;
    lstItmReqCause.textContent = `Cause: ${request.cause}`;
    lstItmReqNote.textContent = `Note: ${request.note}`;

    unorderedList.append(lstItmOffr);
    unorderedList.append(lstItmAddr);
    unorderedList.append(lstItmReqAt);
    unorderedList.append(lstItmReqFor);
    unorderedList.append(lstItmReqSeats);
    unorderedList.append(lstItmReqCause);
    unorderedList.append(lstItmReqNote);
    card.append(unorderedList);
    documentFragment.append(card);
  });
  modalBody.innerHTML = '';
  modalBody.append(documentFragment);
};

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
      const form = document.getElementById('reservationRequest');
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

// submit the reservation request for the subject offeror
const submitReservationRequest = async (event) => {
  event.preventDefault();

  const formData = new FormData(document.getElementById('reservationRequest'));

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('idOfferors', formData.get('idOfferors'));
  urlencoded.append('requestedAt', `${new Date().toLocaleString()}`);
  urlencoded.append(
    'requestedFor',
    `${formData.get('date')} ${formData.get('time')}`,
  );
  urlencoded.append('seats', formData.get('seats'));
  urlencoded.append('cause', formData.get('cause'));
  urlencoded.append('note', formData.get('note'));

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  const response = await fetch('/requests', requestOptions);

  // if request was made
  if (response && response.status === 201) {
    alert('Request was sucessfully made.');
    document
      .getElementById('reservationRequest')
      .querySelectorAll('input, textarea')
      .forEach((element) => (element.value = ''));
    document
      .querySelector('button[data-target="#resReqMdl"][data-dismiss="modal"]')
      .click();
    return;
  }
  alert("Request wasn't successfully made.");
  return;
};

const reqSubBtn = document.getElementById('requestSubmit');
reqSubBtn.addEventListener('click', submitReservationRequest);

const resReqInsBtn = document.getElementById('resReqInsBtn');
resReqInsBtn.addEventListener('click', async () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `/requests?todaysDate=${new Date().toLocaleDateString()}`,
    requestOptions,
  );

  // if reservations for today's date were made
  if (response.status === 200) {
    const requests = await response.json();
    renderRequestInsightCards(requests);
    return;
  }

  document.querySelector('#insightModal .modal-body').textContent =
    'There were nought requests made today.';
  return;
});

// create and return cards comprised of the todays reservations for the insight
const renderReservationInsightCards = async (reservations) => {
  const documentFragment = new DocumentFragment(),
    modalBody = document.querySelector('#insightModal .modal-body');
  reservations.forEach((reservation) => {
    const card = document.createElement('div'),
      unorderedList = document.createElement('ul'),
      lstItmOffr = document.createElement('li'),
      lstItmReqAt = document.createElement('li'),
      lstItmReqSeats = document.createElement('li'),
      lstItmReqCause = document.createElement('li'),
      lstItmReqNote = document.createElement('li'),
      lstItmReqCnfrmAt = document.createElement('li'),
      lstItmReqCode = document.createElement('li');

    card.classList = 'card';
    unorderedList.classList = 'list-group list-group-flush';

    lstItmOffr.textContent = `Offeror: ${reservation.request.offeror.name}`;
    lstItmReqAt.textContent = `Requested at: ${new Date(
      reservation.request.requestedFor,
    ).toLocaleTimeString()}`;
    lstItmReqSeats.textContent = `Seats: ${reservation.request.seats}`;
    lstItmReqCause.textContent = `Cause: ${reservation.request.cause}`;
    lstItmReqNote.textContent = `Note: ${reservation.request.note}`;
    lstItmReqCnfrmAt.textContent = `Confirmed at: ${new Date(
      reservation.confirmedAt,
    ).toLocaleTimeString()}`;
    lstItmReqCode.textContent = `Code: ${reservation.code}`;

    unorderedList.append(lstItmOffr);
    unorderedList.append(lstItmReqAt);
    unorderedList.append(lstItmReqSeats);
    unorderedList.append(lstItmReqCause);
    unorderedList.append(lstItmReqNote);
    unorderedList.append(lstItmReqCnfrmAt);
    unorderedList.append(lstItmReqCode);
    card.append(unorderedList);
    documentFragment.append(card);
  });
  modalBody.innerHTML = '';
  modalBody.append(documentFragment);
};

const resInsBtn = document.getElementById('resInsBtn');
resInsBtn.addEventListener('click', async () => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `/reservations?todaysDate=${new Date().toLocaleDateString()}`,
    requestOptions,
  );

  // if reservations are succesfully returned
  if (response.status === 200) {
    const reservations = await response.json();
    // if nought reservations were made
    if (reservations.length === 0) {
      alert('Nought reservations were made today');
      return;
    }
    renderReservationInsightCards(reservations);
    return;
  }
  return;
});
