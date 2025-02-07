import toast from "react-hot-toast"

const AxiosToastError = (error) => {
    toast.error(
        error?.response?.data?.message  //if this field not available then not show any error in browser so app run properly
    )
}

export default AxiosToastError;