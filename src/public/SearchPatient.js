document.getElementById('DOMContentLoaded',async ()=>{
    document.getElementById('spinner-load').classList.add('hidden');
    

})

document.getElementById('searchButton').addEventListener('click', async function() {
    document.getElementById('spinner-load').classList.remove('hidden');
    document.getElementById('patientResults').innerHTML = ''; // Clear any previous results
   
    const patientId = document.getElementById('patientId').value.trim();
    const fileNumber = document.getElementById('fileNumber').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const selectOption = document.getElementById('selectOption').value.trim();

    let formData={
        
        patientId: patientId,
        fileNumber: fileNumber,
        firstName: firstName,
        lastName:lastName,
        selectOption:selectOption,


    }
    console.log(formData)
    // Example: Just for demonstration, it can be replaced with real data fetching logic
try{
    const phenicsId = getPhenicsIdFromUrl()



    const response= await fetch(`/admin/${phenicsId}/searchPatient`,{

        method:'POST',
        headers:{

            'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)


    })

    if(response.ok){
        document.getElementById('spinner-load').classList.add('hidden');
        const formData = await response.json()
        console.log(formData)
        const patient = formData.patients
        console.log(patient)
        displayResults(patient, formData.tableLocation);
        
    }

}catch(error){

//const patient = await response.json()
alert('failed')


}
   
});

function displayResults(results,tableLocation) {

    console.log(tableLocation)
    const resultsContainer = document.getElementById('patientResults');
    resultsContainer.innerHTML = '';

    if (results.length > 0) {
        results.forEach(patient => {
            const patientCard = document.createElement('div');
            patientCard.classList.add('patient-card');
            patientCard.innerHTML = `
                <div>
                    <h4>${patient.first_name} ${patient.last_name}</h4>
                    <p>ID: ${patient._id} | File Number: ${patient.file_number}</p>
                </div>
                <div class="patient-actions">
                    <button class="btn-view-appointments" data-id="${patient._id}">
                        <i class="fas fa-calendar-alt"></i> View Appointments
                    </button>
                    <button class="btn-view-info" data-id="${patient._id}">
                        <i class="fas fa-info-circle"></i> View Information
                    </button>
                    <button class="btn-delete" data-id="${patient._id}">
                        <i class="fas fa-trash-alt"></i> Delete Patient
                    </button>
                </div>
            `;
            resultsContainer.appendChild(patientCard);
        });

        // Add event listeners for the buttons
        console.log( document.querySelectorAll('.btn-view-appointments'))
        document.querySelectorAll('.btn-view-appointments').forEach(button => {
            button.addEventListener('click',function(event){
                   console.log('hello inside click')
                handleViewAppointments(event,tableLocation)

            });
        });

        document.querySelectorAll('.btn-view-info').forEach(button => {
            
            button.addEventListener('click',function(event){
                console.log('inside event listener: ',tableLocation)
                handleViewInfo(event,tableLocation)

            });
        });

        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function(event){


                handleDeletePatient(event,tableLocation)
            });
        });

    } else {
        resultsContainer.innerHTML = '<p>No patients found.</p>';
    }
}
async function handleViewAppointments(event,tableLocation) {
    const patientId = event.currentTarget.getAttribute('data-id');
    const phenicsId = getPhenicsIdFromUrl()
    let formData = {

        patientId: patientId,
        tableLocation: tableLocation,
    }

    try{

        const response = await fetch(`/admin/${phenicsId}/viewAppointments`,{

            method: 'POST',
            headers:{

                'Content-Type':'application/json',
            },
            body: JSON.stringify(formData)


        })
        if(response.ok){
            const appointment = await response.json()
            openModal('appointments', patientId,appointment,tableLocation);

        }else{

            const message = await response.json();
            alert(message.message)

        }


    }catch(error){


    }
   
  
}

async function handleViewInfo(event,tableLocation) {
    const patientId = event.currentTarget.getAttribute('data-id');
    const selectStatus = document.getElementById('selectOption').value
    const phenicsId = getPhenicsIdFromUrl()
    let formData={
        patientId:patientId,
     tableLocation: tableLocation,

    }
    try{

        const response = await fetch(`/admin/${phenicsId}/viewInformation`,{

            method:'POST',
            headers:{

                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData),

        })
        if(response.ok){

            const patient = await response.json()
console.log('from web ',patient)
            openModal('info', patientId,patient,tableLocation);
        }

    }catch{

        const patient = await response.json()
        alert(patient.message)


    }
   
}

async function handleDeletePatient(event,tableLocation) {

    
    const isConfirmed = confirm('Are you sure you want DELETE this patient?');

    if (!isConfirmed) {
        return;
    }

        // Implement the delete logic here
        
        try{
            const patientId = event.currentTarget.getAttribute('data-id');
            const phenicsId = getPhenicsIdFromUrl()
            let formData={

                patientId: patientId,
                tableLocation:tableLocation,
                
            }
            const response = await fetch(`/admin/${phenicsId}/deletePatient`,{

                method:'DELETE',
                headers:{

                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData)

            })
            if(response.ok){

                const message = await response.json()
                alert(message.message)
                location.reload(false)

            }
            else{

                const message = await response.json()
            alert(message.message)


            }


        }catch(error){
            alert('error deleting patient')
        }
        console.log('Deleting patient with ID:', patientId);
    }

async function openModal(type, patientId,DynamicObject,tableLocation) {
    const modal = document.getElementById('patientModal');
    const modalBody = document.querySelector('.modal-body');

    
    
    if (type === 'appointments') {

        const appointments = DynamicObject;

        modalBody.innerHTML = `
        <h3>Appointments for Patient ID: ${patientId}</h3>
        <div class="appointments-container">
            ${appointments.length > 0 ? appointments.map(appointment => `
                <div class="appointment-card" 
                     data-doctor-id="${appointment.doctor_id}" 
                     data-date="${new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}">
                    <h4>Doctor: ${appointment.doctorName}</h4>
                    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                    <p><strong>Time:</strong> ${new Date(appointment.time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })}</p>
                    <p><strong>Status:</strong> ${appointment.status}</p>
                    <p><strong>Booked By Admin:</strong> ${appointment.bookedByAdmin}</p>
                </div>
            `).join('') : '<p>No appointments found for this patient.</p>'}
        </div>
    `;

        const appointmentCards = document.querySelectorAll('.appointment-card');

        appointmentCards.forEach(card => {
            card.addEventListener('click', (event) => {
                const phenicsId =getPhenicsIdFromUrl()
                const doctorId = card.getAttribute('data-doctor-id');
                console.log('docotorid: ',doctorId)
                const selectedDate = encodeURIComponent(card.getAttribute('data-date'));
                console.log('selected date: ',selectedDate)
    
                // Construct the URL
                const url = `/medical/${phenicsId}/availability-page?doctorId=${doctorId}&selectedDate=${selectedDate}`;
                
                // Redirect to the constructed URL
                window.open(url, '_blank');
            });
        });
     
    } else if (type === 'info') {

        const dob = new Date(DynamicObject.dob);
        const year = dob.getUTCFullYear();
    const month = String(dob.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(dob.getUTCDate()).padStart(2, '0');
    
    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

        modalBody.innerHTML = `
            <h3>Information for Patient ID: ${DynamicObject._id}</h3>
            <form id="patientInfoForm">

                  <label for="patientId">Phenics ID:</label>
                <input type="text" id="patientId" value="${DynamicObject._id}" disabled>

                

                <label for="fileNumberSec">File Number:</label>
                <input type="number" id="fileNumberSec" value="${DynamicObject.file_number}" disabled>

                <label for="patientName">Name:</label>
                <input type="text" id="patientName" value="${DynamicObject.first_name}" disabled>

                          <label for="fatherName">Father Name: </label>
                <input type="text" id="fatherName" value="${DynamicObject.father_name}" disabled>

                <label for="patientLastName">Last Name:</label>
                <input type="text" id="patientLastName" value="${DynamicObject.last_name}" disabled>

          
              <label for="dob">DOB: </label>
                <input type="date" id="dob" value="${formattedDate}" disabled>

          <label for="phoneNumber">Phone Number </label>
                <input type="text" id="phoneNumber" value="${DynamicObject.phone_number}" disabled>

                   <label for="nationality">Nationality </label>
                <select  id="nationality"  disabled></select>
                <!-- Add more fields as needed -->

                <button type="button" id="editButton">Edit</button>
                <button type="button" id="saveButton" class="hidden">Save</button>
            </form>
        `;
        try{
            const countrySelect = document.getElementById('nationality');
            countrySelect.disabled=true;
      

            console.log('nation from database: ',DynamicObject.nationality)
        
       
           const phenicsId = getPhenicsIdFromUrl()
            const response = await fetch(`/admin/${phenicsId}/fetchCountries`)
            const countries = await response.json();
        
        
        
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name; // Country code
                option.textContent = country.name; // Country name
                countrySelect.appendChild(option);
       
            
                
            });
            countrySelect.value = DynamicObject.nationality
        
            
        }catch(error){
        
            alert('Error Showing Countries')
        
        }
       
        const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const formInputs = document.querySelectorAll('#patientInfoForm input');

    editButton.addEventListener('click', async function() {
        formInputs.forEach(input =>{            
            
          // Exclude the patientId input from being enabled
          if(input.id !=='patientId'){
                input.disabled = false;
            }
   
            
            

          
        });
      
        try{
            const countrySelect = document.getElementById('nationality');
            countrySelect.disabled=false;
            countrySelect.options.length = 0;
            
       
            console.log('nation from database: ',DynamicObject.nationality)
        
       
           const phenicsId = getPhenicsIdFromUrl()
            const response = await fetch(`/admin/${phenicsId}/fetchCountries`)
            const countries = await response.json();
        
        
        
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name; // Country code
                option.textContent = country.name; // Country name
                countrySelect.appendChild(option);
       
            
                
            });
            countrySelect.value = DynamicObject.nationality
        
            
        }catch(error){
        
            alert('Error Showing Countries')
        
        }
    
        
        editButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
    });


    saveButton.addEventListener('click', async function() {
        // Add logic to save the updated information


        formInputs.forEach(input => input.disabled = true);

        editButton.classList.remove('hidden');
       

    
        saveButton.classList.add('hidden');
        const phenicsId = getPhenicsIdFromUrl()
        var patientName =  document.getElementById('patientName').value
    
        var fileNumberSec = document.getElementById('fileNumberSec').value
        console.log('file Number: ',fileNumberSec)
        var firstName = document.getElementById('patientName').value
        var fatherName = document.getElementById('fatherName').value
        var lastName = document.getElementById('patientLastName').value
        var dob = document.getElementById('dob').value;
        var phoneNumber = document.getElementById('phoneNumber').value
        var nationality = document.getElementById('nationality').value

        let formData = {

            patientName:patientName,
            patientId:patientId,
            fileNumberSec:fileNumberSec,
            firstName: firstName,
            fatherName:fatherName,
            lastName :lastName,
            dob:dob,
            phoneNumber:phoneNumber,
            nationality:nationality,
            tableLocation:tableLocation,
            



        }
        console.log('filenumber from formdata: ',formData.fileNumberSec)
        try{

            const response = await fetch(`/admin/${phenicsId}/editPatient`,{

                method:'POST',
                headers:{

                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)


            })
            if(response.ok){

                const patient = await response.json()
                alert(patient.message)
                closeModal()


            }else{

                const errorMessage = await response.json()
                alert(errorMessage.message)
            }


        }catch(error){

            console.error

        }


    });
    }

    

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('patientModal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

document.querySelector('.close-modal').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
   // if (event.target.classList.contains('modal')) {
   //     closeModal();
  //  }
});
function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
}