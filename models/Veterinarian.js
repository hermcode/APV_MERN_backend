
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import idGenerator from "../helpers/idGenerator.js";

// Veterinarian Object Model
const veterinarianSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telephone: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
        trim: true
    },
    token: {
        type: String,
        default: idGenerator()
    },
    confirmed: {
        type: Boolean,
        default: false
    }

}) 

veterinarianSchema.pre('save', async function(next) {

    // No hashear el password si los datos se modifican
    if(!this.isModified('password')) {
        next()
    }

    // Hashear el password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Comparar passwords 
veterinarianSchema.methods.verifyPassword = async function(formPassword) {
    return await bcrypt.compare(formPassword, this.password)
}

const Veterinarian = mongoose.model('Veterinarios', veterinarianSchema)

export default Veterinarian