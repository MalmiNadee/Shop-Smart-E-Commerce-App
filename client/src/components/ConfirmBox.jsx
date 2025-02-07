import { IoClose } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
const ConfirmBox = ({ cancel, confirm, close }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Permanent Delete</h1>
          <button className="ml-auto" onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <p className="my-4 text-gray-700">Are you sure you want to permanently delete this item?</p>
        <div className="w-full flex items-center justify-end gap-3">
          <button
            className="px-4 py-1 border rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 border rounded border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={confirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
