import Patient from "../models/Patient.js"


const addPatient  = async (req, res) => {
    
    const patient = new Patient(req.body)

    // Set the veterinarian id to the patient
    patient.veterinarian = req.veterinarian._id
    
    try {

        const patientSaved = await patient.save()
        res.json(patientSaved)
        
    } catch (error) {
        console.log(error)
    }
}

const getPatients = async(req, res) => {
    
    const patients = await Patient.find().where('veterinarian').equals(req.veterinarian)
    res.json(patients)
}

const getPatient = async (req, res) =>{

    const { id } = req.params
    const patient = await Patient.findById(id)

    if(!patient) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    // Convert the id to String to be allow to compare the characters
    // If we compare the id's like Object Id's, don't will work it.
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({ msg: 'Acción no válida'})
    }

    res.json({ msg: patient })

}
const updatePatient = async (req, res) => {

    const { id } = req.params
    const patient = await Patient.findById(id)

    if(!patient) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    // Convert te id to String to be allow to compare the characters
    // If we compare the ids like Object Id s, don't will work it.
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({ msg: 'Acción no válida'})
    }


    // Update patient
    patient.name = req.body.name || patient.name
    patient.owner = req.body.owner || patient.owner
    patient.email = req.body.email || patient.email
    patient.symptoms = req.body.symptoms || patient.symptoms
    patient.date = req.body.date || patient.date

    try {   
        const patientUpdated = await patient.save()
        return res.json({ msg: patientUpdated })
    } catch (error) {
        console.log(error)
    }

}
const deletePatient = async (req, res) => {

    const { id } = req.params
    const patient = await Patient.findById(id)

    if(!patient) {
        return res.status(404).json({ msg: 'No encontrado' })
    }

    // Convert te id to String to be allow to compare the characters
    // If we compare the id's like Object Id's, don't will work it.
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()) {
        return res.json({ msg: 'Acción no válida'})
    }

    // Delete Patient
    try {
        await patient.deleteOne()
        res.json({ msg: 'Paciente eliminado'})
    } catch (error) {
        console.log(error)
    }
}

export {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
}