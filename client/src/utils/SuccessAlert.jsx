import Swal from 'sweetalert2'

const SuccessAlert = (title) => {
  // Dynamically add styles to the document
  const style = document.createElement('style');
  style.innerHTML = `
    .custom-swal-popup {
      width: 300px !important; /* Adjust the width of the alert */
      padding: 20px !important; /* Adjust padding for better spacing */
      font-size: 16px; /* Set a readable font size */
      border-radius: 10px; /* Add rounded corners */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
    }
  `;
  document.head.appendChild(style);

  return Swal.fire({
    icon: "success",
    title: title,
    confirmButtonColor: "#00b050",
    customClass: {
      popup: 'custom-swal-popup', // Apply the custom class
    },
  });
};

export default SuccessAlert;
