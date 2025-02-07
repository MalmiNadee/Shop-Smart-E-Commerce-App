import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

//if RESEND_API not available
if(!process.env.RESEND_API){
    console.log("Provide RESEND_API inside the .env file")
}

//if RESEND_API not available
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({sendTo, subject, html}) =>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'shopSmart <onboarding@resend.dev>',  // by default for testing purpose
            to: sendTo,
            subject: subject,  //like verification, forgot password
            html: html //which kind of template want to send 
    });
    if (error) {
        return console.error({ error });
      }

    return data
   
} catch (error) {
        console.log(error)
    }
}

export default sendEmail;