const accountButton = document.getElementById('accountButton');

accountButton.textContent = sessionStorage.getItem('username');

/* 
  attempt account username update 
  @Param string username
  @return boolean | JSON
*/
const updateAccountUsername = async (username) => {
  const body = new URLSearchParams();
  body.append('username', username);

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'PATCH',
    headers: headers,
    body: body,
  };

  const response = await fetch('/auth/username', requestOptions);

  // if request succeded
  if (response.status === 200) return await response.json();

  // if request faiiled
  if (response.status === 409) alert('Username already exists.');

  return false;
};

const accUsrUpdSpan = document.getElementById('usernameUpdate');
accUsrUpdSpan.addEventListener('click', async (event) => {
  event.stopPropagation();
  const parentAnchor = event.target.parentNode;

  // remove text node(Username) and undisplay span element of the anchor
  parentAnchor.removeChild(parentAnchor.firstChild);
  parentAnchor.firstChild.style.display = 'none';

  const inputElement = document.createElement('input');

  inputElement.classList = 'form-control';

  inputElement.value = sessionStorage.getItem('username');

  inputElement.addEventListener('focusout', (event) => {
    parentAnchor.removeChild(event.target);

    // interpolate the text node and reappear span element node of the anchor
    parentAnchor.firstChild.style.display = 'inline';
    parentAnchor.prepend(document.createTextNode('Username '));
  });

  inputElement.addEventListener('keypress', async (event) => {
    // if the key pressed is not ENTER
    if (event.key !== 'Enter') return;

    const { accessToken } = await updateAccountUsername(event.target.value);

    // if username wasn't successfully updated
    if (!accessToken) return;

    alert(
      `You've updated username ${sessionStorage.getItem('username')} to ${
        event.target.value
      }.`,
    );

    sessionStorage.setItem('username', event.target.value);
    sessionStorage.setItem('JWT', accessToken);

    accountButton.textContent = event.target.value;
  });

  await parentAnchor.prepend(inputElement);

  inputElement.focus();
});

const insightModal = document.getElementById('insightModal');

const insMdlTgglBtn = document.getElementById('insMdlTgglBtn');

const observer = new MutationObserver(() => {
  insMdlTgglBtn.click();
});
observer.observe(insightModal.querySelector('.modal-body'), {
  childList: true,
});

const logoutAnchor = document.getElementById('logout');
logoutAnchor.addEventListener('click', (event) => {
  event.stopPropagation();
  sessionStorage.clear();
  window.location.replace('/signin');
});

const complFrmSbmBtn = document.getElementById('complFrmSbmBtn');
complFrmSbmBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  const resComplFrm = document.getElementById('resComplFrm');

  const formData = new FormData(resComplFrm);

  const body = new URLSearchParams();
  body.append('idReservations', formData.get('idReservations'));
  body.append('content', formData.get('content'));

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };

  const response = await fetch('/complaints', requestOptions);

  // if request hasn't succeded
  if (response.status !== 201) return;

  alert('Complaint was successfully submitted.');

  // empty the complaint forms inputs and close the modal dialog
  resComplFrm.querySelectorAll('input, textarea').forEach((element) => {
    element.value = '';
  });
  complFrmImg.click();

  // if request was bad

  return;
});

/*  
  create option elements, populate them with todays reservations data, interpolate them into the target select element 
  @Param Object[] reservations
  @return null
*/
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
  const reservations = await getTodaysReservations();

  // if reservations returned
  if (reservations) createReservationSelectOptions(reservations);
  return;
});

/* 
    establish clients geolocation and expose it on the template 
    @return null
  */
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
      if (response.status !== 200) return;

      const geocoding = await response.json();

      const estGeoMun = document.getElementById('estGeoMun');

      const srchOffrBtn = document.getElementById('srchOffrBtn');

      estGeoMun.textContent = `Search offerors for ${geocoding.address.town}`;

      srchOffrBtn.disabled = false;

      srchOffrBtn.dataset.municipality = geocoding.address.town;

      srchOffrBtn.addEventListener('click', (event) => {
        getOfferorsByGeolocation(event);
      });
    },
    () => alert("Geolocation can't be established."),
    {
      enableHighAccuracy: true,
    },
  );
};
establishGeolocation();

/* 
  retreat the submitted reservation request
  @Param string idRequests
  @return null
*/
const retreatSubmittedReservationRequest = async (idRequests) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'DELETE',
    headers: headers,
  };

  const response = await fetch(`/requests/${idRequests}`, requestOptions);

  // if request was already confirmed as a reservation
  if (response.status === 409) alert('Request was already confirmed!');

  // if deletion wasn't successful
  if (response.status !== 200) alert("Request wasn't successfully deleted.");

  alert('Request was ssuccessfully deleted.');

  return;
};

/* 
  create reservation requests insight cards
  @Param Object[] requests
  @return Node[] cards
 */
const createReservationRequestInsightCards = (requests) => {
  let cards = [];

  requests.forEach((request) => {
    const card = document.createElement('div'),
      unorderedList = document.createElement('ul'),
      lstItmOfferor = document.createElement('li'),
      lstItemAddress = document.createElement('li'),
      lstItmReqAt = document.createElement('li'),
      lstItmReqFor = document.createElement('li'),
      lstItmReqSeats = document.createElement('li'),
      lstItmReqCause = document.createElement('li'),
      lstItmReqNote = document.createElement('li'),
      lstItmRetreat = document.createElement('li'),
      lstItmReBtn = document.createElement('button');

    card.classList = 'card';
    unorderedList.classList = 'list-group list-group-flush';
    lstItmOfferor.classList = 'list-group-item';
    lstItemAddress.classList = 'list-group-item';
    lstItmReqAt.classList = 'list-group-item';
    lstItmReqFor.classList = 'list-group-item';
    lstItmReqSeats.classList = 'list-group-item';
    lstItmReqCause.classList = 'list-group-item';
    lstItmReqNote.classList = 'list-group-item';
    lstItmRetreat.classList = 'list-group-item';
    lstItmReBtn.classList = 'btn btn-warning';

    lstItmOfferor.textContent = `Offeror: ${request.offeror.name}`;
    lstItemAddress.textContent = `Address: ${request.offeror.address}`;
    lstItmReqAt.textContent = `Requested at: ${new Date(
      request.requestedAt,
    ).toLocaleTimeString()}`;
    lstItmReqFor.textContent = `Requested for: ${new Date(
      request.requestedFor,
    ).toLocaleTimeString()}`;
    lstItmReqSeats.textContent = `Seats: ${request.seats}`;
    lstItmReqCause.textContent = `Cause: ${request.cause}`;
    lstItmReqNote.textContent = `Note: ${request.note}`;

    lstItmReBtn.textContent = `Retreat`;

    lstItmReBtn.dataset.idRequests = request.idRequests;

    lstItmReBtn.addEventListener('click', async (event) => {
      const idRequests = event.target.dataset.idRequests;
      await retreatSubmittedReservationRequest(idRequests);
      // resign from observing modal dialogs mutatons and eradicate the card holding deleted reservation data
      observer.disconnect();
      const card = event.target.closest('.card');
      card.parentNode.removeChild(card);

      // continue with mutatuon observation
      observer.observe(insightModal.querySelector('.modal-body'), {
        childList: true,
      });
    });

    unorderedList.append(lstItmOfferor);
    unorderedList.append(lstItemAddress);
    unorderedList.append(lstItmReqAt);
    unorderedList.append(lstItmReqFor);
    unorderedList.append(lstItmReqSeats);
    unorderedList.append(lstItmReqCause);
    unorderedList.append(lstItmReqNote);
    lstItmRetreat.append(lstItmReBtn);
    unorderedList.append(lstItmRetreat);
    card.append(unorderedList);
    cards.push(card);
  });
  return cards;
};

/* 
  render cards populated with data regarding reservation requests for todays date 
  @Param Object[] requests
*/
const renderRequestsInsightCards = (requests) => {
  const documentFragment = new DocumentFragment();

  let cards = createReservationRequestInsightCards(requests);

  cards.forEach((card) => documentFragment.append(card));

  insightModal.querySelector('.modal-body').innerHTML = '';
  insightModal.querySelector('.modal-body').append(documentFragment);
};

/* 
  create rows populated with offeror data cells and append them to the offeror table 
  @Param Object[] offerors
  @Param Node tableBody
*/
const createOfferorsTableRows = (offerors, tableBody) => {
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

    tBOReqFrmBtn.dataset.bsToggle = 'modal';
    tBOReqFrmBtn.dataset.bsTarget = '#resReqMdl';
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
    tableBody.append(tBRow);
  });
};

/* 
  create and return table element populated with offeror data 
  @Param Object[] offerors
  @return Node table
*/
const createOfferorTable = (offerors) => {
  const table = document.createElement('table'),
    tableHead = document.createElement('thead'),
    tHRow = document.createElement('tr'),
    tHCellName = document.createElement('th'),
    tHCellAddress = document.createElement('th'),
    tHdCellBusinessHours = document.createElement('th'),
    tHdCellResponsiveness = document.createElement('th'),
    tHdCellCompliance = document.createElement('th'),
    tHdCellTimeliness = document.createElement('th'),
    tableBody = document.createElement('tbody');

  table.classList = 'table table-borderless';

  tHCellName.textContent = 'Name';
  tHCellAddress.textContent = 'Address';
  tHdCellBusinessHours.textContent = 'Business hours';
  tHdCellResponsiveness.textContent = 'Responsiveness(mark)';
  tHdCellCompliance.textContent = 'Compliance(mark)';
  tHdCellTimeliness.textContent = 'Timeliness(mark)';

  tHRow.append(tHCellName);
  tHRow.append(tHCellAddress);
  tHRow.append(tHdCellBusinessHours);
  tHRow.append(tHdCellResponsiveness);
  tHRow.append(tHdCellCompliance);
  tHRow.append(tHdCellTimeliness);
  tableHead.append(tHRow);
  table.append(tableHead);

  createOfferorsTableRows(offerors, tableBody);

  table.append(tableBody);

  return table;
};

/* 
  fetch an offeror list based on the offeree geolocation and render the DocumentFragment 
  @Param Event event
*/
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

/* 
    submit the reservation request for the subject offeror 
    @Param Event event
    @return null
*/
const submitReservationRequest = async (event) => {
  event.preventDefault();

  const formData = new FormData(document.getElementById('reservationRequest'));

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const body = new URLSearchParams();
  body.append('idOfferors', formData.get('idOfferors'));
  body.append('requestedAt', `${new Date().toLocaleString()}`);
  body.append(
    'requestedFor',
    `${formData.get('date')} ${formData.get('time')}`,
  );
  body.append('seats', formData.get('seats'));
  body.append('cause', formData.get('cause'));
  body.append('note', formData.get('note'));

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };

  const response = await fetch('/requests', requestOptions);

  // if request hasn't succeded
  if (response.status !== 201) return;

  alert('Request was sucessfully made.');
  document
    .getElementById('reservationRequest')
    .querySelectorAll('input, textarea')
    .forEach((element) => (element.value = ''));
  document
    .querySelector(
      'button[data-bs-target="#resReqMdl"][data-bs-dismiss="modal"]',
    )
    .click();

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

  // if reservations for today's date were made
  if (Object.keys(requests).length) {
    renderRequestsInsightCards(requests);
    return;
  }

  insightModal.querySelector('.modal-body').textContent =
    'There were nought requests made today.';
  return;
});

/* 
  fetch the reservations made on today's date by the currently signed in offeree account 
  @return null | JSON
*/
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

/* 
  submit a countercomplaint for the subject complaint 
  @Param string idReservations
  @Param string counteredComplaint
  @Param string content
  @return boolean
*/
const counterComplain = async (idReservations, counteredComplaint, content) => {
  const body = new URLSearchParams();
  body.append('idReservations', idReservations);
  body.append('counteredComplaint', counteredComplaint);
  body.append('content', content);

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body,
  };

  const response = await fetch('/complaints', requestOptions);

  // if request succeded
  if (response.status === 201) return true;

  return false;
};

/* 
  update content of the subject complaint and determine its update timestamp 
  @Param string idComplaints
  @Param string content
  @return boolean 
  */
const reComplain = async (idComplaints, content) => {
  const body = new URLSearchParams();
  body.append('idComplaints', idComplaints);
  body.append('content', content);

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'PATCH',
    headers: headers,
    body: body,
  };

  const response = await fetch('/complaints', requestOptions);

  // if request succeded
  if (response.status === 200) return true;

  return false;
};

/* 
  prefix the complaint with the one that was replied to 
  @Param Object complaint
  @Param Node complaintDivision
*/
const prependRepliedToComplaint = (complaint, complaintDivision) => {
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
};

/* 
  append the sign for countercomplaint submission to the subject complaint  
  @Param Object reservation
  @Param Object complaint
  @Param Node complaintDivision
  @return null
*/
const appendCompliaintReplicationSign = (
  reservation,
  complaint,
  complaintDivision,
) => {
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

      inputElement.dataset.idReservations = event.target.dataset.idReservations;
      inputElement.dataset.idComplaints = event.target.dataset.idComplaints;

      complaintDivision.append(inputElement);

      inputElement.focus();

      inputElement.addEventListener('focusout', (event) => {
        event.target.parentNode.removeChild(event.target);
      });

      inputElement.addEventListener('keypress', async (event) => {
        // if pressed key is ENTER
        if (event.key !== 'Enter') return;

        // if unsuccessfully countered
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

        observer.disconnect();

        renderReservationInsightCards(reservations);

        observer.observe(insightModal.querySelector('.modal-body'), {
          childList: true,
        });
      });
    }
  });
  complaintDivision.append(complRplSpan);
};

/* 
  append the sign for the subject complaint update 
  @Param Object complaint   
  @Param Object complaintDivision   
  @return null
*/
const appendComplaintEditSign = (complaint, complaintDivision) => {
  const complUpdSpan = document.createElement('span');

  complUpdSpan.classList = 'position-absolute end-0 bottom-0';

  complUpdSpan.innerHTML = '&#9998;';

  complUpdSpan.addEventListener('click', () => {
    const inputElement = document.createElement('input');

    inputElement.classList = 'form-control';

    inputElement.dataset.idComplaints = complaint.idComplaints;

    inputElement.type = 'text';

    inputElement.addEventListener('focusout', (event) => {
      complaintDivision.removeChild(event.target);
    });

    inputElement.addEventListener('keypress', async (event) => {
      // if pressed key wasn't ENTER
      if (event.key !== 'Enter') return;

      // if unsuccessfully recomplained
      if (
        !(await reComplain(
          event.target.dataset.idComplaints,
          event.target.value,
        ))
      )
        return;
      alert("You've successfully recomplained.");

      const reservations = await getTodaysReservations();

      observer.disconnect();

      // if reservations returned
      if (reservations) renderReservationInsightCards(reservations);

      observer.observe(insightModal.querySelector('.modal-body'), {
        childList: true,
      });
    });

    complaintDivision.append(inputElement);

    inputElement.focus();
  });
  complaintDivision.append(complUpdSpan);
};

/* 
  attempt deletion of the complaint with the corresponding identifier 
  @Param string idComplaints
  @return boolean
*/
const deleteComplaint = async (idComplaints) => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${sessionStorage.getItem('JWT')}`);

  const requestOptions = {
    method: 'DELETE',
    headers: headers,
  };

  const response = await fetch(`/complaints/${idComplaints}`, requestOptions);

  // if request succeded
  if (response.status === 200) return true;

  // if there's a conflict
  if (response.statuts === 409)
    alert("There's a conflict occurring upon the complaint deletion.");

  return false;
};

/* 
  append the sign for the subject complaint removal
  @Param string idComplaints
  @Param Node complaintDivision
*/
const prependComplaintDeletionSign = (idComplaints, complaintDivision) => {
  const complDelSpan = document.createElement('span');

  complDelSpan.classList = 'position-absolute top-0 end-0';

  complDelSpan.dataset.idComplaints = idComplaints;

  complDelSpan.innerHTML = '&#9747;';

  complDelSpan.addEventListener('click', async () => {
    //if complaint unsuccessfully deleted
    if (!(await deleteComplaint(idComplaints))) return;

    alert("You've successfully deleted the complaint.");

    observer.disconnect();

    const reservations = await getTodaysReservations();

    // if reservations returned
    if (reservations) renderReservationInsightCards(reservations);

    observer.observe(insightModal.querySelector('.modal-body'), {
      childList: true,
    });
  });

  complaintDivision.prepend(complDelSpan);
};

/* 
  create complaints section for the subject reservation (card) 
  @Param Object reservation
  @Param Node headCtrRowDiv
  @Param Node reservationCard
*/
const createReservationComplaintsSection = (
  reservation,
  headCtrRowDiv,
  reservationCard,
) => {
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
    complWrtDate.classList = 'position-absolute top-0 end-0 text-muted small';

    complAuthName.style.color = 'hsl(210deg 11% 15%)';
    complaintContent.style.color = 'hsl(210deg 11% 15%)';
    complaintContent.style.textAlign = 'left';

    complAuthName.textContent = complaint.account.username;
    complWrtDate.innerHTML = `${new Date(
      complaint.written,
    ).toLocaleString()} <br> - ${
      complaint.updated ? new Date(complaint.updated).toLocaleString() : 'not'
    } updated`;
    complaintContent.textContent = complaint.content;

    // if its a counter complaint
    if (complaint.counteredComplaint)
      prependRepliedToComplaint(complaint, complaintDivision);

    complHeadPara.append(complAuthName);
    complHeadPara.append(complWrtDate);
    complaintDivision.append(complHeadPara);
    complaintDivision.append(complaintContent);

    // if complaint is not written by currently signed in account
    if (complaint.account.username !== sessionStorage.getItem('username'))
      appendCompliaintReplicationSign(
        reservation,
        complaint,
        complaintDivision,
      );

    // if complaint was written by the currently signed in account
    if (complaint.account.username === sessionStorage.getItem('username')) {
      appendComplaintEditSign(complaint, complaintDivision);
      prependComplaintDeletionSign(complaint.idComplaints, complaintDivision);
    }

    complCtrDiv.append(complaintDivision);
    headCtrRowDiv.append(complCtrDiv);
  });
};

/* 
  create reservation insight cards 
  @Param Object[] reservations
  @Param DocumentFragment documentFragment
  @Param Node headCtrRowDiv
*/
const createReservationInsightCards = (
  reservations,
  documentFragment,
  headCtrRowDiv,
) => {
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
    uLICATimeSpan.textContent = `${new Date(
      reservation.confirmedAt,
    ).toLocaleString()}`;
    uLICodeSpan.textContent = 'Confirmation code:';
    uLICNumberSpan.textContent = `${reservation.code}`;

    // if reservation has any complaints
    if (reservation.complaints.length)
      createReservationComplaintsSection(
        reservation,
        headCtrRowDiv,
        reservationCard,
      );

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

/* 
  render cards comprised of the todays reservations and their, potential, complaints for the insight 
  @Param Object[] reservations
*/
const renderReservationInsightCards = (reservations) => {
  const documentFragment = new DocumentFragment(),
    headCtrDiv = document.createElement('div'),
    headCtrRowDiv = document.createElement('div');

  headCtrDiv.classList = 'container';
  headCtrRowDiv.classList = 'row';

  createReservationInsightCards(reservations, documentFragment, headCtrRowDiv);
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
