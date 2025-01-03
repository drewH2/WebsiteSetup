document.addEventListener('DOMContentLoaded', async () => {

   
    fetchUserInfo().then(user => {
        if (user.role === 'admin') {
           // document.getElementById('admin-functions').classList.remove('hidden');
           document.getElementById('admin-button').classList.remove('hidden');
           console.log('welcome to admin page');



        }
    });





    const searchButton = document.getElementById('search-b');
    const doctorSearchInput = document.getElementById('doctorSearchInput');


    searchButton.addEventListener('click', async () => {
        const query = doctorSearchInput.value;
        if (query.length > 0) {
            try {
                const response = await fetch(`/search-doctors?query=${query}`);
                const doctors = await response.json();
                displayDoctors(doctors);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        } else {
            clearDoctorCards();
        }
    });

    doctorSearchInput.addEventListener('input', () => {
        if (doctorSearchInput.value.length === 0) {
            clearDoctorCards();
        }
    });
});



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


function displayDoctors(doctors) {
    const container = document.getElementById('doctorCardsContainer');
    container.innerHTML = '';

    doctors.forEach((doctor, index) => {
        const card = document.createElement('div');
        card.className = 'doctor-card';
        card.dataset.doctorId = doctor._id;
        card.id = `doctorCard${index + 1}`;
        card.innerHTML = `
            <h3 id="doctorName${index + 1}">${doctor.name}</h3>
            <p>${doctor.desc}</p>
        `;
        container.appendChild(card);

        card.addEventListener('click', () => {
            const doctorId = card.dataset.doctorId;
            const phenicsId = getPhenicsIdFromUrl();
            window.location.href = `/medical/${phenicsId}/availability-home?doctorId=${doctorId}`;
        });
    });
}

function getPhenicsIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2];
}

function clearDoctorCards() {
    const container = document.getElementById('doctorCardsContainer');
    container.innerHTML = '';
}
