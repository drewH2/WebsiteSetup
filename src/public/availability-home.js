


// availability-home.js
  const phenicsId = getPhenicsIdFromUrl();
    const doctorId = getDoctorIdFromUrl();
 
document.addEventListener('DOMContentLoaded', async () => {
    const phenicsId = getPhenicsIdFromUrl();
    const doctorId = getDoctorIdFromUrl();
    console.log('doctorID: ',doctorId)

    const doctorHeader = await fetchDoctorName(doctorId);
    console.log('Doctor Name to set:', doctorName);
    document.getElementById('doctorName').textContent= `Dr. ${doctorHeader}`


 

    try {


      


        let ascending = false;
        updateButtonArrow(ascending);
        let dates = await fetchDoctorAvailability(phenicsId, doctorId);
        console.log('dates before: ',dates)

document.getElementById('sortButton').addEventListener('click', async function(){

console.log('i clicked inside');
   dates = dates.sort((a, b) => {
    return ascending ? parseDateString(a) - parseDateString(b) : parseDateString(b) - parseDateString(a);
      });
      console.log('dates after: ', dates)
      ascending = !ascending;
   await displayAvailabilityDates(dates);
      updateButtonArrow(ascending);

})
console.log('dates after listener',dates)
      await  displayAvailabilityDates(dates);
    } catch (error) {
        console.error('Error fetching availability:', error);
        alert('Error fetching availability. Please try again.');
    }
});




function updateButtonArrow(ascending) {
    const arrow = document.querySelector('.arrow');
    if (ascending) {
        arrow.classList.remove('down');
        arrow.classList.add('up');
    } else {
        arrow.classList.remove('up');
        arrow.classList.add('down');
    }
}
function parseDateString(dateString) {
    return new Date(dateString);
  }

async function fetchDoctorAvailability(phenicsId, doctorId) {
    const response = await fetch(`/api/appointments?doctorId=${doctorId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

 async function displayAvailabilityDates(dates) {
    const availabilityDates = document.getElementById('availability-dates');
    availabilityDates.innerHTML = ''; // Clear previous results

    // Create a Set to store unique dates
  //  const uniqueDates = new Set();

    // Iterate through all dates and add to the Set


    dates.forEach(date => {
        const dateObj = new Date(date);
        const newDate = new Date();
        newDate.setHours(0,0,0,0)
        const dateCard = document.createElement('div');
        dateCard.className = 'date-card';
        dateCard.textContent =dateObj.toLocaleDateString('en-US', {
            weekday:'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (dateObj < newDate) {
           
            console.log(dateObj,' ',newDate)
            dateCard.classList.add('past-date');
        }
        if(areDatesEqual(dateObj, newDate) ){
            console.log('reached inside equal')
            dateCard.classList.add('current-date');
        }

        dateCard.addEventListener('click', () => {
            handleDateSelection(date, phenicsId, doctorId);
        });
        availabilityDates.appendChild(dateCard);
    });
  /*  dates.forEach(date => {
        // Format the date to ignore time
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday:'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        console.log(formattedDate);
        uniqueDates.add(formattedDate);
    });

    // Convert Set back to array for display
    const uniqueDatesArray = Array.from(uniqueDates);

    // Display unique dates in the UI
    uniqueDatesArray.forEach(date => {
        const dateCard = document.createElement('div');
        dateCard.className = 'date-card';
        dateCard.textContent = date;
        dateCard.addEventListener('click', () => {
            handleDateSelection(date, phenicsId, doctorId);
        });
        availabilityDates.appendChild(dateCard);
    });*/
}

function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2]; // Assuming the Phenics ID is the second part of the path
}

function getDoctorIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('doctorId'); // Retrieve doctorId from query parameter
}
function handleDateSelection(selectedDate, phenicsId, doctorId) {
    const formattedDate = encodeURIComponent(selectedDate); // Encode date for URL

    // Redirect to availability-page with doctor ID and selected date in URL
    window.location.href = `/medical/${phenicsId}/availability-page?doctorId=${doctorId}&selectedDate=${formattedDate}`;
}
async function fetchDoctorName(doctorId) {
    console.log('Fetching doctor name for doctorId:', doctorId);
    try {
        const response = await fetch(`/api/doctorName?doctorId=${doctorId}`);
        if (response.ok) {
            const doctor = await response.json();
            console.log('Fetched doctor:', doctor);
            return doctor;
        } else {
            console.error('Failed to fetch doctor name. Status:', response.status);
            return "Doctor's Availability";
        }
    } catch (error) {
        console.error('Error in fetchDoctorName:', error);
        throw error; // Propagate error so it can be caught in the calling function
    }
}
function areDatesEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}
