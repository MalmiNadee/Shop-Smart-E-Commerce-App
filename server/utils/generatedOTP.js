const generatedOTP = () => {
   // console.log('Generating OTP...');
    return Math.floor(Math.random() * 900000) + 100000; // 100000 to 999999
};

export default generatedOTP;
