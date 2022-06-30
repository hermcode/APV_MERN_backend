
import jwt from 'jsonwebtoken'
import Veterinarian from '../models/Veterinarian.js'

const checkAuth = async (req, res, next) => {

    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
        try {
            // Delete 'Bearer' word from the string
            token = req.headers.authorization.split(" ")[1]    
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get the user data without the password, token and confirmed
            req.veterinarian = await Veterinarian.findById(decoded.id).select(
                '-password -token -confirmed'
            )

            return next()
            
        } catch (error) {
            const e = new Error('Token no valido')
            return res.status(403).json({ msg: e.message })
        }

    }

    if(!token) {
        const error = new Error('Token no valido o inexistente')
        res.status(403).json({msg: error.message})
    }

    next()
}

export default checkAuth