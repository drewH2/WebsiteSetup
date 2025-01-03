document.addEventListener('DOMContentLoaded', async () => {
    hideSpinner();

    const phenicsId = getPhenicsIdFromUrl();

    try {
        const doctors = await fetchDoctors(phenicsId);
        populateDoctorSelect(doctors);
    } catch (error) {
        console.error(error);
        alert('Failed to display doctors');
    }

    setupTabButtons();
    setupFilterButton();
});

function hideSpinner() {
    document.getElementById('spinner-load').classList.add('hidden');
}

async function fetchDoctors(phenicsId) {
    const response = await fetch(`/admin/${phenicsId}/getDoctors`);
    if (response.ok) {
        return response.json();
    } else {
        const message = await response.json();
        alert(message.message);
        throw new Error('Error fetching doctors');
    }
}

function populateDoctorSelect(doctors) {
    const doctorSelect = document.getElementById('doctor');
    doctorSelect.options.length = 0;

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    doctorSelect.appendChild(allOption);

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor._id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
    });
}

function setupTabButtons() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function () {
            toggleActiveTab(this);
        });
    });
}

function toggleActiveTab(button) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const activeTab = button.getAttribute('data-tab');
    showTabContent(activeTab);
}

function showTabContent(activeTab) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const activeContent = document.getElementById(`${activeTab}Patients`);
    if (activeContent) {
        activeContent.classList.add('active');
    } else {
        console.error(`No content section found for tab: ${activeTab}`);
    }
}
function showSpinner() {
    const spinner = document.getElementById('spinner-load');
    if (spinner) {
        spinner.classList.remove('hidden');
    }
}

function setupFilterButton() {
    document.getElementById('filterButton').addEventListener('click', async function () {
        showSpinner();
        const filterData = buildFilterData();
        const phenicsId = getPhenicsIdFromUrl();

        try {
            const results = await applyFilter(phenicsId, filterData);
            displayFilteredPatients(results, filterData.activeTab);
        } catch (error) {
            console.error('Failed to apply filter', error);
        } finally {
            hideSpinner();
        }
    });
}

function buildFilterData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const doctor = document.getElementById('doctor').value;
    const fileNumber = document.getElementById('fileNumber').value;
    const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');

    return { startDate, endDate, doctor, fileNumber, activeTab };
}

async function applyFilter(phenicsId, filterData) {
    const response = await fetch(`/admin/${phenicsId}/filterPatients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData)
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Error filtering patients');
    }
}

function displayFilteredPatients(patients, activeTab) {
    const listId = activeTab === 'deleted' ? 'deletedPatientsList' : 'canceledPatientsList';
    const patientList = document.getElementById(listId);

    patientList.innerHTML = '';
    patients.sort(sortByResolvedStatus);

    if (patients.length === 0) {
        patientList.innerHTML = '<p>No patients found for the selected filters.</p>';
    } else {
        patients.forEach(patient => {
            const patientCard = createPatientCard(patient);
            patientList.appendChild(patientCard);
        });
    }
}

function sortByResolvedStatus(a, b) {
    if (a.resolve === 'Resolved' && b.resolve !== 'Resolved') return 1;
    if (a.resolve !== 'Resolved' && b.resolve === 'Resolved') return -1;
    return 0;
}

function createPatientCard(patient) {
    const patientCard = document.createElement('div');
    patientCard.classList.add('patient-card');

    const isResolved = patient.resolve === 'Resolved';
    const buttonText = isResolved ? 'Resolved' : 'Resolve';
    const disabledAttribute = isResolved ? 'disabled' : '';

    patientCard.innerHTML = `
        <p><strong>ID:</strong> ${patient._id}</p>
        <p><strong>File Number:</strong> ${patient.file_number}</p>
        <p><strong>First Name:</strong> ${patient.first_name}</p>
        <p><strong>Last Name:</strong> ${patient.last_name}</p>
        <p><strong>Date of Appointment:</strong> ${new Date(patient.appointmentDate).toLocaleDateString()}</p>
        <p><strong>Doctor:</strong> ${patient.doctorName}</p>
        <p><strong>Phone Number:</strong> ${patient.phone_number}</p>
        <p><strong>Reason:</strong> ${patient.reason}</p>
        <button class="delete-button" data-patient-id="${patient._id}" ${disabledAttribute}>
            <i class="fas fa-check"></i> ${buttonText}
        </button>
    `;

    if (isResolved) {
        addEditButton(patientCard);
    }

    setupDeleteButton(patientCard, patient);

    return patientCard;
}

function addEditButton(patientCard) {
    patientCard.classList.add('resolved');

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    patientCard.appendChild(editButton);

    editButton.addEventListener('click', () => {
        patientCard.classList.remove('resolved');
        patientCard.querySelector('.delete-button').disabled = false;
    });
}

function setupDeleteButton(patientCard, patient) {
    const deleteButton = patientCard.querySelector('.delete-button');

    deleteButton.addEventListener('click', async function () {
        const patientData = patient.appointmentId;
        const canceledId = patient.canceledId;

        await resolvePatient(patientData, patientCard, deleteButton, canceledId);
    });
}

async function resolvePatient(patientData, patientCard, resolveButton, canceledId) {
    try {
        const activeTab = document.querySelector('.tab-button.active').getAttribute('data-tab');
        const phenicsId = getPhenicsIdFromUrl();
        
        // Determine if patient is already resolved
        const isResolved = patientCard.classList.contains('resolved');
        //console.log('is resolved: ',isResolved);
        const resolveStat = resolveButton.textContent === 'Resolve';

        console.log('resolve stat: ',resolveStat);
        const newResolveStatus = resolveStat ? 'Resolved' : 'Resolve';
        
        

        const formData = {
            patientData,
            activeTab,
            canceledId,
            resolveStatus: newResolveStatus // Send the correct resolve status to the backend
        };


        const response = await fetch(`/admin/${phenicsId}/ResolvePatient`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {

            const resolve = await response.json();
            resolveButton.textContent = resolve;
            if(resolve === 'Resolve'){
                console.log('inside if')
                resolveButton.disabled = false;
                patientCard.classList.remove('resolved');

                
        removeEditButton(patientCard);

                console.log(patientCard)

            }
            else{
        console.log('inside else')
                resolveButton.disabled = true;
                patientCard.classList.add('resolved');
                addEditButton(patientCard);




            }
         
            
        } else {
            console.error('Failed to resolve patient');
        }
    } catch (error) {
        console.error('Error resolving patient:', error);
    }
}
function removeEditButton(patientCard){


    patientCard.querySelector('.edit-button').classList.add('hidden');


}

function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
}
