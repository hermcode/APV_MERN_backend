
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnection from './config/db.js'
import veterinarianRoutes from './routes/veterinarianRoutes.js'
import patientRoutes from './routes/patientRoutes.js'

const app = express()
app.use(express.json()) // Tells "Express" that it will receive json responses

const port = process.env.PORT || 4000

dotenv.config() // Scan the .env file
dbConnection()

const allowedDomains = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1) {
            // The request origin it's allowed
            callback(null /* message error*/, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarians', veterinarianRoutes)
app.use('/api/patients', patientRoutes)

app.listen(port, () => {
    console.log(`Servidor funcionando desde el puerto: ${port}`)
})