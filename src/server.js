const express = require('express');
const dotenv = require("dotenv");
const app = express();

const path = require('path');
const moment = require('moment-timezone');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schema = require('./schema.js');
const authenticateToken = require('./middleware/auth'); // Import the middleware
const adminRoutes = require('./routes/admin.js');
const CountryList = require('country-list');
dotenv.config();
const PORT = process.env.PORT || 7070;

const MONGOURL = process.env.MONGO_URL;
const MONGO_URL = 'mongodb+srv://admin:G53rj3lfykfjqPmT@cluster0.ovwy5wu.mongodb.net/Appointment?retryWrites=true&w=majority&appName=Cluster0'
console.log(MONGOURL);
const Appointment = schema.appointmentModel;


mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected successfully");

    // Start the server only after successful connection
    app.listen(PORT, () => {
        console.log('Server is listening on port 8080');
      
    });
}).catch((error) => console.error('Database connection error:', error));

app.use('/images', express.static(path.join(__dirname, '../images')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

app.use('/admin', adminRoutes);

app.get('/', (req,res)=>{
console.log(path.join(__dirname, '/public'));
    res.sendFile(path.join(__dirname,'login.html'));

});
//schema.createDoctor('Elie Korbani','Positive with patients','Family Medicine')
/*async function deleteApp(){try {
    // Step 3: Delete all documents in the Appointment collection
    const result = await schema.deletedAppModel.deleteMany({});
    console.log('All documents in the Appointment collection have been deleted:', result);
  } catch (err) {
    console.error('Error deleting documents:', err);
  } 
}
deleteApp();*/
const testSchema = new mongoose.Schema({

    name: {type: String,
      
    },
    age: {type: Number,

    }

});

/*const testModel = new mongoose.model("test",testSchema,"Test");
const data={

    name: "Andrew",
    age: 19

};
testModel.insertMany([data]);*/

  
app.get("/getUsers",async(req,res)=>{

    try {

       
   
        res.json();
   
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Error retrieving users');
    }
    


});
app.post("/post-database",(req,res)=>{

    const dob = req.body;
    console.log("dob: ", dob);
    const appointmentDateObj = new Date(dob.patientDob);
    console.log(appointmentDateObj);





})
app.get('/search-doctors', async (req, res) => {
    const query = req.query.query;

    try {
        const doctors = await schema.doctorModel.find({
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        }).lean();

        res.json(doctors);
    } catch (error) {
        console.error('Error searching for doctors:', error);
        res.status(500).json({ message: 'Error searching for doctors' });
    }
});
app.get('/medical/:phenicsId',authenticateToken,async(req,res)=>{
  console.log('from server user id: ',req.user)
    const filePath = path.join(__dirname, 'index.html');
   // console.log('Serving index.html for Phenics ID:', req.params.phenicsId);
    
   res.sendFile(filePath);
   



})
app.get('/medical/:phenicsId/availability-home',authenticateToken,(req,res)=>{
    const filePath = path.join(__dirname, 'availability-home.html');

    res.sendFile(filePath);



})
app.get('/medical/:phenicsId/availability-page',authenticateToken,async(req, res)=>{


console.log('reachyed avail-page');
console.log('Serving availability-page.html for Phenics ID:', req.params.phenicsId);
    const filePath = path.join(__dirname, 'availability-page.html');
    res.sendFile(filePath);

    
  



})

app.get('/api/appointments',async(req,res)=>{

    try{    
        const doctorId = req.query.doctorId;
        console.log(doctorId);
    
        //this piece of code will help you with adding time and intervals for the admin user
    
       /* const testdate = moment.tz('2024-05-30','Asia/Beirut');
        const startTime = testdate.clone(); 
        startTime.hour(8).minute(30);
        const endTime = testdate.clone();
        endTime.hour(12).minute(30);
      
    const timeInterval = 30; // 30 minutes
    const timeSlots = [];
    
    for (let time = startTime.clone(); time.isBefore(endTime); time.add(timeInterval, 'minutes')) {
       // timeSlots.push(time.toDate());
    
       schema.createAppointment(time.toDate(),testdate,null,doctorId);
       timeSlots.push(time.format('HH:mm A'));
    
      }
    console.log(timeSlots);*/
    
      //  schema.createAppointment(testtime,testdate,null,doctorId);
    
     
    
       
        const appointments = await Appointment.find({ doctor_id: doctorId });
    
        console.log(appointments);
        const groupedAppointments = appointments.reduce((acc, appointment) => {
            const localDateStr = new Date(appointment.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!acc[localDateStr]) {
                acc[localDateStr] = [];
            }
            acc[localDateStr].push(appointment);
            return acc;
        }, {});
console.log('grouped app: ',groupedAppointments);
        const availableDates = Object.keys(groupedAppointments).filter(date => {
            return groupedAppointments[date].some(appointment => !appointment.patient_id);
        });
        console.log('Available Dates:', availableDates);
        res.json(availableDates);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.sendStatus(500);
    }
    



})
app.get('/api/:phenicsId/userinfo', authenticateToken, (req, res) => {
    res.json({ id: req.user.id, role: req.user.role});
});
app.post('/api/cancelApp',async(req,res)=>{

const {appointmentId,phenicsId}=req.body;

try{

   const updatedDocument = await schema.cancelAppointment(appointmentId);
   console.log('UPDOC: ',updatedDocument);
   res.json(updatedDocument); // Send the updated document as the response

}catch(error){

    console.error(error);
    res.sendStatus(500); // Send an error response
}



});
app.get('/api/appointmentswithd',async(req,res)=>{


    const doctorId = req.query.doctorId;
    const appointmentDate = req.query.selectedDate;

    try {
        // Query appointments for a specific doctor on a specific date
        const appointments = await Appointment.find({
            doctor_id: doctorId,
            date: appointmentDate,
               
        });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }



})





app.post('/api/book-appointment', async (req, res) => {
    try {
        const { appointmentId, patientId } = req.body;
        console.log('appointmentid and pat id from ser: ', appointmentId,'  ',patientId);
        
        // Find the appointment and update it with the patient ID
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
           
        }
        if (appointment.patient_id) {
            return res.status(400).send('Appointment already booked');
            
        }

        const existingAppointment = await Appointment.findOne({
            doctor_id: appointment.doctor_id,
            date: appointment.date,
            patient_id: Number(patientId)
        });
        if (existingAppointment) {
            return res.status(400).send('Patient already has an appointment booked for this date');
        }

        appointment.patient_id = Number(patientId);

        await appointment.save();
        console.log('app from serv: ',appointment);
        res.json(appointment);
    } catch (error) {
        console.error('Error booking the appointment:', error);
        res.status(500).send('Error booking the appointment');
    }
});

app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, 'signup.html');
    res.sendFile(filePath);
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
    try {
        const { firstName, fatherName, lastName, dob, fileNumber, countryCode, phoneNumber, phenicsId, password, nationality } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

     const error = await schema.createPatient(firstName, fatherName, lastName, dob, fileNumber, countryCode+phoneNumber,phenicsId,hashedPassword,nationality);
        // Create a new patient
        console.log('result: ',error)
        if(error){

            res.status(404).json({message: 'Failed'})
        }else{

            res.status(201).send({message: 'User registered successfully'});

        }
     
        
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    }
});

// Route to serve the login page
app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'login.html');
    res.sendFile(filePath);
});

// Route to handle login form submission
app.post('/login', async (req, res) => {
    try {
        const { phenicsId, password } = req.body;

        // Find the patient by phenicsId
        console.log(phenicsId);
        const patient = await schema.patientModel.findOne({ _id: Number(phenicsId) });
        console.log(patient);
      //  console.log(schema.patientModel.findById(Number(phenicsId)))
        if (!patient) {
            console.log('reached if patient');
            return res.status(400).send('Invalid Phenics ID or password');
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, patient.password);


        if (!isPasswordValid) {
            return res.status(400).send('Invalid Phenics ID or password');
        }

        // Generate a JWT
        console.log(dotenv.config());
        const token = jwt.sign({ id: patient._id, role:patient.role}, process.env.JWT_SECRET, { expiresIn: '8h' });

        const redirectUrl = `/${patient._id}`;
        console.log('Redirecting to:', redirectUrl);
        const data={token:token,phenicsId: patient._id};

        res.json(data);
      
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }
});
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    const patient = await schema.patientModel.findOne({ _id: phenicsId });
    console.log(patient);
    if (!patient) {
        console.log('reached if patient');
        return res.status(400).send('Invalid Phenics ID or password');
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, patient.password);


    if (!isPasswordValid) {
        return res.status(400).send('Invalid Phenics ID or password');
    }
        // Generate admin token with role: 'admin'
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token to the client or store it as needed
        res.json({ token });
 
});
app.use('/login-admin',(req,res)=>{

    res.sendFile(path.join(__dirname,'loginAdmin.html'));



});
app.get('/api/doctorName' ,async(req,res)=>{

    try{
    
    
    
    const doctorId = req.query.doctorId;
    console.log('doctor in server: ',doctorId)
    const doctor = await schema.doctorModel.findById(doctorId)
    if(doctor){
    
        res.json(doctor.name)
        console.log('name: ',doctor.name)
    }
    else{
    
        res.status(500).json={message: 'Doctor not found'}
    }
    
    }catch(error){
    
        console.error(error)
        res.status(500).json = {message:'error fetching Doctor Name'}
    
    }
    
    
    })

    app.get('/fetchCountries',async(req,res)=>{
console.log('reached inside fetch countries in server')
        const countries = CountryList.getData();
    
        res.json(countries)
    
    
    })