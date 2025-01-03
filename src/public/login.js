
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        phenicsId: document.getElementById('phenicsId').value,
        password: document.getElementById('password').value,
    };

    try {
      
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
             
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('reached response ok');
            const {token,phenicsId} = await response.json();

         
            //alert('Login successful!');
            localStorage.setItem('token', token); // Store JWT in local storage
            localStorage.setItem('phenicsId', phenicsId);
            document.cookie = `jwt=${token}; path=/`;
            window.location.href = `/medical/${phenicsId}`;
            // Redirect to the home page or dashboard
           

           
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }








    
});
document.getElementById('signup').addEventListener('click', async(event)=>{


    window.location.href='/signup';




})
