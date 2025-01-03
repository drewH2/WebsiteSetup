 //routes/admin.js
const express = require('express');
const router = express.Router();
const path = require('path');
const  authenticateToken = require('../middleware/auth.js');
const adminAuth = require('../middleware/adminAuth.js');
const schema = require('../schema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const { start } = require('repl');
const CountryList = require('country-list');
const { Console } = require('console');


// Middleware applied to all routes in this router

router.use('/images', express.static(path.join(__dirname, '..', 'images')));
// Define admin routes below
router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname,'..','loginAdmin.html'));
});


router.post('/',async(req,res)=>{

try{
    const { phenicsId, password } = req.body;

console.log('from admin" ',phenicsId);
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
        const token = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

        // Send the token to the client or store it as needed
      
        const data={token:token,phenicsId: patient._id};
        console.log('data from admin: ',data);
        res.json( data );
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }

});
//router.use(authenticateToken);
router.get('/:phenicsId',authenticateToken,adminAuth, async(req,res)=>{

    res.sendFile(path.join(__dirname,'..','adminDash.html'));
   // res.send('hello');


})

router.get('/:phenicsId/getSpecialties',authenticateToken,adminAuth,async(req,res)=>{

try{    const specialties = await schema.getSpecialties();
    console.log(specialties);
    res.json(specialties);
}
catch(error){

    console.error(error);
    res.sendStatus(500); // Send an error response
}



})
router.post('/:phenicsId/getDoctors',authenticateToken,adminAuth,async(req,res)=>{

    try{

        const specialty = req.body;
        console.log('specialty from serv: ',specialty.specialty);
        if(specialty.specialty == 'all'){

            const doctors = await schema.getDoctors();
            console.log('doctors : ',doctors);
            res.json(doctors);

        }
       else{

            const doctors = await schema.getSpecDoctors(specialty.specialty);
            console.log('spec doctors: ',doctors);
            res.json(doctors);


        }



    }catch(error){

        console.log(error);
    }




})
router.post('/:phenicsId/updateSchedule',authenticateToken,adminAuth,(req,res)=>{


const formData = req.body;

if (formData.FromToMode === 'FT'){
    //console.log('form Data: ',formData.schedFromT);
    console.log('reached inside ft mode')
const  [hour,minute] = formData.schedFromT.split(':');
const [Lhour,Lminute] = formData.schedToT.split(':');
console.log(formData.isWeekendChecked)
console.log(formData.breakScheduleFromTime)
console.log(formData.breakScheduleToTime)
//console.log('hour: ',hour,' minute: ',minute);
const startDate = moment.tz(formData.schedFromD,'Asia/Beirut');
const endDate = moment.tz(formData.schedToD,'Asia/Beirut');
//const testdate = moment.tz(formData.schedFromD,'Asia/Beirut');

console.log('startdate: ',startDate)
console.log('end date: ',endDate)
//console.log(testdate);
    //    const startTime = startDate.clone(); 
     //  startTime.hour(hour).minute(minute);
     //  console.log('start Time: ',startTime);

     // const endTime = startDate.clone();
    //   endTime.hour(Lhour).minute(Lminute);

    //   console.log('end Time: ',endTime);
      console.log(formData.selectDoctor);
   const timeInterval = formData.gapNumber; // 30 minutes
    //const timeSlots = [];

    for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'days')) {

        console.log('inside for loop')
        
        const startTime = date.clone().hour(hour).minute(minute);
        const endTime = date.clone().hour(Lhour).minute(Lminute);
        console.log('start time: ',startTime)
        console.log('end time: ',endTime)
if(formData.isWeekendChecked){        
    if(date.format('dddd').includes('Saturday') || date.format('dddd').includes('Sunday')){

            console.log('reached inside if')
            continue;
        }
    }

        const timeSlots = [];
        if(!formData.selectedDates.includes(date.format('YYYY-MM-DD'))){
        for (let time = startTime.clone(); time.isBefore(endTime); time.add(timeInterval, 'minutes')) {
            console.log(time)
            if(time.format('HH:mm')>= formData.breakScheduleFromTime && time.format('HH:mm')<formData.breakScheduleToTime){

                console.log('reached inside time if')
                continue

            }
            timeSlots.push(time.format('HH:mm A'));
            //console.log(time.toDate().toLocaleDateString());
            schema.createAppointment(time.toDate(), date.toDate(),null,formData.selectDoctor,formData.status)
        }
    }
        console.log('Current Date:', date.format('YYYY-MM-DD'));
        console.log('Time Slots:', timeSlots);

      //  allTimeSlots[date.format('YYYY-MM-DD')] = timeSlots;
    }
    res.json({message:'Schedule Updated Successfully'})
}else if(formData.FromToMode === 'MD'){



    const dates = formData.dateArr;
console.log(formData.selectDoctor);

    const  [hour,minute] = formData.schedFromT.split(':');
    const [Lhour,Lminute] = formData.schedToT.split(':');
    //console.log('hour: ',hour,' minute: ',minute);
   
    
    const timeInterval = formData.gapNumber; // 30 minutes
        //const timeSlots = [];

    dates.forEach(dateString => { 

        const startDate = moment.tz(dateString,'Asia/Beirut');
        //const endDate = moment.tz(formData.schedToD,'Asia/Beirut');
        const startTime = startDate.clone().hour(hour).minute(minute);
        const endTime = startDate.clone().hour(Lhour).minute(Lminute);



       
    
        const timeSlots = [];

        for (let time = startTime.clone(); time.isBefore(endTime); time.add(timeInterval, 'minutes')) {

            if(time.format('HH:mm')>= formData.breakScheduleFromTime && time.format('HH:mm')<formData.breakScheduleToTime){

                console.log('reached inside time if')
                continue

            }
            timeSlots.push(time.format('HH:mm A'));
            //console.log(time.toDate().toLocaleDateString());
            
            schema.createAppointment(time.toDate(), startDate.toDate(),null,formData.selectDoctor,formData.status)
           // console.log(formData.selectDoctor);
        }

       // console.log('Current Date:', dateString.format('YYYY-MM-DD'));
       console.log(dateString);
        console.log('Time Slots:', timeSlots);


    })

res.json({message:'Schedule Updated Successfully'})




}else if(formData.FromToMode === 'W'){


    const fromDate = moment.tz(formData.schedFromD, 'Asia/Beirut');
    console.log('from date: ',fromDate);
    const toDate = moment.tz(formData.schedToD, 'Asia/Beirut');
    console.log('to date',toDate);
    const [hour, minute] = formData.schedFromT.split(':');
    const [Lhour, Lminute] = formData.schedToT.split(':');
    const timeInterval = formData.gapNumber;

    let currentDate = fromDate.clone();

    while (currentDate.isBefore(toDate) || currentDate.isSame(toDate, 'day')) {
        console.log('reached while loop');
        console.log(currentDate.format('dddd'));
        if (formData.selectedDays.includes(currentDate.format('dddd'))) {

            console.log('reached if inside while loop')
            const startTime = currentDate.clone().hour(hour).minute(minute);
            const endTime = currentDate.clone().hour(Lhour).minute(Lminute);
            const timeSlots = [];

            for (let time = startTime.clone(); time.isBefore(endTime); time.add(timeInterval, 'minutes')) {
                console.log('reached for loop inside if and while');
                if(time.format('HH:mm')>= formData.breakScheduleFromTime && time.format('HH:mm')<formData.breakScheduleToTime){

                    console.log('reached inside time if')
                    continue
    
                }
                timeSlots.push(time.format('HH:mm A'));
                // Create appointment
                schema.createAppointment(time.toDate(), currentDate.toDate(), null, formData.selectDoctor,formData.status);
            }
        }
        currentDate.add(1, 'day');
    }

    console.log('Appointments created for selected days of the week within the date range.');
    res.json({message:'Schedule Updated Successfully'})
}


    

});

router.get('/medical/:phenicsId',authenticateToken,adminAuth,(req,res)=>{

    res.sendFile(path.join(__dirname,'..','index.html'));


})
router.delete('/api/appointmentDelete', async(req,res)=>{

    const formData= req.body;
    console.log(formData)
appointmentId = formData.appointmentId
console.log(appointmentId)

//console.log('booked: ',appointmentId.appointmentId);

   // console.log('reached serverpart', appointmentId)
    if (Array.isArray(appointmentId)){

        try{

       //  await schema.deleteAppointments(appointmentId.appointmentId)
       appointmentId.forEach(async ({appointmentId, isBooked})=>{

        if(isBooked){
        
          try {
        let appointment = await schema.appointmentModel.findOne({ _id: appointmentId });

        if (appointment) {
            console.log('Appointment details:', appointment);
            appointment = appointment.toObject()
            appointment.reason = formData.reason;
            console.log('app with reason: ',appointment)
            await schema.deletedAppModel.insertMany([appointment]); // Convert Mongoose documents to plain objects



            
            console.log('Appointments copied to deletedApp successfully');
        } else {
            console.log('No appointment found with the given ID');
        }
    } catch (error) {
        console.error('Error finding appointment:', error);
    }
        
        try{

            const result = await schema.appointmentModel.findByIdAndDelete(appointmentId);
            if(result){


              //  res.status(200).json({ message: 'Appointment deleted successfully' });
            } else {
              //  res.status(404).json({ message: 'Appointment not found' });
            }
          
        }catch(error){

            console.error(error);
        }
        
        
        
        }else{
        

            try{

                const result = await schema.appointmentModel.findByIdAndDelete(appointmentId);
                if(result){
    
               
                } else {
                   // res.status(404).json({ message: 'Appointment not found' });
                }
              
            }catch(error){
    
                console.error(error);
            }
            
            
        }
       
                console.log(appointmentId," ",isBooked)
        
        
        
        })

        
          

        }catch(error){

            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Appointment deleted successfully' });


    }else{

        console.log('hi frome else');
    
    try {
        if(appointmentId.isBooked){


            try {
                let appointment = await schema.appointmentModel.findOne({ _id: appointmentId.appointmentId });
                if (appointment) {
                    console.log('Appointment details:', appointment);
                    appointment = appointment.toObject()
                    appointment.reason = formData.reason;
                    console.log('appointment with reason: ',appointment)
                    await schema.deletedAppModel.insertMany([appointment]); // Convert Mongoose documents to plain objects
                    
                    console.log('Appointments copied to deletedApp successfully');
                } else {
                    console.log('No appointment found with the given ID');
                }
            } catch (error) {
                console.error('Error finding appointment:', error);
            }
            

            try{

                const result = await schema.appointmentModel.findByIdAndDelete(appointmentId.appointmentId);
                if(result){
    
                    res.status(200).json({ message: 'Appointment deleted successfully' });
                } else {
                   res.status(404).json({ message: 'Appointment not found' });
                }
              
            }catch(error){
    
                console.error(error);
            }
            
            



        }
        else{
        console.log(appointmentId);
        const result = await schema.appointmentModel.findByIdAndDelete(appointmentId.appointmentId);

        if (result) {
            res.status(200).json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



})

router.post('/:phenicsId/api/booking-appointment', async(req,res)=>{

const formData = req.body
    console.log(formData);

    try{
        console.log('app id from serv: ',formData.appointmentId)
        const appointment = await schema.appointmentModel.findById(formData.appointmentId);
     if(!appointment){

        res.status(404).json({ message: 'Appointment not found' });
      return;

     }
     console.log('appointment from serv: ',appointment)

    const existingAppointment = await schema.appointmentModel.findOne({
        doctor_id: appointment.doctor_id,
        date: appointment.date,
        patient_id: Number(formData.phenicsId)
    });
    if(existingAppointment){

        console.log('inside existing app');

        res.status(500).json({message: 'Appointment for this Patient already exists on the same date for this doctor'})
        return;
        //onsole.log('reached here');
     
    }

   const result = await schema.patientModel.findById(formData.phenicsId)
    if(result){

 
        if(result.file_number != formData.fileNumber){
            res.status(404).json({message:'file Number written is not the same as file Number of the patient in Account'})

        }
        else{
      
       


        
         appointment.patient_id = Number(formData.phenicsId)
         appointment.bookedByAdmin = true
         await appointment.save();
         res.json(appointment);


  
    }


    }else{


const appointment = await schema.appointmentModel.findById(formData.appointmentId)
if(appointment){


    if(formData.newPatient){

        
    console.log('reached new patient');
       const result =  await schema.createNewtempPatient(formData.firstName,formData.lastName,formData.dob,Number(formData.phoneNumber),formData.newPatient,formData.nationality)
       console.log('reached after function');
        appointment.patient_id= result._id;
        appointment.bookedByAdmin = true
        
        
       await appointment.save();
        console.log('reached after saving appointment');
        res.json(appointment);
        
     
        }else{

            const patientTemp = await schema.tempPatientModel.findById(formData.phenicsId)
            if(patientTemp){

                console.log('reached inside if patient temp found')
                appointment.patient_id = patientTemp._id
                appointment.bookedByAdmin=true;
                await appointment.save();
                res.json(appointment)
            }
            else{
                console.log('reached inside if patient temp NOT found')
                const tempPatient =  await schema.createTempPatient(formData.firstName,formData.lastName,formData.dob,formData.fileNumber,formData.phoneNumber,formData.phenicsId,null,null,false,formData.nationality)
                console.log('temp patient: ', tempPatient);
                 appointment.patient_id = tempPatient._id
                 appointment.bookedByAdmin = true
                 await appointment.save();
                 console.log('appointment: ',appointment)
                 res.json(appointment);
            }

        

        }

}else{

    res.status(400).json({message:'Appointment Not found'})
}



    }

}catch(error){

    
}

    





})
router.post('/api/cancelAppointmentAdmin',async(req,res)=>{


    const appointmentId=req.body
    const appointment = await schema.appointmentModel.findById(appointmentId.appointmentId)
    appointment.Urgent = false;
  
    //const appointmentDeleted = await schema.deletedAppModel.findById(appointmentId.appointmentId)
   // appointment.bookedByAdmin=false
   // await appointment.save();

    const result = await schema.createCanceledApp(appointment.time,appointment.date,appointment.patient_id,appointment.doctor_id,appointment._id);

    console.log('result: ',result);

    if(!result){

       return res.status(500).json ({message:'Resolve previous patient association with this appointment before canceling it'})

    }
    else{
        console.log('reached inside else of result')
        //await schema.deletedAppModel.insertMany([appointment.toObject()]);
        res.json(appointment);

    }

    console.log('reached server part ',appointmentId);

 



})
router.post('/api/searchPatient',async(req,res)=>{

    const { phenicsId, Achecked } = req.body;
   // console.log(formData)
    //console.log('reached server part',formData.phenicsId)
  

    try{

        let patient;
   

    if(!Achecked){

        patient = await schema.tempPatientModel.findById(phenicsId);
   


    }else{

    patient = await schema.patientModel.findById(phenicsId);
    }
        if(patient){
            res.json(patient)
        }else{

            res.status(404).json({message:'Patient Not Found'});
            return;
        }

    
}catch(error){

    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });

}

});
router.post('/getPatient/:phenicsId',async(req,res)=>{


    console.log('reached server for patient');
    const appointment = req.body
    console.log(appointment)
  if(appointment.patient_id){
    if(!(typeof appointment.patient_id==="number"))
    {
        console.log('hi inside if from serv')
        if(appointment.patient_id.indexOf("temp") !== - 1){
        const patient = await schema.NewtempPatientModal.findById(appointment.patient_id)
        res.json(patient)
        return
    }
}

    else{

        console.log('reached else in server')
        const patient = await schema.tempPatientModel.findById(appointment.patient_id)
        console.log('patient in temp modal: ',patient)

        if(!patient){

            console.log('patient id: ',appointment.patient_id)
            const patient = await schema.patientModel.findById(appointment.patient_id)
            console.log('patient in modal: ',patient)

            if(!patient){

                res.status(500).json({message:'Patient not Found'})
                return;
            }
            res.json(patient)
            return;
        }
        res.json(patient)


    }
}

})

router.post('/api/cancelSelected',async(req,res)=>{

    const {appointmentId} = req.body;


    console.log('app from serv: ', appointmentId)

try{
    let appointment

    appointmentId.forEach(async ({appointmentId, isBooked})=>{

        if(isBooked){
             appointment = await schema.appointmentModel.findById(appointmentId)
             await schema.createCanceledApp(appointment.time,appointment.date,appointment.patient_id,appointment.doctor_id,appointmentId)


           await schema.cancelAppointment(appointmentId);
           
         
        }


      


    })
    res.json({message: 'Appointments Canceled Successfully'})

}catch(error){

    console.error(error)
    res.status(404).json = {message: 'error canceling appointments'}
    
}

})

router.post('/api/booking-urgent-appointment',async (req,res)=>{

    const formData = req.body
    console.log(formData);
   

    try{

     

    newDate = new Date(formData.selectedDate)
   // console.log(newDate)
   const momentDate = moment.tz(newDate,'Asia/Beirut');
   console.log(momentDate)
   const  [hour,minute] = formData.urgentTime.split(':');

 const appTime= momentDate.clone().hour(hour).minute(minute);
 console.log(appTime);
 const existingAppointment = await schema.appointmentModel.findOne({
    doctor_id: Number(formData.doctorId),
    date: momentDate.toDate(),
    patient_id: Number(formData.phenicsId)
});
if(existingAppointment){

    console.log('inside existing app');

    res.status(500).json({message: 'Appointment for this Patient already exists on the same date for this doctor'})
    return;
    //onsole.log('reached here');
 
}

const result = await schema.patientModel.findById(formData.phenicsId)
    if(result){
console.log('reached inside if is result')
 
        if(result.file_number != formData.fileNumber){
            res.status(404).json({message:'file Number written is not the same as file Number of the patient in Account'})

        }
        else{
      
       


        
            const UrgentAppointment = await schema.createAppointment(appTime.toDate(),momentDate.toDate(),Number(formData.phenicsId),formData.doctorId)
            UrgentAppointment.Urgent = true;
            UrgentAppointment.bookedByAdmin = true;
            await UrgentAppointment.save();
            console.log('appointment: ',UrgentAppointment)
    
            res.json({message: 'Urgent Appointment Added Successfully'});
    

  
    }



    }else{

        const UrgentAppointment = await schema.createAppointment(appTime.toDate(),momentDate.toDate(),Number(formData.phenicsId),formData.doctorId)
        UrgentAppointment.Urgent = true;
        UrgentAppointment.bookedByAdmin = true;
        await UrgentAppointment.save();
console.log('reached inside else of result')
        
        
            if(formData.newPatient){

               
                
            console.log('reached new patient');
               const result =  await schema.createNewtempPatient(formData.firstName,formData.lastName,formData.dob,Number(formData.phoneNumber),formData.newPatient,formData.nationality)
               console.log('reached after function');
                UrgentAppointment.patient_id= result._id;
               UrgentAppointment.bookedByAdmin = true
                
                
               await UrgentAppointment.save();
                console.log('reached after saving appointment');
                res.json({message: 'Urgent Appointment Added Successfully'});
                
             
                }else{
                  console.log('reached inside if not new')
        
                    const patientTemp = await schema.tempPatientModel.findById(formData.phenicsId)
                    if(patientTemp){
        
                      
                        console.log('reached inside if patient temp found')
                        UrgentAppointment.patient_id = patientTemp._id
                       UrgentAppointment.bookedByAdmin=true;
                        await UrgentAppointment.save();
                        console.log('appointment: ',UrgentAppointment)
                        res.json({message: 'Urgent Appointment Added Successfully'});
                    }
                    else{

                        console.log('reached inside if patient temp NOT found')
                        const tempPatient =  await schema.createTempPatient(formData.firstName,formData.lastName,formData.dob,formData.fileNumber,formData.phoneNumber,formData.phenicsId,null,null,false,formData.nationality)
                        console.log('temp patient: ', tempPatient);
                         UrgentAppointment.patient_id = tempPatient._id
                         UrgentAppointment.bookedByAdmin = true
                         await UrgentAppointment.save();
                         console.log('appointment: ',UrgentAppointment)
                         res.json({message: 'Urgent Appointment Added Successfully'});
                    }
        
                
        
                }
  
        
        
        
            }




        

    }catch(error){

        console.error(error)
        res.status(404).json({message: 'Error Adding Urgent Appointment'})

    }
 


})

router.delete('/api/:phenicsId/deleteAppointments',adminAuth,async(req,res)=>{


const formData=req.body
try{
console.log('reached server')
console.log(formData.FromToMode)

if (formData.FromToMode === 'FT'){//console.log('form Data: ',formData.schedFromT);
   // const  [hour,minute] = formData.schedFromT.split(':');
    //const [Lhour,Lminute] = formData.schedToT.split(':');
   console.log('from time: ',formData.schedFromT)

    //console.log('hour: ',hour,' minute: ',minute);
   const startDate = moment.tz(formData.schedFromD,'Asia/Beirut');
  const endDate = moment.tz(formData.schedToD,'Asia/Beirut');
  
   const startDateUp = startDate.toDate()
   const endDateUp = endDate.toDate()
    console.log('start date: ',startDate)
    //console.log(startDate.toDate())
    //console.log(endDate)

    //formData.selectedDates = formData.selectedDates.map(date => moment(date, 'YYYY-MM-DD'));
  
    formData.selectedDates = formData.selectedDates.map(date => moment(date, 'YYYY-MM-DD').toDate());



    console.log('selected dates: ',formData.selectedDates)
    //const testdate = moment.tz(formData.schedFromD,'Asia/Beirut');
    //console.log(testdate);
        //    const startTime = startDate.clone(); 
         //  startTime.hour(hour).minute(minute);
         //  console.log('start Time: ',startTime);
    
         // const endTime = startDate.clone();
        //   endTime.hour(Lhour).minute(Lminute);
    
        //   console.log('end Time: ',endTime);
          console.log(formData.selectDoctor);
      
        //const timeSlots = [];
  

  /*const appointment= await schema.appointmentModel.find({

        doctor_id: formData.selectDoctor,
        date:{
            $gte: startDate,
            $lte: endDate,
           $nin: formData.selectedDates,
        },

    })
    if(appointment){

        console.log('hello: ',appointment)
    }*/


    if(!formData.schedFromT || !formData.schedToT)
    {
        const appointment =await schema.appointmentModel.find({

            doctor_id: formData.selectDoctor,
            date:{

                $gte: startDateUp,
                $lte: endDateUp,
                $nin: formData.selectedDates
            }

        })
        appointment.forEach( appointment =>{

            if(appointment.patient_id){
                console.log('inside if: ',appointment)
              schema.deletedAppModel.insertMany([appointment.toObject()])

            }



        })

        console.log('Appointments: ',appointment)
       await schema.appointmentModel.deleteMany({

            doctor_id: formData.selectDoctor,
            date:{

                $gte: startDateUp,
                $lte: endDateUp,
                $nin: formData.selectedDates
            }
        })
    }else{
        const  [hour,minute] = formData.schedFromT.split(':');
        const [Lhour,Lminute] = formData.schedToT.split(':');

        for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'days')) {

            console.log('inside for loop')
            
            const startTime = date.clone().hour(hour).minute(minute);
            const endTime = date.clone().hour(Lhour).minute(Lminute);
            
            const appointment = await schema.appointmentModel.find({

                doctor_id:formData.selectDoctor,
    
                time:{
    
                    $gte:startTime.toDate(),
                    $lte:endTime.toDate(),
                   
                    
                },
                date:{
    
                    $nin: formData.selectedDates
    
                    
                }
    
            })

            if(appointment.patient_id){

                appointment.forEach(appointment=>{

                    schema.deletedAppModel.insertMany([appointment.toObject()])
                    


                })

            }
    
        await schema.appointmentModel.deleteMany({

            doctor_id:formData.selectDoctor,

            time:{

                $gte:startTime.toDate(),
                $lte:endTime.toDate(),
               
                
            },
            date:{

                $nin: formData.selectedDates

                
            }

        })

    }

    }


          res.json({message:'Successfully Deleted Appointments'})

   
       
        
     } else if(formData.FromToMode === 'MD'){
    
    
    
    let dates = formData.dateArr;



       dates = dates.map(date => moment(date,'YYYY-MM-DD').toDate());


        console.log('dates: ',dates)
        
        if(!formData.schedFromT || !formData.schedToT){

        await schema.appointmentModel.deleteMany({
            doctor_id:formData.selectDoctor,
         date: {
            $in: dates,
         }
        })
    }else{
        let dates = formData.dateArr;
        const  [hour,minute] = formData.schedFromT.split(':');
        const [Lhour,Lminute] = formData.schedToT.split(':');


        dates = dates.map(date => moment(date,'YYYY-MM-DD'));
        


        dates.forEach(async date=>{

            const startTime = date.clone().hour(hour).minute(minute);
            const endTime = date.clone().hour(Lhour).minute(Lminute);
            
            await schema.appointmentModel.deleteMany({
                doctor_id:formData.selectDoctor,
                
                
                time: {
                   $gte: startTime.toDate(),
                   $lte:endTime.toDate()
                }
               })
    

            
        })
     
    }
               

         

        res.json({message:'Successfully Deleted Appointments'})
        
    
    }else if(formData.FromToMode === 'W'){
    
    
        const fromDate = moment.tz(formData.schedFromD, 'Asia/Beirut');
        console.log('from date: ',fromDate);
        const toDate = moment.tz(formData.schedToD, 'Asia/Beirut');
        console.log('to date',toDate);
        const [hour, minute] = formData.schedFromT.split(':');
        const [Lhour, Lminute] = formData.schedToT.split(':');
        const timeInterval = formData.gapNumber;
    
        let currentDate = fromDate.clone();
    
        while (currentDate.isBefore(toDate) || currentDate.isSame(toDate, 'day')) {
            console.log('reached while loop');
            console.log(currentDate.format('dddd'));
            if (formData.selectedDays.includes(currentDate.format('dddd'))) {
    
                console.log('reached if inside while loop')

                if(!formData.schedFromT || !formData.schedToT){

                    await schema.appointmentModel.deleteMany({

                        doctor_id:formData.selectDoctor,
                        date: currentDate.toDate(),
                    


                    })




                }else{
                    const startTime = currentDate.clone().hour(hour).minute(minute);
                    const endTime = currentDate.clone().hour(Lhour).minute(Lminute);


                    await schema.appointmentModel.deleteMany({

                        doctor_id: formData.selectDoctor,
                        time:{

                            $gte: startTime.toDate(),
                            $lte: endTime.toDate(),

                        }

                    })
                    



                }

               // const startTime = currentDate.clone().hour(hour).minute(minute);
               // const endTime = currentDate.clone().hour(Lhour).minute(Lminute);
               // const timeSlots = [];
    
              
            }
            currentDate.add(1, 'day');
        }

    res.json({message:'Successfully Deleted Appointments'})
        console.log('Appointments DELETED for selected days of the week within the date range.');
    
    }
  
    
}catch(error){

console.error(error)
res.status(404).json({message:'failed to delete appointments'})
}
     


})

router.post('/:phenicsId/api/updateAppointmentStatus',adminAuth,async(req,res)=>{

const {id, status} = req.body

console.log('id: ',id)
console.log('status: ',status )

try{


    const appointment = await schema.appointmentModel.findById(id)

    if(appointment){
if(status === 'draft'){
        appointment.status = 'draft'
        await appointment.save()
        res.json({message:'Updated Status to Draft Successfully'})
}else{

    appointment.status = 'publish'
    await appointment.save()
    res.json({message:'Updated Status to Publish Successfully'})
}

    }else{

        res.json({message:'Appointment Not Found'})
    }



}catch(error){

    console.error(error)
    res.json({message:'Failed to Update Status'})

}




})


router.post('/:phenicsId/update-status',adminAuth,(req,res)=>{

const {ids, status}= req.body;

console.log('ids: ',ids, ' status: ',status)

try{




ids.forEach(async appointmentId =>{

  const appointment =  await schema.appointmentModel.findById(appointmentId)
    if (appointment){

        if(status == 'draft'){

            appointment.status = 'draft'
            await appointment.save()


        }else{

            appointment.status = 'publish'
            await appointment.save()

        }
        
    }else{

        res.status(404).json({message:'Appointment Not Found'})
        return;
    }

})
res.json({message:'Appointments Switched Successfully'})
}catch(error){

    console.error(error)

 res.json({message: 'Error Switching to Draft/Publish'})

}




})
router.get('/:phenicsId/searchPatient',adminAuth,(req,res)=>{

    res.sendFile(path.join(__dirname,'..','SearchPatient.html'));


})
router.post('/:phenicsId/searchPatient',adminAuth, async(req,res)=>{

const formData = req.body

console.log(formData)

let query = {};

if (formData.patientId) {
    query._id = formData.patientId;
}
if (formData.fileNumber) {
    query.file_number = formData.fileNumber;
}
if (formData.firstName) {
    query.first_name = { $regex: formData.firstName, $options: 'i' }; // Case-insensitive partial match
}
if (formData.lastName) {
    query.last_name = { $regex: formData.lastName, $options: 'i' }; // Case-insensitive partial match
}
console.log(query)

if(formData.selectOption === 'Karagheusian'){


    try {
        const patients = await schema.patientModel.find(query)
  console.log(patients)
            let formData ={patients: patients, tableLocation: 'Karagheusian'}
            res.json(formData);

  
       
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
    
}else{

    try {
        const patients = await schema.tempPatientModel.find(query)
        let formData ={patients: patients, tableLocation: 'Website'}
        console.log(patients)
        res.status(200).json(formData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }


    
}


})

router.post('/:phenicsId/viewInformation',adminAuth, async (req,res)=>{

    const formData = req.body

    console.log(formData)
   try{

        if(formData.tableLocation === 'Karagheusian'){
            console.log('reached inside if')

            const patient = await schema.patientModel.findById(formData.patientId)
            if(patient){
console.log(patient)
                res.json(patient)
            }
            else{
                res.status(404).json({message:'Patient Not Found'})
            }


        }else{

            const patient = await schema.tempPatientModel.findById(formData.patientId)
            if(patient){

                res.json(patient)
            }
            else{
                res.status(404).json({message:'Patient Not Found'})
            }


        }
    


    }catch(error){

        console.error(error)
        res.status(500).json({message:'View Information Failed'})

    }


})

router.post('/:phenicsId/editPatient',adminAuth,async(req,res)=>{

const formData = req.body;

console.log(formData)
console.log(formData.fileNumberSec)
try{let patient
    console.log('table location: ',formData.tableLocation)
if(formData.tableLocation === 'Karagheusian'){
console.log('reached inside kara if')
console.log('fileNumber: ',formData.fileNumberSec)
patient = await schema.patientModel.findById(formData.patientId)
}else{

    patient = await schema.tempPatientModel.findById(formData.patientId)
}
if(patient){

    patient.file_number = formData.fileNumberSec
    patient.first_name=formData.firstName
    patient.father_name = formData.fatherName
    patient.last_name = formData.lastName
    patient.dob = formData.dob
    patient.phone_number=formData.phoneNumber
    patient.nationality = formData.nationality
    await patient.save()
res.json({message: 'Successfully Updated Patient Information'})
}
else{

    res.json({message: 'Patient Not Found'})
}
}catch(error){

    console.error(error)
    res.json({message: 'Failed to Update Patient Information'})
}





})

router.post('/:phenicsId/viewAppointments',adminAuth,async(req,res)=>{


const formData = req.body

console.log(formData)

try {
    const appointments = await schema.appointmentModel.find({ patient_id: Number(formData.patientId) });
    console.log(appointments);

    if (appointments.length > 0) {
        // Use Promise.all to handle all asynchronous operations
        const appointmentsWithDoctorNames = await Promise.all(
            appointments.map(async (appointment) => {
                const doctor = await schema.doctorModel.findById(appointment.doctor_id);
                if (doctor) {
                    // Add the doctor's name to the appointment object
                    return { ...appointment._doc, doctorName: doctor.name };
                } else {
                    // Add a fallback name if the doctor is not found
                    return { ...appointment._doc, doctorName: 'Unknown Doctor' };
                }
            })
        );

        console.log(appointmentsWithDoctorNames);
        res.json(appointmentsWithDoctorNames);
    } else {
        res.status(404).json({ message: `This patient doesn't have appointments` });
    }
} catch (error) {
    res.json({ message: 'Failed to fetch Appointments' });
    console.error(error);
}

})

router.delete('/:phenicsId/deletePatient',adminAuth,async(req,res)=>{

const formData = req.body
console.log(formData)

try{
    if(formData.tableLocation ==='Karagheusian'){
        console.log('inside if')
        await schema.patientModel.findByIdAndDelete(Number(formData.patientId))
        res.json({message:'Patient Deleted Successfully'})
    }else{
    
        await schema.tempPatientModel.findByIdAndDelete(Number(formData.patientId))
        res.json({message:'Patient Deleted Successfully'})
    }

}catch(error){
res.status(404).json({message:'error deleting patient'})

}


})

router.get('/:phenicsId/fetchCountries',adminAuth,async(req,res)=>{

    const countries = CountryList.getData();

    res.json(countries)


})

router.get('/:phenicsId/resolvePatient',adminAuth,(req,res)=>{

console.log('reached route')
res.sendFile(path.join(__dirname,'..','resolvePatient.html'));

})

router.get('/:phenicsId/getDoctors',adminAuth, async(req,res)=>{


    try{

        const doctors = await schema.doctorModel.find({});
        console.log(doctors)
        res.json(doctors)


    }catch(error){

        console.error(error)
        res.status(500).json({message:'error getting doctors from database'})

    }


})
router.post('/:phenicsId/filterPatients',adminAuth,async(req,res)=>{

  const filterData = req.body

  const newStart = moment.tz(filterData.startDate,'Asia/Beirut')
  const newEnd = moment.tz(filterData.endDate,'Asia/Beirut')
  console.log(filterData)
    try{

        let query = {};

if (filterData.startDate && filterData.endDate) {
    query.date = {$gte: newStart.toDate(),
                    $lte: newEnd.toDate()
                }
}



if(filterData.doctor!=='all'){

    query.doctor_id = filterData.doctor
}else{

   
    filterData.doctor=''
}

console.log(query)
      
        if(filterData.activeTab === 'deleted'){
console.log('inside if')
console.log('query: ',query)
            const patients = await schema.deletedAppModel.find(query)
            const patientIds = patients.map(patient => patient.patient_id);
            const doctorIds = patients.map(patient=>patient.doctor_id)

console.log('file number:',filterData.fileNumber)

            console.log(doctorIds)
            console.log(patientIds);
            console.log('patients: ',patients)

     
            const patientData = await getPatientDataAggregation(patientIds,Number(filterData.fileNumber));
            console.log('patient data: ',patientData)

      // Combine the results
      let doctors
      if(filterData.doctor === 'all'){
    doctors = await schema.doctorModel.find({ _id: { $in: filterData.doctor } }).select('name _id');
    }
    else{

        doctors = await schema.doctorModel.find({}).select('name _id');

    }
      console.log('doctors: ',doctors)

      // Create a map of doctor IDs to names
      const doctorMap = doctors.reduce((map, doctor) => {
        map[doctor._id] = doctor.name;
        return map;
      }, {});

      // Combine the results
      const filteredPatients = patients.filter(patient => 
        patientData.some(data => data._id === patient.patient_id)
    );
    
    // Combine the results
    const combinedResults = filteredPatients.map(patient => {
        const patientInfo = patientData.find(data => data._id === patient.patient_id);
        const doctorName = doctorMap[patient.doctor_id] || 'Unknown';
    
        return {
            ...patientInfo, // Includes patient data from collections
            appointmentDate: patient.date, // Includes appointment date
            reason: patient.reason,
            doctorName: doctorName ,// Includes doctor name
            appointmentId: patient._id,
            resolve: patient.resolve
        };
    });
    console.log(combinedResults)
      res.json(combinedResults)



        }else{


            
            console.log('inside else')
console.log('query: ',query)
            const patients = await schema.canceledAppModal.find(query)

           
            
            const patientIds = patients.map(patient => patient.patient_id);
            const doctorIds = patients.map(patient=>patient.doctor_id)



            console.log(doctorIds)
            console.log(patientIds);
            //console.log('patients: ',patients)

     
            const patientData = await getPatientDataAggregation(patientIds,Number(filterData.fileNumber));
            console.log('patient data: ',patientData)

            console.log('patient data: ',patientData)

      // Combine the results
      let doctors
      if(filterData.doctor === 'all'){

    doctors = await schema.doctorModel.find({ _id: { $in: filterData.doctor } }).select('name _id');
    }
    else{

        doctors = await schema.doctorModel.find({}).select('name _id');



    }
      console.log('doctors: ',doctors)

      // Create a map of doctor IDs to names
      const doctorMap = doctors.reduce((map, doctor) => {
        map[doctor._id] = doctor.name;
        return map;
      }, {});

      const filteredPatients = patients.filter(patient => 
        patientData.some(data => data._id === patient.patient_id)
    );
    
    // Combine the results
    const combinedResults = filteredPatients.map(patient => {
        const patientInfo = patientData.find(data => data._id === patient.patient_id);
        const doctorName = doctorMap[patient.doctor_id] || 'Unknown';
    
        return {
            ...patientInfo, // Includes patient data from collections
            appointmentDate: patient.date, // Includes appointment date
            reason: patient.reason,
            doctorName: doctorName, // Includes doctor name
            canceledId: patient._id,
            resolve: patient.resolve,
        

        };
    
    });
    console.log('combined res: ',combinedResults)
      res.json(combinedResults)

            



        }



    }catch(error){

        console.error(error)
        res.status(500).json({message: 'Failed to filter the Data from Database'})
    }

})
async function getPatientDataAggregation(patientIds,fileNumber) {
    try {

        console.log('file number from function: ',fileNumber)
      // Convert patientIds to numbers if they are not already
      const numberArray = patientIds
     // fileNumbers = fileNumber.replace(/\s+/g, '');
    //  console.log('file number from function:',fileNumbers)
    let matchCondition={


        _id: { $in: numberArray }, 
    }
    if(fileNumber){

         matchCondition = {
            _id: { $in: numberArray },   // Match on patient IDs
            file_number: Number(fileNumber)     // Match on file number
        };
    }
   
      const results = await schema.patientModel.aggregate([
        {
          $match: matchCondition
         
        },
 
        {
          $unionWith: {
            coll: 'tempPatient',
            pipeline: [
              {
                $match: 
                matchCondition
                  
                
              }
            ]
          }
        },
        {
            $unionWith: {
              coll: 'newTempPatient',
              pipeline: [
                {
                  $match: 
                    matchCondition
                  
                }
              ]
            }
          }
        




      ]);


  
      return results;
    } catch (error) {
      console.error('Error during aggregation:', error);
      throw error;
    }
  }


  router.post('/:phenicsId/ResolvePatient',adminAuth,async(req,res)=>{

    const formData = req.body;

    console.log(formData);

    try{
        
if(formData.activeTab === 'deleted'){

 const resolve = await schema.deletedAppModel.findById(formData.patientData)
        resolve.resolve = formData.resolveStatus;
        await resolve.save();
        res.json(formData.resolveStatus)


}else{
console.log(formData.canceledId)
const resolve = await schema.searchCanceled(formData.canceledId,formData.resolveStatus);
 console.log(resolve)

console.log('inside canceled')

 
        
        res.json(formData.resolveStatus)


}
       



    }catch(error){

        console.error(error)
        res.status(404).json({message:'Error Resolving Patient'})
    }



  })
  
module.exports = router;
    