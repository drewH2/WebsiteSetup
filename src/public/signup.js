document.addEventListener('DOMContentLoaded',async()=>{

console.log('hiii')
    try{
        const countrySelect = document.getElementById('nationality');

        
   

    
   

       
        const response = await fetch(`/fetchCountries`)
        const countries = await response.json();
    
    
    
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name; // Country code
            option.textContent = country.name; // Country name
            countrySelect.appendChild(option);
   
        
            
        });
       countrySelect.value=''
      
        
    }catch(error){
    
        console.error(error)
        alert('failed showing countries')
    
    }

})
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
   
    const formData = {
        firstName: document.getElementById('firstName').value,
        fatherName: document.getElementById('fatherName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        fileNumber: document.getElementById('fileNumber').value,
        countryCode: document.getElementById('countryCode').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        phenicsId: document.getElementById('phenicsId').value,
        password: document.getElementById('password').value,
        nationality: document.getElementById('nationality').value
    };
 

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const message = await response.json();
            alert(message.message);
           // window.location.href = '/login';
        } else {
            const errorText = await response.json();
            alert(`Error: ${errorText.message}`);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('Error during signup. Please try again.');
    }
});
