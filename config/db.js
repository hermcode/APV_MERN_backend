
import mongoose from 'mongoose'

const dbConnection = async () => {

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        })

        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectado en: ${url}`)

    } catch (error) {
        
        console.log(`error: ${error.message}`)
        process.exit(1) // i don't understand this line honestly
    }
}

export default dbConnection