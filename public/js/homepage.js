const insightModal = document.getElementById('insightModal');

const insMdlTgglBtn = document.getElementById('insMdlTgglBtn');

const observer = new MutationObserver(() => {
  insMdlTgglBtn.click();
});
observer.observe(insightModal.querySelector('.modal-body'), {
  childList: true,
});

const complFrmSbmBtn = document.getElementById('complFrmSbmBtn');
complFrmSbmBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  const resComplFrm = document.getElementById('resComplFrm');

  const formData = new FormData(resComplFrm);

  const urlencoded = new URLSearchParams();
  urlencoded.append('idReservations', formData.get('idReservations'));
  urlencoded.append('content', formData.get('content'));

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  const response = await fetch('/complaints', requestOptions);

  // if request succeded
  if (response.status === 201) {
    alert('Complaint was successfully submitted.');
    resComplFrm.querySelectorAll('input, textarea').forEach((element) => {
      element.value = '';
    });
    complFrmImg.click();
    // empty the complaint forms inputs and close the modal dialog
  }

  // if request was bad
  if (response.status === 400) alert('Complaint was unsuccessful.');

  return;
});

// create option elements, populate them with todays reservations data, interpolate them into the target select element
const createReservationSelectOptions = (reservations) => {
  // if no reservations
  if (reservations.length === 0) return;

  const selectElement = document.querySelector('select[name=idReservations]');
  for (let i = selectElement.length; i--; )
    selectElement.remove(selectElement[i]);

  reservations.forEach((reservation) => {
    const option = document.createElement('option');
    option.value = reservation.request.idRequests;
    option.textContent = `${reservation.request.offeror.name} | ${reservation.code} `;

    selectElement.append(option);
  });
  return;
};

const complFrmImg = document.getElementById('complFrmImg');
complFrmImg.addEventListener('click', async () => {
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

  // if request succeded
  if (response.status === 200)
    createReservationSelectOptions(await response.json());
  return;
});

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
        srchOffrBtn.addEventListener('click', (event) => {
          getOfferorsByGeolocation(event);
        });
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
  const documentFragment = new DocumentFragment();
  requests.forEach((request) => {
    const card = document.createElement('div'),
      unorderedList = document.createElement('ul'),
      lstItmOffr = document.createElement('li'),
      lstItmAddr = document.createElement('li'),
      lstItmReqAt = document.createElement('li'),
      lstItmReqFor = document.createElement('li'),
      lstItmReqSeats = document.createElement('li'),
      lstItmReqCause = document.createElement('li'),
      lstItmReqNote = document.createElement('li'),
      lstItmReqRt = document.createElement('li'),
      lstItmReqRtBtn = document.createElement('button');

    card.classList = 'card';
    unorderedList.classList = 'list-group list-group-flush';
    lstItmOffr.classList = 'list-group-item';
    lstItmAddr.classList = 'list-group-item';
    lstItmReqAt.classList = 'list-group-item';
    lstItmReqFor.classList = 'list-group-item';
    lstItmReqSeats.classList = 'list-group-item';
    lstItmReqCause.classList = 'list-group-item';
    lstItmReqNote.classList = 'list-group-item';
    lstItmReqRt.classList = 'list-group-item';
    lstItmReqRtBtn.classList = 'btn btn-warning';

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

    lstItmReqRtBtn.textContent = `Retreat`;

    lstItmReqRtBtn.dataset.idRequests = request.idRequests;

    lstItmReqRtBtn.addEventListener('click', async (event) => {
      const headers = new Headers();
      headers.append(
        'Authorization',
        `Bearer ${sessionStorage.getItem('JWT')}`,
      );

      const requestOptions = {
        method: 'DELETE',
        headers: headers,
      };

      const idRequests = event.target.dataset.idRequests;

      const response = await fetch(`/requests/${idRequests}`, requestOptions);

      // if deletion was successful
      if (response.status === 200) {
        alert('Request was successfully deleted.');

        // resign from observing modal dialogs mutatons and eradicate the card holding deleted reservation data
        observer.disconnect();
        const card = event.target.closest('.card');
        card.parentNode.removeChild(card);

        // continue with mutatuon observation
        observer.observe(insightModal.querySelector('.modal-body'), {
          childList: true,
        });
      }

      if (response.status === 409) alert('Request was already confirmed!');
      return;
    });

    unorderedList.append(lstItmOffr);
    unorderedList.append(lstItmAddr);
    unorderedList.append(lstItmReqAt);
    unorderedList.append(lstItmReqFor);
    unorderedList.append(lstItmReqSeats);
    unorderedList.append(lstItmReqCause);
    unorderedList.append(lstItmReqNote);
    lstItmReqRt.append(lstItmReqRtBtn);
    unorderedList.append(lstItmReqRt);
    card.append(unorderedList);
    documentFragment.append(card);
  });
  insightModal.querySelector('.modal-body').innerHTML = '';
  insightModal.querySelector('.modal-body').append(documentFragment);
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
    table = createOfferorTable(offerors);

  div.classList = 'table-responsive';

  div.append(table);
  documentFragment.append(div);

  insightModal.querySelector('h5').textContent = 'Found offerors';
  insightModal.querySelector('.modal-body').innerHTML = '';
  insightModal.querySelector('.modal-body').append(documentFragment);
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

  insightModal.querySelector('h5').textContent = 'Todays requests';

  // if request failed
  if (response.status !== 200) return;

  const requests = await response.json();

  // if reservations for today's date weren't made
  if (Object.keys(requests).length) {
    renderRequestInsightCards(requests);
    return;
  }

  insightModal.querySelector('.modal-body').textContent =
    'There were nought requests made today.';
  return;
});

// fetch the reservations made on today's date by the currently signed in offeree account
const getTodaysReservations = async () => {
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

  // if request succeded
  if (response.status === 200) return await response.json();

  return null;
};

// submit a countercomplaint for the subject complaint
const counterComplain = async (idReservations, counteredComplaint, content) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append('idReservations', idReservations);
  urlencoded.append('counteredComplaint', counteredComplaint);
  urlencoded.append('content', content);

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: urlencoded,
  };

  const response = await fetch('/complaints', requestOptions);

  // if request succeded
  if (response.status === 201) return true;

  return false;
};

// create and return cards comprised of the todays reservations for the insight
const renderReservationInsightCards = async (reservations) => {
  const documentFragment = new DocumentFragment(),
    headCtrDiv = document.createElement('div'),
    headCtrRowDiv = document.createElement('div');

  headCtrDiv.classList = 'container';
  headCtrRowDiv.classList = 'row';

  reservations.forEach((reservation) => {
    const reservationCard = document.createElement('div'),
      unorderedList = document.createElement('ul'),
      uLIOfferor = document.createElement('li'),
      uLIOSpan = document.createElement('span'),
      uLIONameSpan = document.createElement('span'),
      uLIRequestedAt = document.createElement('li'),
      uLIRASpan = document.createElement('span'),
      uLIRATimeSpan = document.createElement('span'),
      uLISeats = document.createElement('li'),
      uLISSpan = document.createElement('span'),
      uLISNumberSpan = document.createElement('span'),
      uLICause = document.createElement('li'),
      uLICSpan = document.createElement('span'),
      uLICArgumentSpan = document.createElement('span'),
      uLINote = document.createElement('li'),
      uLINSpan = document.createElement('span'),
      uLINArgumentSpan = document.createElement('span'),
      uLIConfirmedAt = document.createElement('li'),
      uLICASpan = document.createElement('span'),
      uLICATimeSpan = document.createElement('span'),
      uLICode = document.createElement('li'),
      uLICodeSpan = document.createElement('span'),
      uLICNumberSpan = document.createElement('span');

    reservationCard.classList = 'card';
    unorderedList.classList = 'list-group list-group-flush';
    uLIOfferor.classList = 'list-group-item position-relative p-4';
    uLIOSpan.classList = 'position-absolute top-0 start-0';
    uLIONameSpan.classList = 'position-absolute top-0 end-0';
    uLIRequestedAt.classList = 'list-group-item position-relative p-4';
    uLIRASpan.classList = 'position-absolute top-0 start-0';
    uLIRATimeSpan.classList = 'position-absolute top-0 end-0';
    uLISeats.classList = 'list-group-item position-relative p-4';
    uLISSpan.classList = 'position-absolute top-0 start-0';
    uLISNumberSpan.classList = 'position-absolute top-0 end-0';
    uLICause.classList = 'list-group-item position-relative p-4';
    uLICSpan.classList = 'position-absolute top-0 start-0';
    uLICArgumentSpan.classList = 'position-absolute top-0 end-0';
    uLINote.classList = 'list-group-item position-relative p-4';
    uLINSpan.classList = 'position-absolute top-0 start-0';
    uLINArgumentSpan.classList = 'position-absolute top-0 end-0';
    uLIConfirmedAt.classList = 'list-group-item position-relative p-4';
    uLICASpan.classList = 'position-absolute top-0 start-0';
    uLICATimeSpan.classList = 'position-absolute top-0 end-0';
    uLICode.classList = 'list-group-item position-relative p-4';
    uLICodeSpan.classList = 'position-absolute top-0 start-0';
    uLICNumberSpan.classList = 'position-absolute top-0 end-0';

    uLIOSpan.textContent = 'Offeror:';
    uLIONameSpan.textContent = `${reservation.request.offeror.name}`;
    uLIRASpan.textContent = 'Requested for:';
    uLIRATimeSpan.textContent = `${new Date(
      reservation.request.requestedFor,
    ).toLocaleTimeString()}`;
    uLISSpan.textContent = 'Seats:';
    uLISNumberSpan.textContent = `${reservation.request.seats}`;
    uLICSpan.textContent = 'Cause:';
    uLICArgumentSpan.textContent = `${reservation.request.cause}`;
    uLINSpan.textContent = 'Note';
    uLINArgumentSpan.textContent = `${reservation.request.note}`;
    uLICASpan.textContent = 'Confirmed at:';
    uLICATimeSpan.textContent = `${reservation.confirmedAt}`;
    uLICodeSpan.textContent = 'Confirmation code:';
    uLICNumberSpan.textContent = `${reservation.code}`;

    // if reservation has any complaints
    if (reservation.complaints.length) {
      reservationCard.classList.add('col-6');

      const complCtrDiv = document.createElement('div');

      complCtrDiv.classList = 'col-6 row';

      let alignFlag = true;

      reservation.complaints.forEach((complaint) => {
        const complaintDivision = document.createElement('div'),
          complHeadPara = document.createElement('p'),
          complAuthName = document.createElement('span'),
          complWrtDate = document.createElement('span'),
          complaintContent = document.createElement('p');

        complaintDivision.classList =
          'offset-3 col-9 mb-3 position-relative border rounded border-dark';
        // if right aligned
        if (!alignFlag)
          complaintDivision.classList =
            'col-9 border mb-3 position-relative rounded border-light';
        alignFlag = !alignFlag;

        complHeadPara.classList = 'position-relative p-3';
        complAuthName.classList = 'position-absolute start-0 top-0 fst-italic';
        complWrtDate.classList =
          'position-absolute top-0 end-0 text-muted small';

        complAuthName.style.color = 'hsl(210deg 11% 15%)';
        complaintContent.style.color = 'hsl(210deg 11% 15%)';
        complaintContent.style.textAlign = 'left';

        complAuthName.textContent = complaint.account.username;
        complWrtDate.innerHTML = `${new Date(
          complaint.written,
        ).toLocaleString()} <br> - ${
          complaint.updated ? complaint.updated : 'not'
        } updated`;
        complaintContent.textContent = complaint.content;

        // if its a counter complaint
        if (complaint.counteredComplaint) {
          const cntrComplDiv = document.createElement('div'),
            cntrComplRplTo = document.createElement('span'),
            cntrComplContent = document.createElement('p');

          cntrComplDiv.classList = 'small border rounded border-warning p-2';

          cntrComplDiv.style.color = 'hsl(210deg 11% 15%)';
          cntrComplDiv.style.textAlign = 'left';

          cntrComplRplTo.textContent = 'Replied to: ';
          cntrComplContent.textContent = complaint.counteredComplaint.content;

          cntrComplDiv.append(cntrComplRplTo);
          cntrComplDiv.append(cntrComplContent);
          complaintDivision.append(cntrComplDiv);
        }

        complHeadPara.append(complAuthName);
        complHeadPara.append(complWrtDate);
        complaintDivision.append(complHeadPara);
        complaintDivision.append(complaintContent);

        // if complaint is not written by currently signed in account
        if (complaint.account.username !== sessionStorage.getItem('username')) {
          const complRplSpan = document.createElement('span');

          complRplSpan.dataset.idReservations = reservation.request.idRequests;
          complRplSpan.dataset.idComplaints = complaint.idComplaints;

          complRplSpan.classList = 'position-absolute end-0 bottom-0';

          complRplSpan.style.color = 'hsl(210deg 11% 15%)';

          complRplSpan.innerHTML = '&#8630;';

          complRplSpan.addEventListener('click', (event) => {
            // if counter complaint input element wasn't already appended
            if (!complaintDivision.querySelector('input')) {
              const inputElement = document.createElement('input');

              inputElement.dataset.idReservations = event.target.dataset.idReservations
              inputElement.dataset.idComplaints =
                event.target.dataset.idComplaints;

              complaintDivision.append(inputElement);

              inputElement.focus();

              inputElement.addEventListener('focusout', (event) => {
                event.target.parentNode.removeChild(event.target);
              });

              inputElement.addEventListener('keypress', async (event) => {
                // if pressed key is ENTER
                if (event.key === 'Enter') {
                  if (
                    !(await counterComplain(
                      event.target.dataset.idReservations,
                      event.target.dataset.idComplaints,
                      event.target.value,
                    ))
                  )
                    return;

                  alert('Successfully countercomplained.');

                  const reservations = await getTodaysReservations();

                  observer.disconnect()

                  renderReservationInsightCards(reservations);

                  observer.observe(insightModal.querySelector('.modal-body'), {
                    childList: true,
                  });

                }
              });
            }
          });
          complaintDivision.append(complRplSpan);
        }
        complCtrDiv.append(complaintDivision);
        headCtrRowDiv.append(complCtrDiv);
      });
    }

    uLIOfferor.append(uLIOSpan);
    uLIOfferor.append(uLIONameSpan);
    unorderedList.append(uLIOfferor);
    uLIRequestedAt.append(uLIRASpan);
    uLIRequestedAt.append(uLIRATimeSpan);
    unorderedList.append(uLIRequestedAt);
    uLISeats.append(uLISSpan);
    uLISeats.append(uLISNumberSpan);
    unorderedList.append(uLISeats);
    uLICause.append(uLICSpan);
    uLICause.append(uLICArgumentSpan);
    unorderedList.append(uLICause);
    uLINote.append(uLINSpan);
    uLINote.append(uLINArgumentSpan);
    unorderedList.append(uLINote);
    uLIConfirmedAt.append(uLICASpan);
    uLIConfirmedAt.append(uLICATimeSpan);
    unorderedList.append(uLIConfirmedAt);
    uLICode.append(uLICodeSpan);
    uLICode.append(uLICNumberSpan);
    unorderedList.append(uLICode);
    reservationCard.append(unorderedList);
    headCtrRowDiv.prepend(reservationCard);
    documentFragment.prepend(headCtrRowDiv);
  });
  insightModal.querySelector('.modal-body').innerHTML = '';
  insightModal.querySelector('.modal-body').append(documentFragment);
};

const resInsBtn = document.getElementById('resInsBtn');
resInsBtn.addEventListener('click', async () => {
  const reservations = await getTodaysReservations();

  // if reservations weren't returned
  if (!reservations) return;

  // if reservations for todays date were made
  if (Object.keys(reservations).length) {
    renderReservationInsightCards(reservations);
    return;
  }

  insightModal.querySelector('h5').textContent = 'Todays reservations';
  insightModal.querySelector('.modal-body').textContent =
    'Nought reservations were made today.';
  return;
});
