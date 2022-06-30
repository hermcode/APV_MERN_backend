import nodemailer from 'nodemailer'

const emailRegistration = async (data) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Send email
    const { name, email, token } = data

    const info = await transporter.sendMail({
        from: 'APV - Administrador de Veterinaria',
        to: email,
        subject: 'Confirma tu cuenta en APV',
        text: 'Confirma tu cuenta en APV',
        html: `
            <p>Hola ${name} tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Comprobar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })

    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailRegistration