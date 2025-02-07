import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToastError";
import { updatedAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const UserProfileAvatarUpload = ({close}) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(user.avatar); // Temporary local state for immediate feedback

  // to prevent when click submit button refresh page
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0]; // you can select multiple files but need first index(0) file only

    if (!file) {
      // if file not available return the function
      return;
    }

    // Convert file to form data
    const formData = new FormData();
    formData.append("avatar", file); // Verify the correct key with your API

    try {
      setLoading(true); // before calling API, set loading to true
      const response = await Axios({
        ...SummaryAPI.uploadAvatar,
        data: formData,
      });
      const { data: responseData } = response;

      // Update local state to show image immediately
      const newAvatarUrl = `${responseData.data.avatar}?t=${Date.now()}`; // Add a timestamp to bypass cache
      setLocalAvatar(newAvatarUrl);

      // Dispatch Redux action to update global state
      dispatch(updatedAvatar(newAvatarUrl));
      close()
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false); // after API call, set loading to false
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button onClick={close} className="text-neutral-800 w-fit block ml-auto">
            <IoClose size={25}/>
        </button>
        <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
          {localAvatar ? (
            <img alt={user.name} src={localAvatar} className="w-full h-full" />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            <div className="text-xs px-4 py-1 rounded my-3 border border-secondary-200 hover:bg-secondary-200 cursor-pointer">
              {loading ? "Loading...." : "Upload"}
            </div>
          </label>
          <input
            onChange={handleUploadAvatarImage}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarUpload;
