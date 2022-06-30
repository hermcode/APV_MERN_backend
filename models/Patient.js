
import mongoose from "mongoose";

const patientScheme = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    symptoms: {
        type: String,
        required: true
    },
    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinarios'
    } 
}, {
    timestamps: true // createdAt, updatedAt
})

const Patient = mongoose.model('Pacientes', patientScheme)

export default Patient