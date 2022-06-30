import nodemailer from 'nodemailer'

const emailForgotPassword = async (data) => {

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
        subject: 'Reestablece tu contraseña',
        text: 'Reestablece tu contraseña',
        html: `
            <p>Hola ${name}, has solicitado reestablecer tu contraseña, solo debes seguir el siguiente enlace: <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Comprobar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })

    console.log("Mensaje enviado: %s", info.messageId)
}

export default emailForgotPassword