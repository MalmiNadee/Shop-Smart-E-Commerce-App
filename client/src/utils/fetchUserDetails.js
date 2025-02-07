import Axios from "./Axios";
import SummaryAPI from "../common/SummaryAPI";


const fetchUserDetails = async() => {
    try {
        const response = await Axios({
            ...SummaryAPI.userDetails
        })

        if (response && response.data) {
            return response.data; // Return only if data exists
          } else {
            console.warn('No data found in response:', response);
            return null;
          }

    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails


  