
    document.addEventListener('DOMContentLoaded', async () => {
       

    const user = await fetchUserInfo();
    const isAdmin = user.role === 'admin';
    if(isAdmin){
    document.getElementById('admin-controls').classList.remove('hidden');
    document.getElementById('select-all').classList.remove('hidden');
    document.getElementById('add-urgent-button').classList.remove('hidden');

    // document.getElementById('delete-selected').classList.remove('hidden');

    }

    const doctorName = await fetchDoctorName();
    document.getElementById('doctorHeader').textContent = `Dr. ${doctorName} Appointments` ;
    const urlParams = new URLSearchParams(window.location.search);
    const selectedDate = urlParams.get('selectedDate');
    document.getElementById('dateDisplay').textContent = selectedDate
        
    console.log(user);




        try {


            const urlParams = new URLSearchParams(window.location.search);
            const doctorId = urlParams.get('doctorId');
            const selectedDate = urlParams.get('selectedDate');
            const phenicsId = getPhenicsIdFromUrl();


            if (!doctorId) {
                console.error('Doctor ID is missing from URL');
                return;
            }

            const response = await fetch(`/api/appointmentswithd?doctorId=${doctorId}&selectedDate=${selectedDate}`);
            const data = await response.json();
            console.log();
            data.sort((a, b) => new Date(a.time) - new Date(b.time));

            const container = document.getElementById('appointments-container');
            container.innerHTML = '';

            data.forEach( appointment => {

                const toggleContainer = document.createElement('div');
                toggleContainer.id = `toggleApp-${appointment._id}`;
                toggleContainer.className = 'toggle-container';
                toggleContainer.innerHTML = `
                    <input type="checkbox" class="toggle-switch" id="toggle-${appointment._id}" ${appointment.status === 'draft' ? '' : 'checked'}>
                    <label class="toggle-label" for="toggle-${appointment._id}"></label>
                `;



                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';
                buttonContainer.id = `id-${appointment._id}`

                console.log(appointment.bookedByAdmin)
                const appointmentElement = document.createElement('div');
                appointmentElement.classList.add('appointment');
                appointmentElement.id = appointment._id;
                const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            
                const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                
            if( !isAdmin && appointment.status =='draft'){
                    console.log('reached inside ifs status')
                    appointmentElement.classList.add('hidden');


            }
        
                if(appointment.patient_id) {
    if (appointment.patient_id == phenicsId) {
                        appointmentElement.classList.add('booked');
                        appointmentElement.innerHTML = `
                        <p>Time: ${timeFormatted}</p>
                <p>Date: ${dateFormatted}</p>
                            <p>Status: Booked By You</p>
                        
                        `;
                        const cancelButton = document.createElement('button');
                    cancelButton.className = 'book-button';
                    cancelButton.textContent = 'Cancel';
                    cancelButton.onclick = () => cancelAppointment(appointment._id);
                    buttonContainer.appendChild(cancelButton);
                


                    }   else if(isAdmin && appointment.bookedByAdmin){
                    
                        appointmentElement.classList.add('booked');
                        appointmentElement.innerHTML = `
                        <p>Time: ${timeFormatted}</p>
                <p>Date: ${dateFormatted}</p>
                            <p>Status: Booked By You</p>
                            
                        `;
                    
                    // replacePlusWithEye(appointmentElement, appointment);
                    buttonContainer.innerHTML=``
                        const cancelButton = document.createElement('button');
                        cancelButton.className = 'book-button';
                        cancelButton.textContent = 'Cancel';
                        cancelButton.onclick = () => cancelAppointment(appointment._id);
                        buttonContainer.appendChild(cancelButton);
                    console.log('by admin: ',buttonContainer)
                    // 
                    
                
                    
                    // buttonContainer.innerHTML = ''; // Clear existing buttons
                
                    // Create eye button
                
                
        
                    }
                    else {


                        appointmentElement.classList.add('booked');
                        appointmentElement.innerHTML = `
                            <p>Time: ${timeFormatted}</p>
                <p>Date: ${dateFormatted}</p>
                            <p>Status: Booked</p>
                        `;
                        if(isAdmin){

                            const cancelButton = document.createElement('button');
                            cancelButton.className = 'book-button';
                            cancelButton.textContent = 'Cancel';
                            cancelButton.onclick = () => cancelAppointment(appointment._id);
                            buttonContainer.appendChild(cancelButton);


                        }
                    }

                }
            
                else {
                    appointmentElement.innerHTML = `
                        <p>Time: ${timeFormatted}</p>
                <p>Date: ${dateFormatted}</p>
                    
                    `;
                    const bookButton = document.createElement('button');
                    if(isAdmin){



                    
                    bookButton.className = 'book-button hidden';
                }else{


                    bookButton.className = 'book-button'
                }
                    bookButton.textContent = 'Book';
                    bookButton.onclick = () => bookAppointment(appointment._id);
                    buttonContainer.appendChild(bookButton)
                
                
                    
                }


                if (isAdmin) {
                

                    appointmentElement.innerHTML += `
                
                        <div class="admin-actions">
                            <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        
                        
            
            
                            <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                            <p class="ID-pos">ID: ${appointment._id}</p>
                           
                        </div>
                    `;
                    const toggle = document.getElementById('adminToggle');
                    const label = document.getElementById('toggleLabel');
                    toggle.classList.remove('hidden')
                    label.classList.remove('hidden')
                    if (!appointment.patient_id) {
                        const toggleContainer = document.createElement('div');
                        toggleContainer.id = `toggleApp-${appointment._id}`;
                        toggleContainer.className = 'toggle-container';
                        toggleContainer.innerHTML = `
                            <input type="checkbox" class="toggle-switch" id="toggle-${appointment._id}" ${appointment.status === 'draft' ? '' : 'checked'}>
                            <label class="toggle-label" for="toggle-${appointment._id}"></label>
                        `;
                        appointmentElement.querySelector('.admin-actions').appendChild(toggleContainer);
                    }
                    //console.log(`third hello: toggleApp-${appointment._id}`)
                    //console.log('second hello: ',document.getElementById(`toggleApp-${Number(appointment._id)}`),"app: ",appointment._id)
                    //console.log('reached inside if admin for button')
                   
                   // appointmentElement.appendChild(toggleButton)
                    if(appointment.patient_id && !appointment.bookedByAdmin){

                        

                        const eyeButton = document.createElement('button');
                        eyeButton.className = 'eye-button';
                        eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                        buttonContainer.appendChild(eyeButton)
                    eyeButton.addEventListener('click',async function(){
        
                        try{
                            const adminPhenicsId =getPhenicsIdFromUrl()
        
                            const response = await fetch(`/admin/getPatient/${adminPhenicsId}`,{
        
                                    method:'POST',
                                    headers:{
        
                                        'Content-Type':'application/json'
        
                                    },
                                    body: JSON.stringify(appointment)
        
                                    
        
                            })
                            const patient = await response.json()
                            if(response.ok){
        
                                openViewAppointmentModal(patient,appointment._id);
        
        
                            }
                            else{
                                alert(patient.message)
                            }
        
        
                        }catch(error){
        
                            console.error(error)
                        }
        
                    
        
        
        
                    })


                        

                    }
                    else if(!appointment.bookedByAdmin){
                    const plusButton = document.createElement('button');
                    plusButton.className = 'add-appointment-button';
                    plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                    plusButton.innerHTML = '<i class="fas fa-plus"></i>';
                    buttonContainer.appendChild(plusButton)
                //  appointmentElement.appendChild(buttonContainer)
                }else{
                    console.log('hello: ',appointment._id)
                    console.log('hello: ',document.getElementById(`toggleApp-${appointment._id}`))
                    const eyeButton = document.createElement('button');
                    eyeButton.className = 'eye-button';
                    eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                    buttonContainer.appendChild(eyeButton)
                eyeButton.addEventListener('click',async function(){

                    try{
                        const adminPhenicsId =getPhenicsIdFromUrl()

                        const response = await fetch(`/admin/getPatient/${adminPhenicsId}`,{

                                method:'POST',
                                headers:{

                                    'Content-Type':'application/json'

                                },
                                body: JSON.stringify(appointment)

                                

                        })
                        const patient = await response.json()
                        if(response.ok){

                            openViewAppointmentModal(patient,appointment._id);


                        }
                        else{
                            alert(patient.message)
                        }


                    }catch(error){

                        console.error(error)
                    }

                



                })
                //   console.log(buttonContainer)
                }
                
                }
                if(appointment.Urgent){
    console.log('reached inside app urgent');
    appointmentElement.classList.add('urgent'); // Add urgent class

                    const urgentBadge = document.createElement('div');
                    urgentBadge.className = 'urgent-badge';
                    urgentBadge.textContent = 'Urgent';
                    appointmentElement.appendChild(urgentBadge);


                }
                if(appointment.status=='draft'){

                    console.log('reached inside if')
                
            document.getElementById('adminToggle').checked = false;
       document.getElementById('toggleLabel').textContent='Draft';

                    appointmentElement.classList.add('draft')

                    const draftIndicator = document.createElement('div');
                    draftIndicator.classList.add('draft-indicator');
                    draftIndicator.textContent = 'Draft';
                    appointmentElement.appendChild(draftIndicator);

                    
        
                }
                 
                
    
                appointmentElement.appendChild(buttonContainer)
                container.appendChild(appointmentElement);

            });



            if (isAdmin) {
                const phenicsId = getPhenicsIdFromUrl();
                const appointmentIds = Array.from(document.querySelectorAll('.appointment')).map(el => el.id);

                console.log(' appointment Ids: ',appointmentIds)
                //document.getElementById('admin-toggle-container').classList.remove('hidden');

                const toggle = document.getElementById('adminToggle');
                const label = document.getElementById('toggleLabel');


        
                toggle.addEventListener('change', async function () {
                    const newStatus = this.checked ? 'publish' : 'draft';
        
                    try {
                        // Send the new status to the server
                        const response = await fetch(`/admin/${phenicsId}/update-status`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ids: appointmentIds, status: newStatus }),
                        });
        
                        if (response.ok) {
                            label.textContent = this.checked ? 'Published' : 'Draft';
                            const statusResult = await response.json()
                            const userConfirmed = confirm(`${statusResult.message} . Press OK to Reload`);

                            if (userConfirmed) {
                    // User pressed OK
                        window.location.reload(); // Reload the page
                        } else {
    // User pressed Cancel
                        console.log("User chose not to reload the page.");
                            }
                           
                           /* label.classList.add('fade-in-out');
                            setTimeout(() => {
                                label.textContent = this.checked ? 'Published' : 'Draft';
                                label.classList.remove('fade-in-out');
                            }, 300);*/

                         
                     
                       
                          
                           
                        }else{
                            const statusResult = await response.json()
                            alert(statusResult.message)
                            
                            // Revert the toggle to its previous state
                            this.checked = !this.checked;
                            label.classList.add('fade-in-out');
                            setTimeout(() => {
                                label.textContent = this.checked ? 'Published' : 'Draft';
                                label.classList.remove('fade-in-out');
                            }, 300);
                            
                        }
   
                        // Update the label based on the toggle state
                      
                    } catch (error) {
                        // Handle errors here (e.g., show an error message or revert the toggle)
                        console.error('Error updating status:', error);
                        const statusResult = await response.json()
                            alert(statusResult.message)
        
                        // Revert the toggle to its previous state
                        this.checked = !this.checked;
                        label.classList.add('fade-in-out');
                        setTimeout(() => {
                            label.textContent = this.checked ? 'Published' : 'Draft';
                            label.classList.remove('fade-in-out');
                        }, 300);
                    }
                });
                document.querySelectorAll('.select-appointment').forEach(checkbox => {
                    checkbox.addEventListener('change', handleCheckboxChange);
                    document.getElementById('select-all').addEventListener('click', handleSelectAll);
                });
            }
        } catch (error) {
            console.error('Error fetching or displaying appointments:', error);
        }

        document.getElementById('new-patient-checkbox').addEventListener('change', function() {
            const isChecked = this.checked;
            document.getElementById('file-number-group').style.display = isChecked ? 'none' : 'flex';
            document.getElementById('file-number').value = '';
            document.getElementById('phenics-id-group').style.display = isChecked ? 'none' : 'flex';
            document.getElementById('phenics-id').value ='';
            
            
        });

        document.getElementById('add-urgent-button').addEventListener('click',async function(){
            const urlParams = new URLSearchParams(window.location.search);
            const selectedDate = urlParams.get('selectedDate');
            const doctorId = urlParams.get('doctorId');
                AddUrgent(selectedDate,doctorId);


        })

        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const phenicsId = getPhenicsIdFromUrl()
            toggle.addEventListener('change', async function () {
                const appointmentId = this.id.split('-')[1];
                const newStatus = this.checked ? 'publish' : 'draft';
                
                try {
                    const response = await fetch(`/admin/${phenicsId}/api/updateAppointmentStatus`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: appointmentId, status: newStatus })
                    });
        
                    if (response.ok) {
                        const appointment = await response.json()
                        alert(appointment.message)
                        location.reload(false)
                        console.log(`Appointment ${appointmentId} is now ${newStatus}`);
                    } else {
                        const appointment = await response.json()
                        alert(appointment.message);
                        this.checked = !this.checked; // Revert toggle if update failed
                    }
                } catch (error) {
                    const appointment = await response.json()
                    alert(appointment.message)
                    console.error('Error updating status:', error);
                    this.checked = !this.checked; // Revert toggle if an error occurred
                }
            });
        });

       
    });

    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        const phenicsId = getPhenicsIdFromUrl()
        toggle.addEventListener('change', async function () {
            const appointmentId = this.id.split('-')[1];
            const newStatus = this.checked ? 'publish' : 'draft';
            
            try {
                const response = await fetch(`/admin/${phenicsId}/api/updateAppointmentStatus`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: appointmentId, status: newStatus })
                });
    
                if (response.ok) {
                    const appointment = await response.json()
                    alert(appointment.message)
                    location.reload(false)
                    console.log(`Appointment ${appointmentId} is now ${newStatus}`);
                } else {
                    const appointment = await response.json()
                    alert(appointment.message);
                    this.checked = !this.checked; // Revert toggle if update failed
                }
            } catch (error) {
                const appointment = await response.json()
                alert(appointment.message)
                console.error('Error updating status:', error);
                this.checked = !this.checked; // Revert toggle if an error occurred
            }
        });
    });



async function AddUrgent(selectedDate,doctorId){

    document.getElementById('patient-name').value='';
    document.getElementById('last-name').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('file-number').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('phenics-id').value='';
    
  


    const modal = document.getElementById('add-appointment-modal');
    console.log(modal);
    const modalContent = modal.querySelector('.modal-content');
 
    const form = document.getElementById('add-appointment-form');

    const inputs = document.querySelectorAll('#add-appointment-form input');
    inputs.forEach(input => input.disabled = false);
    const checkboxinput = document.getElementById('new-patient-checkbox');
checkboxinput.disabled=false;
const searchButton = document.getElementById('search-button')
searchButton.disabled=false;
try{
    const countrySelect = document.getElementById('countrySelect');
    countrySelect.disabled=false;
countrySelect.options.length=0;
    const phenicsId = getPhenicsIdFromUrl()
    const response = await fetch(`/admin/${phenicsId}/fetchCountries`)
    const countries = await response.json();



    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name; // Country code
        option.textContent = country.name; // Country name
        countrySelect.appendChild(option);
        countrySelect.value = ''
        
    });

    
}catch(error){

    alert('Error Showing Countries')

}

    // Hide the Book button and show the Edit button
    document.getElementById('book-appointment-button').style.display = 'block';
    document.getElementById('edit-appointment-button').style.display = 'none';
    
    // Show the modal
   // modal.classList.remove('hiddenModal');
    modal.style.display = 'flex';

    // Store the appointmentId in the form's dataset for later use
   // form.dataset.appointmentId = appointmentId;

    // Add an event listener to the close button to hide the modal
    modalContent.classList.remove('fade-out');
  //  modalContent.classList.add('fade-in');
  
    // Remove the fade-in class after animation ends
    modalContent.addEventListener('animationend', () => {
      modalContent.classList.remove('fade-in');
    }, { once: true });
    document.querySelector('.close-button').addEventListener('click', () => {

        //modal.classList.add('hiddenModal');
        modal.style.display = 'none';
    });
    
    const newSearchButton = searchButton.cloneNode(true);
    searchButton.parentNode.replaceChild(newSearchButton, searchButton);

    newSearchButton.addEventListener('click',async function(){

        
        var phenicsId = document.getElementById('phenics-id').value
        var Achecked = document.getElementById('alreadyAcc').checked;
        const formData={
            phenicsId: phenicsId,
            Achecked: Achecked,
        }

            try{

                const response = await fetch('/admin/api/searchPatient',{

                    method:'POST',
                    headers:{

                        'Content-Type':'application/json'
                    },

                    body: JSON.stringify(formData)




                })
              
;
                if(response.ok){

                    const patient = await response.json()
                   // console.log(patient);
                   const dob = new Date(patient.dob);
                   const year = dob.getUTCFullYear();
const month = String(dob.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const day = String(dob.getUTCDate()).padStart(2, '0');

// Format the date as YYYY-MM-DD
const formattedDate = `${year}-${month}-${day}`;

                   console.log(formattedDate);
                   document.getElementById('patient-name').value=patient.first_name;
                   document.getElementById('last-name').value = patient.last_name;
                   document.getElementById('dob').value = formattedDate;
                   document.getElementById('file-number').value = patient.file_number;
                   document.getElementById('phone-number').value = patient.phone_number;
                   document.getElementById('countrySelect').value = patient.nationality;


                }else{
                    const patient = await response.json()
                    document.getElementById('patient-name').value='';
                    document.getElementById('last-name').value = '';
                    document.getElementById('dob').value = '';
                    document.getElementById('file-number').value = '';
                    document.getElementById('phone-number').value = '';
                    document.getElementById('countrySelect').value = '';

                    alert(patient.message)

                }




            }catch(error){

               
                console.error(error)

            }
      




    })
    const bookButton = document.getElementById('book-appointment-button');
    const newButton = bookButton.cloneNode(true);
    bookButton.parentNode.replaceChild(newButton, bookButton);
   newButton.addEventListener('click',async function(){

console.log('clicked');
      
    
        const firstName =document.getElementById('patient-name').value
        const lastName = document.getElementById('last-name').value
        const dob = document.getElementById('dob').value
        const fileNumber = document.getElementById('file-number').value
        const phenicsId = document.getElementById('phenics-id').value
        const phoneNumber = document.getElementById('phone-number').value
        const urgentTime = document.getElementById('urgent-time').value;
        const countrySelect = document.getElementById('countrySelect').value

        
    
        let formData = {
    
    
            firstName: firstName,
            lastName:lastName,
            dob:dob,
            fileNumber:fileNumber,
            phenicsId:phenicsId,
            phoneNumber:phoneNumber,
       urgentTime: urgentTime,
       selectedDate: selectedDate,
            newPatient: false,
            doctorId: doctorId,
            nationality: countrySelect,
    
        }
        if(document.getElementById('new-patient-checkbox').checked){

            console.log('reached inside if checked')
             formData = {
    
    
                firstName: firstName,
                lastName:lastName,
                dob:dob,
                fileNumber:fileNumber,
                phenicsId:phenicsId,
                phoneNumber:phoneNumber,
                urgentTime: urgentTime,
                selectedDate: selectedDate,
                newPatient: true,
                doctorId: doctorId,
                nationality: countrySelect,
        
            }
    
            if(!firstName || !lastName || !dob || !phoneNumber || !urgentTime || !countrySelect){
    
                alert('Please fill the required fields')
            }
    
    
        }
       if(!document.getElementById('new-patient-checkbox').checked && (!firstName || !lastName || !dob || !phoneNumber || !phenicsId || !fileNumber || !urgentTime || !countrySelect)){
           
    
                alert('Please fill the required fields');
            }
    
    else{    
        console.log(formData);
     adminPhenicsId = getPhenicsIdFromUrl();
    
        try{
    
        
    
        const response = await fetch(`/admin/api/booking-urgent-appointment`,{
    
            method:'POST',
            
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
    
        
    
    
        })
        const appointment = await response.json()
        if(response.ok){
        alert(appointment.message)


        
          location.reload(false);
        } 
        else{
            alert(appointment.message)
        }
       
    
        
    }catch(error){
        alert('failed to book appointment')
        console.error(error);
    
    }
    
    }
    
    
    
    
    })


       // Add extra input fields for "Add Urgent"
       let urgentFields = document.getElementById("urgent-fields");
       if(urgentFields){
       urgentFields.classList.remove('hidden');
    }
       if (!urgentFields) {
         urgentFields = document.createElement("div");
         urgentFields.id = "urgent-fields";
   
         const timeLabel = document.createElement("label");
         timeLabel.setAttribute("for", "urgent-time");
         timeLabel.textContent = "Urgent Time:";
   
         const timeInput = document.createElement("input");
         timeInput.setAttribute("type", "time");
         timeInput.setAttribute("id", "urgent-time");
   
         urgentFields.appendChild(timeLabel);
         urgentFields.appendChild(timeInput);
         const modalHeader = document.querySelector(".modal-header");

         // Insert urgent fields after the modal header 
         modalHeader.insertAdjacentElement("afterend", urgentFields);




      
       }
    

}


function closeModal() {
    const modal = document.getElementById('add-appointment-modal');
    const modalContent = modal.querySelector('.modal-content');
  
    modalContent.classList.remove('fade-in');
    modalContent.classList.add('fade-out');
  
    // Hide the modal after the fade-out animation
    modalContent.addEventListener('animationend', () => {
      modal.style.display = 'none';
      modalContent.classList.remove('fade-out');
    }, { once: true });
  }

async function openAddAppointmentModal(appointmentId){
    const header = document.getElementById('edit-header');
    console.log('header: ',header)
    header.textContent='Add Appointment'

    let urgentFields = document.getElementById("urgent-fields");
    if(urgentFields){
console.log('reached inside urgent fields')
        urgentFields.className='hidden';
        console.log(urgentFields);
    }

    document.getElementById('patient-name').value='';
    document.getElementById('last-name').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('file-number').value = '';
    document.getElementById('phone-number').value = '';
    document.getElementById('phenics-id').value='';
  


    const modal = document.getElementById('add-appointment-modal');
    console.log(modal);
    const modalContent = modal.querySelector('.modal-content');
 
    const form = document.getElementById('add-appointment-form');

    const inputs = document.querySelectorAll('#add-appointment-form input');
    inputs.forEach(input => input.disabled = false);
    const checkboxinput = document.getElementById('new-patient-checkbox');
checkboxinput.disabled=false;
const searchButton = document.getElementById('search-button')
searchButton.disabled=false;


    // Hide the Book button and show the Edit button
    document.getElementById('book-appointment-button').style.display = 'block';
    document.getElementById('edit-appointment-button').style.display = 'none';
    
    // Show the modal
   // modal.classList.remove('hiddenModal');
    modal.style.display = 'flex';

    // Store the appointmentId in the form's dataset for later use
    form.dataset.appointmentId = appointmentId;

    // Add an event listener to the close button to hide the modal
    modalContent.classList.remove('fade-out');
  //  modalContent.classList.add('fade-in');
  
    // Remove the fade-in class after animation ends
    modalContent.addEventListener('animationend', () => {
      modalContent.classList.remove('fade-in');
    }, { once: true });
    document.querySelector('.close-button').addEventListener('click', () => {

        //modal.classList.add('hiddenModal');
        modal.style.display = 'none';
    });


    try{
        const countrySelect = document.getElementById('countrySelect');
        countrySelect.disabled=false;
countrySelect.options.length=0;
        const phenicsId = getPhenicsIdFromUrl()
        const response = await fetch(`/admin/${phenicsId}/fetchCountries`)
        const countries = await response.json();


  
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name; // Country code
            option.textContent = country.name; // Country name
            countrySelect.appendChild(option);
            countrySelect.value = ''
            
        });
  
        
    }catch(error){

        alert('Error Showing Countries')

    }
  

    

    
    const newSearchButton = searchButton.cloneNode(true);
    searchButton.parentNode.replaceChild(newSearchButton, searchButton);

    newSearchButton.addEventListener('click',async function(){

        
        var phenicsId = document.getElementById('phenics-id').value
        var Achecked = document.getElementById('alreadyAcc').checked;
        const formData={
            phenicsId: phenicsId,
            Achecked: Achecked,
        }

            try{

                const response = await fetch('/admin/api/searchPatient',{

                    method:'POST',
                    headers:{

                        'Content-Type':'application/json'
                    },

                    body: JSON.stringify(formData)




                })
              
;
                if(response.ok){

                    const patient = await response.json()
                   // console.log(patient);
                   const dob = new Date(patient.dob);
                   const year = dob.getUTCFullYear();
const month = String(dob.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const day = String(dob.getUTCDate()).padStart(2, '0');

// Format the date as YYYY-MM-DD
const formattedDate = `${year}-${month}-${day}`;

                   console.log(formattedDate);
                   document.getElementById('patient-name').value=patient.first_name;
                   document.getElementById('last-name').value = patient.last_name;
                   document.getElementById('dob').value = formattedDate;
                   document.getElementById('file-number').value = patient.file_number;
                   document.getElementById('phone-number').value = patient.phone_number;
                    document.getElementById('countrySelect').value = patient.nationality
                   




                }else{
                    const patient = await response.json()
                    document.getElementById('patient-name').value='';
                    document.getElementById('last-name').value = '';
                    document.getElementById('dob').value = '';
                    document.getElementById('file-number').value = '';
                    document.getElementById('phone-number').value = '';
                    document.getElementById('countrySelect').value = '';
                    alert(patient.message)

                }




            }catch(error){

               
                console.error(error)

            }
      




    })
    const bookButton = document.getElementById('book-appointment-button');
    const newButton = bookButton.cloneNode(true);
    bookButton.parentNode.replaceChild(newButton, bookButton);
   newButton.addEventListener('click',async function(){

console.log('clicked');
        const user = await fetchUserInfo();
      const isAdmin = user.role === 'admin';
    
        const firstName =document.getElementById('patient-name').value
        const lastName = document.getElementById('last-name').value
        const dob = document.getElementById('dob').value
        const fileNumber = document.getElementById('file-number').value
        const phenicsId = document.getElementById('phenics-id').value
        const phoneNumber = document.getElementById('phone-number').value
        const nationality =document.getElementById('countrySelect').value
    
        let formData = {
    
    
            firstName: firstName,
            lastName:lastName,
            dob:dob,
            fileNumber:fileNumber,
            phenicsId:phenicsId,
            phoneNumber:phoneNumber,
            appointmentId:appointmentId,
            newPatient: false,
            nationality:nationality,
    
        }
        if(document.getElementById('new-patient-checkbox').checked){

            console.log('reached inside if checked')
             formData = {
    
    
                firstName: firstName,
                lastName:lastName,
                dob:dob,
                fileNumber:fileNumber,
                phenicsId:phenicsId,
                phoneNumber:phoneNumber,
                appointmentId:appointmentId,
                newPatient: true,
                nationality:nationality,
        
            }
    
            if(!firstName || !lastName || !dob || !phoneNumber || !nationality){
    
                alert('Please fill the required fields')
            }
    
    
        }
       if(!document.getElementById('new-patient-checkbox').checked && (!firstName || !lastName || !dob || !phoneNumber || !phenicsId || !fileNumber || !nationality)){
           
    
                alert('Please fill the required fields');
            }
    
    else{    
        console.log(formData);
     adminPhenicsId = getPhenicsIdFromUrl();
    
        try{
    
        
    
        const response = await fetch(`/admin/${adminPhenicsId}/api/booking-appointment`,{
    
            method:'POST',
            
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
    
        
    
    
        })
        const appointment = await response.json()
        if(response.ok){

            console.log('reached response.ok');
          
            const appointmentElement = document.getElementById(appointmentId);
            const buttonContainer = document.getElementById(`id-${appointmentId}`)
            buttonContainer.replaceChildren();
             buttonContainer.className = 'button-container';
            buttonContainer.id = `id-${appointment._id}`
            const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
        
              const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

    
            if (appointmentElement) {
                appointmentElement.classList.add('booked');
                appointmentElement.innerHTML = `
                     <p>Time: ${timeFormatted}</p>
            <p>Date: ${dateFormatted}</p>
                    <p>Status: Booked By You</p>
                   
                `;
                const cancelButton = document.createElement('button');
                cancelButton.className = 'book-button';
                cancelButton.textContent = 'Cancel';
                cancelButton.onclick = () => cancelAppointment(appointment._id);
                buttonContainer.appendChild(cancelButton);
                alert('Appointment booked successfully!');
            }
            else {
                alert('Failed to book the appointment. Please try again.');
            }
            if (isAdmin) {
                appointmentElement.innerHTML += `
                    <div class="admin-actions">
                        <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        
                        <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                          <p class="ID-pos">ID: ${appointment._id}</p>
                    </div>
                `;
                if(!appointment.bookedByAdmin){
                    const plusButton = document.createElement('button');
                    plusButton.className = 'add-appointment-button';
                    plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                    plusButton.innerHTML = '<i class="fas fa-plus"></i>';
                    buttonContainer.appendChild(plusButton)
                  //  appointmentElement.appendChild(buttonContainer)
                }else{
                    const eyeButton = document.createElement('button');
                    eyeButton.className = 'eye-button';
                    eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                    buttonContainer.appendChild(eyeButton)
                   eyeButton.addEventListener('click',async function(){
    
                    try{
                        const adminPhenicsId =getPhenicsIdFromUrl()
    
                        const response = await fetch(`/admin/getPatient/${adminPhenicsId}`,{
    
                                method:'POST',
                                headers:{
    
                                    'Content-Type':'application/json'
    
                                },
                                body: JSON.stringify(appointment)
    
                                
    
                        })
                        const patient = await response.json()
                        if(response.ok){
    
                            openViewAppointmentModal(patient,appointmentId);
    
    
                        }
                        else{
                            alert(patient.message)
                        }
    
    
                    }catch(error){
    
                        console.error(error)
                    }
    
                   
    
    
    
                   })
                 //   console.log(buttonContainer)
                }
            }
            appointmentElement.appendChild(buttonContainer)
            closeModal();
          
        } 
        else{
            alert(appointment.message)
        }
        if (isAdmin) {
            document.querySelectorAll('.select-appointment').forEach(checkbox => {
                checkbox.addEventListener('change', handleCheckboxChange);
                document.getElementById('select-all').addEventListener('click', handleSelectAll);
            });
        }
    
    
        
    }catch(error){
        alert('failed to book appointment')
        console.error(error);
    
    }
    
    }
    
    
    
    
    })

}

async function fetchUserInfo() {
    const phenicsId = getPhenicsIdFromUrl();
    try {
        const response = await fetch(`/api/${phenicsId}/userinfo`, {
            
        });
      
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


function openViewAppointmentModal(appointmentData,appointmentId) {
    // Populate the modal with patient data

    const modal = document.getElementById('add-appointment-modal');
    console.log(modal);
    const modalContent = modal.querySelector('.modal-content');
    const form = document.getElementById('add-appointment-form');
    
    // Show the modal
   // modal.classList.remove('hiddenModal');
    modal.style.display = 'flex';

    // Store the appointmentId in the form's dataset for later use
    form.dataset.appointmentId = appointmentData._id

    // Add an event listener to the close button to hide the modal
    modalContent.classList.remove('fade-out');
  //  modalContent.classList.add('fade-in');
  
    // Remove the fade-in class after animation ends
    modalContent.addEventListener('animationend', () => {
      modalContent.classList.remove('fade-in');
    }, { once: true });
    document.querySelector('.close-button').addEventListener('click', () => {

        //modal.classList.add('hiddenModal');
        modal.style.display = 'none';
    });

    const header = document.getElementById('edit-header');
    console.log('header: ',header)
    header.textContent='Edit Appointment'
    document.getElementById('patient-name').value = appointmentData.first_name;
    document.getElementById('last-name').value = appointmentData.last_name;
    const dob = new Date(appointmentData.dob);
    const year = dob.getUTCFullYear();
const month = String(dob.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const day = String(dob.getUTCDate()).padStart(2, '0');

// Format the date as YYYY-MM-DD
const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('dob').value = formattedDate;
    document.getElementById('file-number').value = appointmentData.file_number;
    document.getElementById('phenics-id').value = appointmentData._id;
    document.getElementById('phone-number').value = appointmentData.phone_number;
   countrySelect =  document.getElementById('countrySelect')
   countrySelect.options.length = 0
   const option = document.createElement('option');
    option.value = appointmentData.nationality; // Country code
    option.textContent = appointmentData.nationality; // Country name
    countrySelect.appendChild(option);
    console.log('nationality: ',appointmentData.nationality)

    // Disable all inputs
    const inputs = document.querySelectorAll('#add-appointment-form input');
    inputs.forEach(input => input.disabled = true);
    const nationality = document.getElementById('countrySelect').disabled=true
const checkboxinput = document.getElementById('new-patient-checkbox');
if(!appointmentData.newPatient){



    document.getElementById('file-number-group').style.display = 'flex'
 
    document.getElementById('phenics-id-group').style.display ='flex';
    checkboxinput.checked=false;

}else{

    document.getElementById('file-number-group').style.display = 'none'
 
    document.getElementById('phenics-id-group').style.display ='none';
    checkboxinput.checked=true;
}

checkboxinput.disabled=true;
    // Hide the Book button and show the Edit button
    document.getElementById('book-appointment-button').style.display = 'none';
    document.getElementById('edit-appointment-button').style.display = 'block';
    const searchButton = document.getElementById('search-button')
    searchButton.disabled=true;

    document.getElementById('edit-appointment-button').addEventListener('click',async function(){
console.log('reached inside ')






        const inputs = document.querySelectorAll('#add-appointment-form input');
        inputs.forEach(input => input.disabled = false);
        const nationality = document.getElementById('countrySelect').disabled=false
        const tempVari = nationality.value
        console.log('temp vari: ',tempVari)
        try{
            const countrySelect = document.getElementById('countrySelect');
            countrySelect.disabled=false;
       
            const phenicsId = getPhenicsIdFromUrl()
            const response = await fetch(`/admin/${phenicsId}/fetchCountries`)
            const countries = await response.json();
        
        
        
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name; // Country code
                option.textContent = country.name; // Country name
                countrySelect.appendChild(option);
       
            
                
            });
        
            
        }catch(error){
        
            alert('Error Showing Countries')
        
        }
    const checkboxinput = document.getElementById('new-patient-checkbox');
    checkboxinput.disabled=false;
        // Hide the Book button and show the Edit button
        document.getElementById('book-appointment-button').style.display = 'block';
        document.getElementById('edit-appointment-button').style.display = 'block';
        const searchButton = document.getElementById('search-button')
        searchButton.disabled=false;

        
        console.log('search button: ',searchButton)


       
        const newSearchButton = searchButton.cloneNode(true);
       searchButton.parentNode.replaceChild(newSearchButton, searchButton);


        newSearchButton.addEventListener('click',async function(){
    
            console.log('reached inside search button')
            
            var phenicsId = document.getElementById('phenics-id').value
            var Achecked = document.getElementById('alreadyAcc').checked;
            const formData={
                phenicsId: phenicsId,
                Achecked: Achecked,
            }
    
                try{
    
                    const response = await fetch('/admin/api/searchPatient',{
    
                        method:'POST',
                        headers:{
    
                            'Content-Type':'application/json'
                        },
    
                        body: JSON.stringify(formData)
    
    
    
    
                    })
                    
    ;
                    if(response.ok){
                        const patient = await response.json()
                       
                       // console.log(patient);
                       const dob = new Date(patient.dob);
                       const year = dob.getUTCFullYear();
    const month = String(dob.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(dob.getUTCDate()).padStart(2, '0');
    
    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;
    
                       console.log(formattedDate);
                       document.getElementById('patient-name').value=patient.first_name;
                       document.getElementById('last-name').value = patient.last_name;
                       document.getElementById('dob').value = formattedDate;
                       document.getElementById('file-number').value = patient.file_number;
                       document.getElementById('phone-number').value = patient.phone_number;
                       document.getElementById('countrySelect').value = patient.nationality;
                       console.log('nationality: ',patient.nationality)
    
    
                    }else{
                        const patient = await response.json()
                        document.getElementById('patient-name').value='';
                        document.getElementById('last-name').value = '';
                        document.getElementById('dob').value = '';
                        document.getElementById('file-number').value = '';
                        document.getElementById('phone-number').value = '';
                        document.getElementById('countrySelect').value = '';

                        alert(patient.message)
    
                    }
    
    
    
    
                }catch(error){
    
                   
                    console.error(error)
    
                }
          
    
    
    
    
        })








        const bookButton = document.getElementById('book-appointment-button');
        const newButton = bookButton.cloneNode(true);
        bookButton.parentNode.replaceChild(newButton, bookButton);
       newButton.addEventListener('click',async function(){
    
    console.log('clicked');
            const user = await fetchUserInfo();
          const isAdmin = user.role === 'admin';
        
            const firstName =document.getElementById('patient-name').value
            const lastName = document.getElementById('last-name').value
            const dob = document.getElementById('dob').value
            const fileNumber = document.getElementById('file-number').value
            const phenicsId = document.getElementById('phenics-id').value
            const phoneNumber = document.getElementById('phone-number').value
            const nationality = document.getElementById('countrySelect').value
        
            let formData = {
        
        
                firstName: firstName,
                lastName:lastName,
                dob:dob,
                fileNumber:fileNumber,
                phenicsId:phenicsId,
                phoneNumber:phoneNumber,
                appointmentId:appointmentId,
                newPatient: false,
                nationality:nationality,

        
            }
            if(document.getElementById('new-patient-checkbox').checked){
    
                console.log('reached inside if checked')
                 formData = {
        
        
                    firstName: firstName,
                    lastName:lastName,
                    dob:dob,
                    fileNumber:fileNumber,
                    phenicsId:phenicsId,
                    phoneNumber:phoneNumber,
                    appointmentId:appointmentId,
                    newPatient: true,
                    nationality:nationality,
            
                }
        
                if(!firstName || !lastName || !dob || !phoneNumber){
        
                    alert('Please fill the required fields')
                }
        
        
            }
           if(!document.getElementById('new-patient-checkbox').checked && (!firstName || !lastName || !dob || !phoneNumber || !phenicsId || !fileNumber)){
               
        
                    alert('Please fill the required fields');
                }
        
        else{    
            console.log(formData);
         adminPhenicsId = getPhenicsIdFromUrl();
        
            try{
        
            
        
            const response = await fetch(`/admin/${adminPhenicsId}/api/booking-appointment`,{
        
                method:'POST',
                
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(formData)
        
            
        
        
            })
            const appointment = await response.json()
            if(response.ok){
    
                console.log('reached response.ok');
              
                const appointmentElement = document.getElementById(appointmentId);
                const buttonContainer = document.getElementById(`id-${appointmentId}`)
                buttonContainer.replaceChildren();
                 buttonContainer.className = 'button-container';
                buttonContainer.id = `id-${appointment._id}`
                const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });
            
              const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});
        
                if (appointmentElement) {
                    appointmentElement.classList.add('booked');
                    appointmentElement.innerHTML = `
                         <p>Time: ${timeFormatted}</p>
                <p>Date: ${dateFormatted}</p>
                        <p>Status: Booked By You</p>
                       
                    `;
                    const cancelButton = document.createElement('button');
                    cancelButton.className = 'book-button';
                    cancelButton.textContent = 'Cancel';
                    cancelButton.onclick = () => cancelAppointment(appointment._id);
                    buttonContainer.appendChild(cancelButton);
                    alert('Appointment booked successfully!');
                }
                else {
                    alert('Failed to book the appointment. Please try again.');
                }
                if (isAdmin) {
                    appointmentElement.innerHTML += `
                        <div class="admin-actions">
                            <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                            
                            <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                              <p class="ID-pos">ID: ${appointment._id}</p>
     
                        </div>
                    `;
                    if(!appointment.bookedByAdmin){
                        const plusButton = document.createElement('button');
                        plusButton.className = 'add-appointment-button';
                        plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                        plusButton.innerHTML = '<i class="fas fa-plus"></i>';
                        buttonContainer.appendChild(plusButton)
                      //  appointmentElement.appendChild(buttonContainer)
                    }else{
                        const eyeButton = document.createElement('button');
                        eyeButton.className = 'eye-button';
                        eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                        buttonContainer.appendChild(eyeButton)
                       eyeButton.addEventListener('click',async function(){
        
                        try{
                            const adminPhenicsId =getPhenicsIdFromUrl()
        
                            const response = await fetch(`/admin/getPatient/${adminPhenicsId}`,{
        
                                    method:'POST',
                                    headers:{
        
                                        'Content-Type':'application/json'
        
                                    },
                                    body: JSON.stringify(appointment)
        
                                    
        
                            })
                            const patient = await response.json()
                            if(response.ok){
        
                                openViewAppointmentModal(patient,appointmentId);
        
        
                            }
                            else{
                                alert(patient.message)
                            }
        
        
                        }catch(error){
        
                            console.error(error)
                        }
        
                       
        
        
        
                       })
                     //   console.log(buttonContainer)
                    }
                }
                appointmentElement.appendChild(buttonContainer)
                closeModal();
              
            } 
            else{
                alert(appointment.message)
            }
            if (isAdmin) {
                document.querySelectorAll('.select-appointment').forEach(checkbox => {
                    checkbox.addEventListener('change', handleCheckboxChange);
                    document.getElementById('select-all').addEventListener('click', handleSelectAll);
                });
            }
        
        
            
        }catch(error){
            alert('failed to book appointment')
            console.error(error);
        
        }
        
        }
        
        
        
        
        })
    








    })

    // Display the modal
   
}

async function bookAppointment(appointmentId) {
    const user = await fetchUserInfo();
    const isAdmin = user.role === 'admin';
    console.log('from book app: ',isAdmin)
    try {
        const phenicsId = getPhenicsIdFromUrl();
        const response = await fetch(`/api/book-appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentId, patientId: phenicsId }),
        });

        if (response.ok) {
       

            const appointment = await response.json();
            const appointmentElement = document.getElementById(appointmentId);
           
          const buttonContainer = document.getElementById(`id-${appointmentId}`)
           // buttonContainer.innerHTML=''
           buttonContainer.replaceChildren();
           console.log('up: ',buttonContainer.parentNode)
            /*const buttonContainer = document.createElement('div')
            buttonContainer.className='button-container'
            buttonContainer.id = `id-${appointmentId}`*/

            
                     

            const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
        
              const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });


            if (appointmentElement) {

                appointmentElement.classList.add('booked');
                appointmentElement.innerHTML = `
                     <p>Time: ${timeFormatted}</p>
            <p>Date: ${dateFormatted}</p>
                    <p>Status: Booked By You</p>
                   
                `;
                const cancelButton = document.createElement('button');
                cancelButton.className = 'book-button';
                cancelButton.textContent = 'Cancel';
                cancelButton.onclick = () => cancelAppointment(appointment._id);
                buttonContainer.appendChild(cancelButton);
                console.log(buttonContainer)
                alert('Appointment booked successfully!');
            }
            if (isAdmin) {
                appointmentElement.innerHTML += `
                    <div class="admin-actions">
                        <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                       
                        <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                          <p class="ID-pos">ID: ${appointment._id}</p>
                                                <div class="toggle-container">
                           
    <input type="checkbox" class="toggle-switch" id="toggle-${appointment._id}" ${appointment.status === 'draft' ? '' : 'checked'}>
        <label class="toggle-label" for="toggle-${appointment._id}"></label>
 
</div>
                    </div>
                `;
                const plusButton = document.createElement('button');
                plusButton.className = 'add-appointment-button';
                plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                plusButton.innerHTML = '<i class="fas fa-plus"></i>';
               buttonContainer.appendChild(plusButton)
               console.log(buttonContainer)
              // appointmentElement.appendChild(buttonContainer)
                const eyeButton = document.createElement('button');
                eyeButton.className = 'eye-button hidden';
                eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                buttonContainer.appendChild(eyeButton)
            }
            console.log('Old button container: ',buttonContainer.parentNode)
            appointmentElement.appendChild(buttonContainer)

           //appointmentElement.replaceChild(buttonContainer,OldbuttonContainer)
      
            


        } else {
            alert('Failed to book the appointment. Please try again.');
        }
        if (isAdmin) {
            document.querySelectorAll('.select-appointment').forEach(checkbox => {
                checkbox.addEventListener('change', handleCheckboxChange);
                document.getElementById('select-all').addEventListener('click', handleSelectAll);
            });
        }
    } catch (error) {
        console.error('Error booking the appointment:', error);
        alert('Error booking the appointment. Please try again.');
    }
}
function handleCheckboxChange() {
    const selectedCheckboxes = document.querySelectorAll('.select-appointment:checked');
    const deleteSelectedButton = document.getElementById('delete-selected');
const cancelSelectedButton = document.getElementById('cancel-selected');

    if (selectedCheckboxes.length > 0) {
        deleteSelectedButton.classList.remove('hidden');
        cancelSelectedButton.classList.remove('hidden')

    } else {
        deleteSelectedButton.classList.add('hidden');
        cancelSelectedButton.classList.add('hidden');
    }
}
function handleSelectAll() {
    const checkboxes = document.querySelectorAll('.select-appointment');
    const areAllChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        checkbox.checked = !areAllChecked;
    });

    handleCheckboxChange();
}
async function cancelAppointment(appointmentId) {
    
    const isConfirmed = confirm('Are you sure you want to cancel this appointment?');

    if (!isConfirmed) {
        return;
    }


    
    const user = await fetchUserInfo();
    const isAdmin = user.role === 'admin';

    if(isAdmin){

        try{

            const response = await fetch('/admin/api/cancelAppointmentAdmin',{

                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({appointmentId})
            
            })
            if(response.ok){
    try {
        const phenicsId = getPhenicsIdFromUrl();
        const response = await fetch('/api/cancelApp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentId, phenicsId }),
        });

        if (response.ok) {


       // const result = await response.json();
                

                    

                        const appointment = await response.json();
                        console.log('reached response ok: ',appointment)
                        const appointmentElement = document.getElementById(appointmentId);
                        const buttonContainer = document.getElementById(`id-${appointmentId}`)
                        buttonContainer.replaceChildren();
                        
                        const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          });
                    
                          const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
            
                        if (appointmentElement) {
                            appointmentElement.classList.remove('booked');
                            appointmentElement.innerHTML = `
                                  <p>Time: ${timeFormatted}</p>
                        <p>Date: ${dateFormatted}</p>
                               
                            `;
                            const bookButton = document.createElement('button');
                         
                            if(isAdmin){
            
            
                            
                            bookButton.className = 'book-button hidden';
                        }else{
            
            
                            bookButton.classNmae = 'book-button'
                        }
                            bookButton.textContent = 'Book';
                            bookButton.onclick = () => bookAppointment(appointment._id);
                            buttonContainer.appendChild(bookButton)
                            alert('Appointment canceled successfully!');
                        }
                        if (isAdmin) {
                            appointmentElement.innerHTML += `
                                <div class="admin-actions">
                                    <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                     
                                    <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                                      <p class="ID-pos">ID: ${appointment._id}</p>
                                </div>
                                                      <div class="toggle-container">
                           
    <input type="checkbox" class="toggle-switch" id="toggle-${appointment._id}" ${appointment.status === 'draft' ? '' : 'checked'}>
        <label class="toggle-label" for="toggle-${appointment._id}"></label>
 
</div>
                            `;
                            const plusButton = document.createElement('button');
                plusButton.className = 'add-appointment-button';
                plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                plusButton.innerHTML = '<i class="fas fa-plus"></i>';
                buttonContainer.appendChild(plusButton)
              //  appointmentElement.appendChild(buttonContainer)
                const eyeButton = document.createElement('button');
                eyeButton.className = 'eye-button hidden';
                eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                buttonContainer.appendChild(eyeButton)
                        }

                        appointmentElement.appendChild(buttonContainer)
                    }
                    else{
                        alert(result.message)
                    }



                }catch(error){
                    

                }

            }}catch(error){

                console.error(error);



            }
        }
            else{

                try {
                    const phenicsId = getPhenicsIdFromUrl();
                    const response = await fetch('/api/cancelApp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ appointmentId, phenicsId }),
                    });
            
                    if (response.ok) {



            const appointment = await response.json();
            const appointmentElement = document.getElementById(appointmentId);
            const buttonContainer = document.getElementById(`id-${appointmentId}`)
            buttonContainer.replaceChildren();
            const timeFormatted = new Date(appointment.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
        
              const dateFormatted = new Date(appointment.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            if (appointmentElement) {
                appointmentElement.classList.remove('booked');
                appointmentElement.innerHTML = `
                      <p>Time: ${timeFormatted}</p>
            <p>Date: ${dateFormatted}</p>
              
                `;
                const bookButton = document.createElement('button');
                bookButton.className = 'book-button';
                bookButton.textContent = 'Book';
                bookButton.onclick = () => bookAppointment(appointment._id);
                buttonContainer.appendChild(bookButton)
                alert('Appointment canceled successfully!');
            }
            if (isAdmin) {
                appointmentElement.innerHTML += `
                    <div class="admin-actions">
                        <button class="delete-button" onclick="deleteAppointment('${appointment._id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                          

                        <input type="checkbox" class="select-appointment" data-id="${appointment._id}">
                                              <div class="toggle-container">
                           
    <input type="checkbox" class="toggle-switch" id="toggle-${appointment._id}" ${appointment.status === 'draft' ? '' : 'checked'}>
        <label class="toggle-label" for="toggle-${appointment._id}"></label>
 
</div>
                    </div>
                `;
                const plusButton = document.createElement('button');
                plusButton.className = 'add-appointment-button';
                plusButton.onclick = () => openAddAppointmentModal(appointment._id);
                plusButton.innerHTML = '<i class="fas fa-plus"></i>';
                buttonContainer.appendChild(plusButton)
              //  appointmentElement.appendChild(buttonContainer)
                const eyeButton = document.createElement('button');
                eyeButton.className = 'eye-button hidden';
                eyeButton.innerHTML = '<i class="fa fa-eye"></i>';
                buttonContainer.appendChild(eyeButton)
            }
            appointmentElement.appendChild(buttonContainer)
        }
        else {
            alert('Failed to cancel the appointment.');
        }
        if (isAdmin) {
            document.querySelectorAll('.select-appointment').forEach(checkbox => {
                checkbox.addEventListener('change', handleCheckboxChange);
                document.getElementById('select-all').addEventListener('click', handleSelectAll);
            });
        }
        
    } catch (error) {
        console.error('Error canceling the appointment:', error);
        alert('Error canceling the appointment. Please try again.');
    }
    }
}

document.getElementById('cancel-selected').addEventListener('click',async () =>{


    var cancelSelectedButton = document.getElementById('cancel-selected');
    const selectedCheckboxes = document.querySelectorAll('.select-appointment:checked');
     const appointmentId = Array.from(selectedCheckboxes).map(checkbox => {
        const appointmentId = checkbox.getAttribute('data-id');
        const isBooked = document.getElementById(appointmentId).classList.contains('booked');
        return { appointmentId, isBooked };
    });


 const isConfirmed = confirm('Are you sure you want to cancel the selected appointments?');

    if (!isConfirmed) {
        return;
    }


try{

const response = await fetch('/admin/api/cancelSelected',{

method:'POST',
headers:{
    'Content-Type':'application/json'
},
body: JSON.stringify({appointmentId})



})

if(response.ok){

    const alertMes = await response.json()
    alert(alertMes.message)
    location.reload(false)


}
else{

    alert(alertMes.message)
}


}catch(error){

console.error(error)
}


})

document.getElementById('delete-selected').addEventListener('click', async () => {
    var deleteSelectedButton = document.getElementById('delete-selected');
    const selectedCheckboxes = document.querySelectorAll('.select-appointment:checked');
     const appointmentId = Array.from(selectedCheckboxes).map(checkbox => {
        const appointmentId = checkbox.getAttribute('data-id');
        const isBooked = document.getElementById(appointmentId).classList.contains('booked');
        return { appointmentId, isBooked };
    });



    const isConfirmed = confirm('Are you sure you want to delete the selected appointments?');
 
    if (!isConfirmed) {
        return;
    }
    const reason = prompt('Please enter the reason for deleting this appointment:');
    if (!reason) {
        // If the user cancels or doesn't enter a reason, exit the function
        alert('Deletion canceled. You must provide a reason.');
        return;
    }
    let formData={

        appointmentId: appointmentId,
        reason: reason,
    }
    try {
        const response = await fetch('/admin/api/appointmentDelete',{

            method:'DELETE',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(formData),
    
    
        })

        if (response.ok) {

            console.log(appointmentId)
            appointmentId.forEach(({appointmentId,isBooked})=> {
          
                const appointmentElement = document.getElementById(appointmentId);
                if (appointmentElement) {

                    appointmentElement.remove();

                }
            });

            console.log('Selected appointments deleted successfully');
        
            deleteSelectedButton.classList.add('hidden');
        } else {
            console.error('Failed to delete selected appointments');
        }
    } catch (error) {
        console.error('Error deleting selected appointments:', error);
    }
});

async function deleteAppointment(AppointmentId){
    
    const isConfirmed = confirm('Are you sure you want to delete this appointment?');

    if (!isConfirmed) {
        // If the user clicks "Cancel", exit the function
        return;
    }
    const reason = prompt('Please enter the reason for deleting this appointment:');
    if (!reason) {
        // If the user cancels or doesn't enter a reason, exit the function
        alert('Deletion canceled. You must provide a reason.');
        return;
    }
    const appointmentElement = document.getElementById(AppointmentId);

    // Check if the appointment is booked by looking for a specific class or attribute
    const isBooked = appointmentElement.classList.contains('booked');
    console.log('booked: ',isBooked);
    const appointmentId = {

        appointmentId:AppointmentId,
        isBooked: isBooked,

    }
    let formData={
        appointmentId : appointmentId,
        reason: reason,
    }

    try{
    const response = await fetch('/admin/api/appointmentDelete',{

        method:'DELETE',
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),


    })
    if (response.ok){
        console.log('reached response ok')
           const appointmentElement = document.getElementById(AppointmentId);
           console.log(appointmentElement)
            if (appointmentElement) {
                console.log('reached iside if element')
                appointmentElement.remove();
            }

      //  console.log('Appointment deleted successfully:', result);
        // Remove the appointment element from the DOM or refresh the page
    } else {
        console.error('Failed to delete the appointment');
    }
}catch(error){
    console.error('Error deleting the appointment:', error);
}

}
function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
}
async function fetchDoctorName(){

    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('doctorId');
    const phenicsId = getPhenicsIdFromUrl();
    const response = await fetch(`/api/doctorName?doctorId=${doctorId}`);
    if(response.ok){
        const doctor = await response.json()
        console.log('doctor: ',doctor)
        return doctor;
      


    }else{


        alert(doctor.message)
        return 'Doctors Availability';
    }
    
  

}
