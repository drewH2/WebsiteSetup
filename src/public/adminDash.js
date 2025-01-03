const phenicsId = getPhenicsIdFromUrl();
var updateSched = document.getElementById('updateSched');
const dateSelectionMode = document.getElementById('dateSelectionMode');
const fromToDateFields = document.getElementById('fromToDateFields');
const selectMultipleDatesFields = document.getElementById('selectMultipleDatesFields');
const selectedDatesInput = document.getElementById('selectedDates');
const addDateButton = document.getElementById('addDateButton');
const selectedDatesList = document.getElementById('selectedDatesList');
const settingsIcon = document.getElementById('settingsIcon');
const settingsDropdown = document.getElementById('settingsDropdown');
const clearDatesButton = document.getElementById('clearDatesButton');
const selectDaysOfWeekFields = document.getElementById('selectDaysOfWeekFields');
const excludeDatesInput = document.getElementById('excludeDates');
const addExcludeDateButton = document.getElementById('addExcludeDateButton');
const excludeDatesList = document.getElementById('excludeDatesList');
const clearExcludeDatesButton = document.getElementById('clearExcludeDatesButton');
const weekendCont = document.querySelector('.weekendCont');
const addDoctorSquare = document.getElementById('addDoctorSquare');
const manageSchedulesSquare = document.getElementById('manageSchedulesSquare');
const addDoctorSection = document.getElementById('addDoctorSection');
const manageSchedulesSection = document.getElementById('manageSchedulesSection');

const deleteAppointmentSquare = document.getElementById('deleteAppointments');
const deleteAppointment = document.getElementById('deleteApp')
const lastOption = document.getElementById('lastOption')
const statusSelect = document.getElementById('status');
const statusLabel= document.getElementById('statusLabel');
const searchPatient = document.getElementById('searchPatient');
const resolvePatient = document.getElementById('resolvePatient')
let dateArr=[]
let excludeDatesArr = [];
settingsIcon.addEventListener('click', () => {
    settingsDropdown.classList.toggle('visible');
});

resolvePatient.addEventListener('click',()=>{

    window.open(`/admin/${phenicsId}/resolvePatient`, '_blank');


})
searchPatient.addEventListener('click',()=>{
    const phenicsId = getPhenicsIdFromUrl()
console.log('i clicked')
   // window.location.href=`/admin/${phenicsId}/searchPatient`
    window.open(`/admin/${phenicsId}/searchPatient`, '_blank');

})

addDoctorSquare.addEventListener('click', () => {
    addDoctorSection.classList.add('visible');
    manageSchedulesSection.classList.remove('visible');

});

manageSchedulesSquare.addEventListener('click', () => {

    statusSelect.classList.remove('hidden');
    statusLabel.classList.remove('hidden');

    const timeBlocks = document.querySelectorAll('.break-block')
    console.log(timeBlocks);
    timeBlocks.forEach(block => {
        block.classList.remove('hidden');
    });
    lastOption.classList.remove('hidden');
 updateSched.id="updateSched"
updateSched.textContent="Update Schedule"
    updateSched.replaceWith(updateSched.cloneNode(true));
    updateSched = document.getElementById('updateSched');


    // Attach the new event listener
    updateSched.addEventListener('click', handleUpdateSchedule);


const headerChange = document.getElementById('headerChange')

headerChange.textContent="Update Schedule"
    manageSchedulesSection.classList.add('visible');
    addDoctorSection.classList.remove('visible');
  
});
deleteAppointmentSquare.addEventListener('click',()=>{

    statusSelect.classList.add('hidden');
    statusLabel.classList.add('hidden');
    const timeBlocks = document.querySelectorAll('.break-block')
    console.log(timeBlocks);
    timeBlocks.forEach(block => {
        block.classList.add('hidden');
    });
    
  // lastOption.classList.add('hidden');
 


updateSched.id="deleteApp"
updateSched.textContent="Delete Appointments"
updateSched.replaceWith(updateSched.cloneNode(true));
updateSched = document.getElementById('deleteApp');

// Attach the new event listener
updateSched.addEventListener('click', handleDeleteAppointments);
console.log('delete app: ',updateSched)
const headerChange = document.getElementById('headerChange')
headerChange.textContent="Delete Appointments"
manageSchedulesSection.classList.add('visible');
addDoctorSection.classList.remove('visible');

    //console.log('selected spec: ', getSelectedSpecialty())
  


})
dateSelectionMode.addEventListener('change', (e) => {
    const mode = e.target.value;
    fromToDateFields.classList.add('hidden');
    selectMultipleDatesFields.classList.add('hidden');
    selectDaysOfWeekFields.classList.add('hidden');

    if (mode === 'fromToDate') {
        fromToDateFields.classList.remove('hidden');
        weekendCont.classList.remove('hidden')
    } else if (mode === 'selectMultipleDates') {
        selectMultipleDatesFields.classList.remove('hidden');
        weekendCont.classList.add('hidden')
    } else if (mode === 'selectDaysOfWeek') {
        selectDaysOfWeekFields.classList.remove('hidden');
        weekendCont.classList.add('hidden')
    }
});

addDateButton.addEventListener('click', function() {
    const selectedDate = selectedDatesInput.value;
    if (selectedDate && !isDateAlreadySelected(selectedDate)) {
        addDateToList(selectedDate);
        dateArr.push(selectedDate);
        console.log(dateArr);
        selectedDatesInput.value = '';
    }
});

clearDatesButton.addEventListener('click', function() {
    selectedDatesList.innerHTML = '';
    dateArr=[];
    console.log(dateArr);
});


function removeDate(dateToRemove) {
    console.log('reached removeDate', dateToRemove)

    const index = dateArr.indexOf(dateToRemove);
    if (index > -1) {
        console.log('reached index greater than -1');
        dateArr.splice(index, 1);
    }
}

function addDateToList(date) {
    const dateElement = document.createElement('div');
    dateElement.dataset.date = date;
    dateElement.textContent = date;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        selectedDatesList.removeChild(dateElement);
        removeDate(date)
    });
    dateElement.appendChild(removeButton);
    selectedDatesList.appendChild(dateElement);
}


settingsIcon.addEventListener('click', function() {
    settingsDropdown.classList.toggle('show');
});

function isDateAlreadySelected(date) {
    const dates = selectedDatesList.querySelectorAll('div');
    for (const dateElement of dates) {
        if (dateElement.dataset.date === date) {
            return true;
        }
    }
    return false;
}

function switchTab(showId, hideId) {
    const showElement = document.getElementById(showId);
    const hideElement = document.getElementById(hideId);

    hideElement.classList.add('hidden');
    setTimeout(() => {
        hideElement.style.display = 'none';
        showElement.style.display = 'block';
        setTimeout(() => {
            showElement.classList.remove('hidden');
        }, 20);
    }, 500);
}

var selectDoctor = document.getElementById('doctorSelect');
var selectSpecialty = document.getElementById('doctorSpecialties');
async function fetchSpecialties() {
    try {
        const response = await fetch(`/admin/${phenicsId}/getSpecialties`);
        if (response.ok) {
            const specialties = await response.json();
            console.log(specialties);
            
            specialties.forEach(specialty => {
                const option = document.createElement('option');
                console.log(specialty._id);
                option.value = specialty._id;
                option.textContent = specialty._id;
                selectSpecialty.appendChild(option);
            });

        } else {
            console.error('Failed to fetch specialties:', response.status);
        }
    } catch (error) {
        console.error('Error fetching specialties:', error);
    }
}
async function fetchDoctors(){
try{
    const response = await fetch(`/admin/${phenicsId}/getDoctors`,{

        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({specialty: getSelectedSpecialty()}),

    })
    if(response.ok){

        const doctors = await response.json();
        selectDoctor.innerHTML = '';
    
        doctors.forEach(doctor =>{

            const option = document.createElement('option');
           
            option.value = doctor._id;
            option.textContent = doctor.name;
            selectDoctor.appendChild(option);

        })


    }else{
        alert(response.status);
    }
 
    
}catch(error){

   // alert(error);
    console.log(error);
}


}






addExcludeDateButton.addEventListener('click', function() {
    const excludeDateInput = document.getElementById('excludeDateInput');
    const excludeDate = excludeDateInput.value;
    if (excludeDate && !isExcludeDateAlreadySelected(excludeDate)) {
        addExcludeDateToList(excludeDate);
        excludeDateInput.value = '';
    }
});

clearExcludeDatesButton.addEventListener('click', function() {
    excludeDatesList.innerHTML = '';
    excludeDatesArr = [];
});

function removeExcludeDate(dateToRemove) {
    const index = excludeDatesArr.indexOf(dateToRemove);
    if (index > -1) {
        excludeDatesArr.splice(index, 1);
    }
}

function addExcludeDateToList(date) {
    excludeDatesArr.push(date);
    const excludeDatesList = document.getElementById('excludeDatesList');
    const dateElement = document.createElement('div');
    dateElement.className = 'date-item';
    dateElement.textContent = date;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        excludeDatesList.removeChild(dateElement);
        removeExcludeDate(date);
    });
    dateElement.appendChild(removeButton);
    excludeDatesList.appendChild(dateElement);
}


function isExcludeDateAlreadySelected(date) {
    return excludeDatesArr.includes(date);
}

function getSelectedSpecialty(){

var specialty = document.getElementById('doctorSpecialties').value;
return specialty;


}
document.addEventListener('DOMContentLoaded',function(){

    fromToDateFields.classList.remove('hidden');
        selectMultipleDatesFields.classList.add('hidden');
    fetchSpecialties();

    console.log('selected spec: ', getSelectedSpecialty())
    fetchDoctors();


})
//async function()


selectSpecialty.addEventListener('change',function(){

  


console.log(selectSpecialty.value);
fetchDoctors();

})




async function handleUpdateSchedule(){
    console.log('reached inside update sched')
let formData;

var selectSpecialty = document.getElementById('doctorSpecialties').value
var selectDoctor =document.getElementById('doctorSelect').value
var schedFromD=document.getElementById('scheduleFromDate').value
var schedToD = document.getElementById('scheduleToDate').value
var schedFromT=document.getElementById('scheduleFromTime').value
var schedToT= document.getElementById('scheduleToTime').value
var gapNumber = document.getElementById('gapNumber').value
var isWeekendChecked = document.getElementById('excludeWeekends')
var breakScheduleFromTime= document.getElementById('breakScheduleFromTime').value
var breakScheduleToTime = document.getElementById('breakScheduleToTime').value
var status = document.getElementById('status').value;


const selectedDates = excludeDatesArr;





    const selectedMode = dateSelectionMode.value;

    if (selectedMode === 'fromToDate') {

        if (!doctorSelect || !schedFromD || !schedToD || !schedFromT || !schedToT || !gapNumber) {
            console.log('heree')
            alert('Please fill out all required fields.');
            return;
        }
 
   formData = {
        selectDoctor: selectDoctor,
        schedFromD: schedFromD,
        schedToD: schedToD,
        schedFromT: schedFromT,
        schedToT: schedToT,
        gapNumber: gapNumber,
        selectedDates: selectedDates,
        FromToMode: "FT",
        breakScheduleFromTime:breakScheduleFromTime,
        breakScheduleToTime:breakScheduleToTime,
        isWeekendChecked:isWeekendChecked.checked,
        status:status


        
    }


      
    } else if (selectedMode === 'selectMultipleDates') {

        console.log('date array: ',dateArr)
        if (!doctorSelect || (dateArr.length==0) || !schedFromT || !schedToT || !gapNumber) {
            console.log('heree')
            alert('Please fill out all required fields.');
            return;
        }
        console.log('reached select date');

        
        formData = {
            selectDoctor: selectDoctor,
            schedFromT: schedFromT,
            schedToT: schedToT,
            gapNumber: gapNumber,
            dateArr: dateArr,
            breakScheduleFromTime:breakScheduleFromTime,
            breakScheduleToTime:breakScheduleToTime,
            FromToMode: 'MD',
            status:status

            
        }

        
        
    }
    else if(selectedMode==='selectDaysOfWeek'){
        const selectedDays = Array.from(document.querySelectorAll('input[name="daysOfWeek"]:checked')).map(el => el.value);
schedFromD = document.getElementById('dateRangeFrom').value
schedToD = document.getElementById('dateRangeTo').value


        formData = {
            selectDoctor: selectDoctor,
            schedFromD: schedFromD,
            schedToD: schedToD,
            schedFromT: schedFromT,
            schedToT: schedToT,
            gapNumber: gapNumber,
            selectedDays: selectedDays,
            breakScheduleFromTime:breakScheduleFromTime,
            breakScheduleToTime:breakScheduleToTime,
            FromToMode: 'W',
            status:status
            
        }


    }


    
    try {
    const response = await fetch(`/admin/${phenicsId}/updateSchedule`,{

        method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)



    });
    if (response.ok) {
        const result = await response.json()
        alert(result.message);
    } else {
        console.error('Failed to update schedule:', response.status);
    }
} catch (error) {
    console.error('Error updating schedule:', error);
}
console.log('i clicked');

  }



//const specialtyVal = document.querySelector('doctorSpecialties');

//var doctorSpecialty = document.getElementById('doctorSpecialties').value;
 
//console.log('select spec: ', selectSpecialty.value);
/*selectSpecialty.addEventListener('click',async function(){

    try{

        const response = await fetch('/admin/getSpecialties');
        const specialties = await response.json;
        console.log(specialties);

        

    }catch(error){

        alert(error);

    }


});*/





async function handleDeleteAppointments(){

    console.log('inside fun handledelete')
    let formData

    const phenicsId = getPhenicsIdFromUrl()
   // var selectSpecialty = document.getElementById('doctorSpecialties').value
    var selectDoctor =document.getElementById('doctorSelect').value
    var schedFromD=document.getElementById('scheduleFromDate').value
    var schedToD = document.getElementById('scheduleToDate').value
    var schedFromT=document.getElementById('scheduleFromTime').value
    var schedToT= document.getElementById('scheduleToTime').value
   // var gapNumber = document.getElementById('gapNumber').value

   // var isWeekendChecked = document.getElementById('excludeWeekends')
   // var breakScheduleFromTime= document.getElementById('breakScheduleFromTime').value
   // var breakScheduleToTime = document.getElementById('breakScheduleToTime').value



    const selectedDates = excludeDatesArr;





    const selectedMode = dateSelectionMode.value;

    if (selectedMode === 'fromToDate') {

        if (!doctorSelect || !schedFromD || !schedToD  ) {
            console.log('heree')
            alert('Please fill out all required fields.');
            return;
        }
 
   formData = {
        selectDoctor: selectDoctor,
        schedFromD: schedFromD,
        schedToD: schedToD,
        schedFromT: schedFromT,
        schedToT: schedToT,
    
        selectedDates: selectedDates,
        FromToMode: "FT",
    
  


        
    }


      
    } else if (selectedMode === 'selectMultipleDates') {

        console.log('date array: ',dateArr)
        if (!doctorSelect || (dateArr.length==0) ) {
            console.log('heree')
            alert('Please fill out all required fields.');
            
            return;
        }
        console.log('reached select date');

        
        formData = {
            selectDoctor: selectDoctor,
            schedFromT: schedFromT,
            schedToT: schedToT,
            dateArr: dateArr,
            FromToMode: 'MD',

            
        }

        
        
    }
    else if(selectedMode==='selectDaysOfWeek'){
        console.log('reached inside elif')
        const selectedDays = Array.from(document.querySelectorAll('input[name="daysOfWeek"]:checked')).map(el => el.value);
schedFromD = document.getElementById('dateRangeFrom').value
schedToD = document.getElementById('dateRangeTo').value


        formData = {
            selectDoctor: selectDoctor,
            schedFromD: schedFromD,
            schedToD: schedToD,
            schedFromT: schedFromT,
            schedToT: schedToT,
            selectedDays: selectedDays,
            FromToMode: 'W',
            
        }


    }


   
    console.log(formData.FromToMode)

try{
  

const response = await fetch(`/admin/api/${phenicsId}/deleteAppointments`,{

        method: 'DELETE',
        headers:{

                'Content-Type':'application/json'
        },
     body: JSON.stringify(formData),

  


})
    if(response.ok){


       const message = await response.json();
       alert(message.message);

    }

}catch(error){

    const message = await response.json();
    alert(message.message)
    console.error(error);
}


}

function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
}











