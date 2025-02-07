const ForgotPasswordTemplate = ({name, otp}) => {
    return `
    <div>
       <p>Dear ${name},</p>
       <p>You've requested a password reset. Please use the following OTP code to reset your password:</p>
       <div 
       style="background: blue; font-size: 10px; color: white; padding: 10px; border-radius: 5px; text-align: center;">
          <strong>${otp}</strong>
       </div>
       <p>This OTP is valid for 1 hour only. Enter this OTP on the ShopSmart website to proceed with resetting your password.</p>
       <br/>
       <p>Thank you,</p>
       <p>ShopSmart</p>
    </div>
    `;
};

export default ForgotPasswordTemplate;
