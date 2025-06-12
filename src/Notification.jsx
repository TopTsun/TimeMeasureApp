import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Notification = () => {
  return (
    <div className="">
      <ToastContainer
        position="bottom-right"
        style={{
          fontSize: "20px",
        }}
      />
    </div>
  );
};

export default Notification;
