//create custom template
const verifyEmailTemplate = ({name,url}) => {
    return `
<p> Dear ${name}</p>
<p> Thank you for registering shopSmart</p>
<a href = ${url} 
   style="color:white; background : blue, padding: 10px 15px; text-decoration: none; display: inline-block; margin-top: 10px; border-radius: 5px;">
   Verify Email
</a>
<p>If you didn’t request this, please ignore this email.</p>
    `;
};

export default verifyEmailTemplate;


  