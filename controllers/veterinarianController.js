
import JWTGenerator from '../helpers/JWTGenerator.js'
import Veterinarian from '../models/Veterinarian.js'
import idGenerator from '../helpers/idGenerator.js'
import emailRegistration from '../helpers/emailRegistration.js'
import emailForgotPassword from '../helpers/emailForgotPassword.js'

const register = async (req, res) => {

  const { email, name } = req.body
  const userExists = await Veterinarian.findOne({ email })

  // Verificar si el usuario existe
  if (userExists) {
    const error = new Error('El usuario ya existe')

    // Permite que la api no se quede dando vueltas y mande un mensaje al frontend
    return res.status(400).json({ msg: error.message })
  }

  try {

    // Save new veterinarian
    const veterinarian = new Veterinarian(req.body)
    const veterinarianSaved = await veterinarian.save()

    // Send email
    emailRegistration({
      name,
      email,
      token: veterinarianSaved.token,
    })

    res.json(veterinarianSaved)

  } catch (error) {
    console.log(`error: ${error}`)
  }
}

const profile = (req, res) => {
  const { veterinarian } = req
  res.json(veterinarian)
}

const confirm = async (req, res) => {

  const { token } = req.params

  // Buscar si el usuario existe mediante el token
  const userConfirm = await Veterinarian.findOne({ token })
  if (!userConfirm) {
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.message })
  }

  try {
    userConfirm.token = null
    userConfirm.confirmed = true
    await userConfirm.save()

    res.json({ msg: 'Usuario confirmado correctamente' })

  } catch (error) {
    console.log(error)
  }

}

const authenticate = async (req, res) => {

  const { email, password } = req.body

  // Comprobar si el usuario existe
  const user = await Veterinarian.findOne({ email })

  if (!user) {
    const error = new Error('El correo electrónico no existe')
    return res.status(403).json({ msg: error.message })
  }

  // Comprobar si el usuario esta confirmado
  if (!user.confirmed) {
    const error = new Error('Tu cuenta no ha sido confirmada')
    return res.status(403).json({ msg: error.message })
  }

  // Comparar passwords
  if (await user.verifyPassword(password)) {

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: JWTGenerator(user.id)
    })

  } else {
    const error = new Error('El password es incorrecto')
    return res.status(403).json({ msg: error.message })
  }

}

const restorePass = async (req, res) => {
  const { email } = req.body

  // We have to be careful with the password
  // Confirm if Veterinarian Exists 
  const vetExists = await Veterinarian.findOne({ email }).select('-password')

  if (!vetExists) {
    const error = new Error("No existe ninguna cuenta con este correo")
    return res.status(400).json({ msg: error.message })
  }

  try {

    vetExists.token = idGenerator()
    await vetExists.save()

    emailForgotPassword({
      email,
      name: vetExists.name,
      token: vetExists.token
    })
    res.json({ msg: 'Te hemos enviado un email para recuperar tu cuenta.' })

  } catch (error) {
    console.log(error)
  }
}

const checkToken = async (req, res) => {
  const { token } = req.params

  const tokenExists = await Veterinarian.findOne({ token })

  if (tokenExists) {
    res.json({ token: 'El token existe' })
  } else {
    const error = new Error('Token invalido')
    return res.status(400).json({ msg: error.message })
  }
}

const setNewPass = async (req, res) => {

  const { token } = req.params
  const { password } = req.body

  const veterinarian = await Veterinarian.findOne({ token })

  if (!veterinarian) {
    const error = new Error('Ocurrio un error')
    return res.status(400).json({ msg: error.message })
  }

  veterinarian.token = null
  veterinarian.password = password
  await veterinarian.save()

  res.json({ msg: 'La contraseña fue modificada correctamente' })
}

const updateProfile = async (req, res) => {
  const veterinarian = await Veterinarian.findById(req.params.id)

  if (!veterinarian) {
    const error = new Error('Hubo un error, no se encontro ese usuario')
    return res.status(400).json({ msg: error.message })
  }

  const { email } = req.body
  if( veterinarian.email !== email ) {
    const vetExist = await Veterinarian.findOne({email})
    if(vetExist) {
      const error = new Error("Ese correo electrónico ya está registrado")
      return res.status(400).json({msg: error.message })
    }
  }

  try {
    veterinarian.name = req.body.name
    veterinarian.email = req.body.email
    veterinarian.telephone = req.body.telephone
    veterinarian.web = req.body.web

    const updatedVet = await veterinarian.save()
    res.json(updatedVet)

  } catch (error) {
    console.log(error)
  }
}

const updatePassword = async(req, res) => {
  
  /* It's destructuring the object from req. */
  const {id} = req.veterinarian
  const { newPass, actualPass } = req.body

  /* Finding the veterinarian by the id. */
  const veterinarian = await Veterinarian.findById(id)

  if(!veterinarian) {
    const error = new Error('Hubo un error, no se encontro ese usuario')
    return res.status(400).json({ msg: error.message })
  }

  /* It's checking if the actual password is correct, if it's correct, it's saving the new password. */
  if( await veterinarian.verifyPassword(actualPass)) {
    /* It's saving the new password. */
    veterinarian.password = newPass
    veterinarian.save()
    res.json({msg: 'Password almacenado correctamente'})
  } else {
    const error = new Error('El password actual es incorrecto')
    return res.status(400).json({ msg: error.message })
  }

}

export {
  register,
  profile,
  confirm,
  authenticate,
  restorePass,
  checkToken,
  setNewPass,
  updateProfile,
  updatePassword
}