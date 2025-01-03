const mongoose = require('mongoose');


//schemas and models
const patientSchema = new mongoose.Schema({

    _id:{

        type:Number,
        required: true,
    },
    first_name:{

        type:String,
        required: true,

    },
    last_name:{

        type:String,
        required: true,

    },
    father_name:{

        type:String,
        required: true,
    },
    dob:{

        type:Date,
        required: true,

    },
    file_number:{

    
        type:Number,
        required:false,

    },
    password:{

        type:String,
        required: true,

    },
    phone_number:{

        type: Number,
        required: true,

    },

    relatedDoc:{

        type: Number,
        ref:'doctor',
        required: false,
        


    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    newPatient: {

        type:Boolean,
        default:false,


    },

    nationality: {

        type: String,
        required:true,

    }


    

})

const patientModel = mongoose.model('patientModel',patientSchema,'patient');


const tempPatientSchema = new mongoose.Schema({

    _id:{

        type:Number,
        required: true,
    },
    first_name:{

        type:String,
        required: true,

    },
    last_name:{

        type:String,
        required: true,

    },
    father_name:{

        type:String,
        required: false,
    },
    dob:{

        type:Date,
        required: true,

    },
    file_number:{

    
        type:Number,
        required:false,

    },
    password:{

        type:String,
        required: false,

    },
    phone_number:{

        type: Number,
        required: true,

    },

    relatedDoc:{

        type: Number,
        ref:'doctor',
        required: false,
        


    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    newPatient: {

        type: Boolean,
        required:true,
       default:false,
    },
    nationality:{

        type:String,
        required:true,
    },



})
const tempPatientModel = mongoose.model('tempPatientModel',tempPatientSchema,'tempPatient');


const NewtempPatientSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    dob: { type: String, required: true },
    phone_number: { type: Number, required: true },
    file_number: { type: Number, required: false },
    relatedDoc: {
      type: Number,
      ref: 'doctor',
      required: false,
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    newPatient: {
      type: Boolean,
      required: true,
      default: false,
    },
    nationality:{

        type:String,
        required:true,
    }

  });

  const NewtempPatientModal = mongoose.model('NewtempPatientSchema',NewtempPatientSchema,'newTempPatient');
  async function createNewtempPatient(firstName,lastName,dob,phoneNumber,newPatient,nationality){


    const newTemp = new NewtempPatientModal({
        _id: `temp-${new mongoose.Types.ObjectId()}`,
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        phone_number: phoneNumber,
        file_number: null,
        role: 'user',
       
        newPatient:newPatient,
        nationality,nationality,

      });
    
      await newTemp.save();
      return newTemp;

  }
  
const doctorSchema = new mongoose.Schema({


    _id:{

        type:Number,
        required:true,

    },

    name:{

        type:String,
        required: true,

    },

    desc:{

        type:String,
        required: true,
    },
    specialty:{

        type: String,
        ref:'specialty',
        required:true,

    }
})
const doctorModel = mongoose.model('doctorModel',doctorSchema,'doctor');
async function getDoctors(){
    
    try{
    const doctors = await doctorModel.find({});
  //  console.log('from schema: ',doctors);
    return doctors;

    }catch(error){

        console.log(error);
    }



}
async function getSpecDoctors(specialties){

    try{

        const doctors = await doctorModel.find({specialty: specialties});
        return doctors;
    }catch(error){

        console.log(error);

    }


}
const specialtySchema = new mongoose.Schema({

    _id: { 
        
        type: String,
        required: true, 


    },

   
})

const specialtyModel=mongoose.model('specialtyModel',specialtySchema,'specialty');

async function getSpecialties(){
try{
const specialty = await specialtyModel.find({});
return specialty;
}
catch(error){

    console.log(error);
}



}

const deletedAppSchema = new mongoose.Schema({

    _id:{
        type:Number,
        required:true,
    },
    time:{

        type: Date,
        required: true,

    },
    date:{

        type:Date,
        required:true,

    },
    patient_id:{

        type:mongoose.Schema.Types.Mixed,
        ref:'patient',
        required: false,

    },
    doctor_id:{

        type:Number,
        ref:'doctor',
        required: false,

    },
    Urgent:{

        type:Boolean,
        require:true,
        default: false,

    },
    reason:{

        type:String,
        required:false,
    },
    resolve: {

        type:String,
        required: true,
        enum:['Resolve','Resolved'],
        default:'Resolve'
        
    }



})
const deletedAppModel = mongoose.model("deletedAppModel",deletedAppSchema,"deletedApp");


const canceledAppSchema = new mongoose.Schema({


    
    _id:{
        type:Object,
        required:true,
    },
    time:{

        type: Date,
        required: true,

    },
    date:{

        type:Date,
        required:true,

    },
    patient_id:{

        type:mongoose.Schema.Types.Mixed,
        ref:'patient',
        required: false,

    },
    doctor_id:{

        type:Number,
        ref:'doctor',
        required: false,

    },
    app_id:{

        type:Number,
        ref:'appointment',
        required: true,

    },
    reason:{

        type:String,
        required:false,
    },
    resolve: {

        type:String,
        required: true,
        enum:['Resolve','Resolved'],
        default:'Resolve'
        
    }


})

const canceledAppModal= new mongoose.model('canceledAppModal',canceledAppSchema,'canceledApp');

async function createCanceledApp(time,date,patientid,doctorid,appid){


const canceledAppointment = new canceledAppModal({

    _id: new mongoose.Types.ObjectId(),
    time: time,
    date:date,
    patient_id: patientid,
    doctor_id: doctorid,
    app_id: appid,


})
await canceledAppointment.save();
return canceledAppointment;



}

async function createDeletedApp(appointmentId,time,date,patient_id,doctor_id,Urgent){

    try{
      

        const appointment = new appointmentModel({
            _id: appointmentId,
            time: time,
            date: date,
            patient_id: patient_id,
            doctor_id: doctor_id,
            Urgent: Urgent,
       
        
        });
        await appointment.save();
        return appointment;
    

            


    }
    catch{

    
       // decrementNextSequenceValue('appointment_id');

    }



}




const appointmentSchema = new mongoose.Schema({

        _id: {
            type: Number,
            required: true,

        },
        time:{

            type: Date,
            required: true,

        },
        date:{

            type:Date,
            required:true,

        },
        patient_id:{

            type:mongoose.Schema.Types.Mixed,
            ref:'patient',
            required: false,

        },
        doctor_id:{

            type:Number,
            ref:'doctor',
            required: false,

        },
        bookedByAdmin:{

            type:Boolean,
            required:true,
            default:false
        },
        Urgent:{

            type:Boolean,
            
            default: false,

        },
        status: { type: String, enum: ['draft', 'publish'], default: 'publish' } // New field



        





})
const appointmentModel = mongoose.model("appointmentModel",appointmentSchema,"appointment")



const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});




//inc/dec functions
const Counter = mongoose.model('CounterSchema', counterSchema,'counter');
async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}
async function decrementNextSequenceValue(sequenceName) {
    try {
        const sequenceDocument = await Counter.findByIdAndUpdate(
            sequenceName,
            { $inc: { seq: -1 } }, // Decrementing by 1
            { new: true, upsert: true }
        );
        return sequenceDocument.seq;
    } catch (error) {
        console.error('Error decrementing sequence value:', error);
        throw error; // Re-throwing the error for handling in the catch block where this function is called
    }
}




//Inserting data functions
async function createDoctor(name, desc, specialtyName) {
    try{
    const getSpecialty = await specialtyModel.findOne({ _id: specialtyName });
   if (!getSpecialty) {
    console.log("reached if spec");
      console.log(`Specialty "${specialtyName}" not found`);
 }
    
    const newDoctorId = await getNextSequenceValue('doctor_id');

    const doctor = new doctorModel({
        _id: newDoctorId,
        name: name,
        desc: desc,
        specialty: getSpecialty,
    });
    await doctor.save();
    return doctor;
}
catch(error){

  console.log("an error occured");
  decrementNextSequenceValue('doctor_id');
}

}
async function deleteAppointments(appointmentId){

    try{    

    
        const deletePromises = appointmentId.map(id => appointmentModel.findByIdAndDelete(id));
        const results = await Promise.all(deletePromises);
        results.forEach((result, index) => {
            if (result) {
                console.log(`Appointment with ID ${appointmentId[index]} deleted successfully`);
            } else {
                console.log(`Appointment with ID ${appointmentId[index]} not found`);
            }
        });

    }catch(error){
        throw error
    }



}
/*async function createAppointment(time,date,patient_id,doctor_id, Urgent,){

    try{
        const existingAppointment = await appointmentModel.findOne({
            time: time,
            date: date,
            patient_id: patient_id,
            doctor_id: doctor_id,
          
        });

        if (existingAppointment) {
            console.log('Appointment already exists:', existingAppointment);
            return existingAppointment; // or throw an error, or return a specific value indicating duplicate
        }
        console.log('reached appointment function');
            const getAppId = await getNextSequenceValue('appointment_id');

        const appointment = new appointmentModel({
            _id: getAppId,
            time: time,
            date: date,
            patient_id: patient_id,
            doctor_id: doctor_id,
            bookedByAdmin: false,
       
        
        });
        await appointment.save();
        return appointment;
    

            


    }
    catch{

    
        decrementNextSequenceValue('appointment_id');

    }



}*/


async function createAppointment(time,date,patient_id,doctor_id,status){

    try{
        const existingAppointment = await appointmentModel.findOne({
            time: time,
            date: date,
            patient_id: patient_id,
            doctor_id: doctor_id
        });

        if (existingAppointment) {
            console.log('Appointment already exists:', existingAppointment);
            return existingAppointment; // or throw an error, or return a specific value indicating duplicate
        }
        console.log('reached appointment function');
            const getAppId = await getNextSequenceValue('appointment_id');

        const appointment = new appointmentModel({
            _id: getAppId,
            time: time,
            date: date,
            patient_id: patient_id,
            doctor_id: doctor_id,
            status:status
       
        
        });
        await appointment.save();
        return appointment;
    

            


    }
    catch{

    
        decrementNextSequenceValue('appointment_id');

    }



}














async function cancelAppointment(appointmentId){


    try{

        const updatedDocument = await appointmentModel.findByIdAndUpdate(

            appointmentId,
            {patient_id: null,
            bookedByAdmin: false,
            },
       
            {new:true}



        );
        
        console.log('updatedDocument',updatedDocument);
        return updatedDocument;

    }catch{

        console.error('Error updating document:', error);
    }


}
async function createPatient(firstName, fatherName, lastName, dob, fileNumber, phoneNumber, PhenicsID, password,nationality){
try{


console.log('nationality: ',nationality)
    const checkID = await patientModel.findOne({ _id: PhenicsID });
    if (!checkID) {
     console.log("reached if getID");


        const patient = new patientModel({

            _id: PhenicsID,
            first_name: firstName,
            last_name: lastName,
            father_name: fatherName,
            dob: dob,
            file_number: fileNumber,
            password: password,
            phone_number: phoneNumber,
            role:'user',
            nationality: nationality,




        });
        await patient.save();
       // return patient;





  }
  else{

    console.log('phenics id already found');
  }

}
catch(error){
console.log(error);
return error


}

}

async function createTempPatient(firstName, lastName, dob, fileNumber, phoneNumber, PhenicsID, password,fatherName,newPatient,nationality){
    try{
    
    //    console.log(firstName,' ',lastName,' ',dob,' ',fileNumber,' ',phoneNumber,' ',PhenicsID,' ',password,' ',fatherName,' ',newPatient,' ',appointmentId)
    
    
        const checkID = await tempPatientModel.findById({ _id: PhenicsID });
        if (!checkID) {
         console.log("reached if getID");
    
    
            const patient = new tempPatientModel({
    
                _id: PhenicsID,
                first_name: firstName,
                last_name: lastName,
                father_name: fatherName,
                dob: dob,
                file_number: fileNumber,
                password: password,
                phone_number: phoneNumber,
           
                newPatient: newPatient,
               
                role:'user',
                nationality:nationality,
    
    
    
    
            });
            await patient.save();
            return patient;
    
    
    
    
    
      }
      else{
          return checkID;
    
       //console.log('phenics id not found');
      }
    
    }
    catch(error){
    console.log(error);
    
    
    }
    
    }




async function searchCanceled(canceledId,resolveStatus){

    try{

       // console.log(new mongoose.Types.ObjectId('66cc601aafa484190d022cff'))


        const resolve = await canceledAppModal.findById(new mongoose.Types.ObjectId(canceledId))
        console.log('resolve: ',resolve)
        resolve.resolve = resolveStatus;
        await resolve.save();

        return resolve;

    }catch(error){

        console.error(error);
    }

}


module.exports ={patientModel, doctorModel, appointmentModel, specialtySchema, Counter, createDoctor, createAppointment, createPatient,cancelAppointment,getSpecialties,getDoctors,getSpecDoctors,deleteAppointments,createDeletedApp,deletedAppModel,tempPatientModel,createTempPatient,NewtempPatientModal,createNewtempPatient,canceledAppModal, createCanceledApp, searchCanceled};