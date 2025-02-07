import { useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OTPVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const inputRef = useRef([])
    const location = useLocation()

    //console.log("location", location)

    //if email not have then redirect to Forgot password page
    useEffect(() => {
        if(!location?.state?.email){
            navigate('/forgot-password')
        }
    },[location,navigate])

    // Validate if all fields are filled
    const validateValue = data.every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        try {
            const response = await Axios({
                ...SummaryAPI.forgot_password_otp_verification,
                data: {
                    otp : data.join(""), // Combine OTP inputs into a single string
                    email : location?.state?.email  // ? used for this field not available show the error
                }
            });

            if (response.data.error) {
                toast.error("Provide required OTP");
            }

            if (response.data.success) {
                toast.success(response.data.message);
                // Reset the fields and navigate to verify OTP page
                setData(["", "", "", "", "", ""]);
                navigate("/reset-password",{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    }
                });
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="w-full container mx-auto px-2">
            <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
                <p className="font-bold text-lg mb-2">Enter OTP</p>

                <form className="grid gap-4 py-6" onSubmit={handleSubmit}>
                    <div className="grid gap-1">
                        <label htmlFor="otp">Enter Your OTP:</label>
                        <div className="flex items-center gap-2 justify-between mt-3">
                            {data.map((element, index) => (
                                <input
                                    key={"otp"+index}
                                    type="text"
                                    id={`otp-${index}`}
                                    ref={(ref)=> {
                                        inputRef.current[index] = ref
                                        return ref
                                    }}
                                    value={data[index]}
                                    maxLength={1}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        console.log("value",value)
                                        // Allow only numbers
                                        if (!/^[0-9]*$/.test(value)) return;

                                        const newData = [...data];
                                        newData[index] = value;
                                        setData(newData);

                                        // Automatically move to the next input
                                        if(value && index < data.length - 1){
                                            inputRef.current[index+1].focus()
                                        }
                                        // if (value && index < data.length - 1) {
                                        //     document.getElementById(`otp-${index + 1}`).focus();
                                        // }
                                    }}
                                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none 
                                    focus:border-secondary-200 text-center font-semibold"
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={!validateValue}
                        className={`${
                            validateValue
                                ? "bg-green-800 hover:bg-green-700"
                                : "bg-gray-500"
                        } text-white py-2 rounded font-semibold my-3 tracking-wide`}
                    >
                        Verify OTP
                    </button>
                </form>

                <p>
                    Already have an account?{" "}
                    <Link
                        to={"/login"}
                        className="font-semibold text-green-600 hover:text-green-800"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default OTPVerification;
