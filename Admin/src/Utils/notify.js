import toast from "react-hot-toast";

const Notify = (type, message) => {
  toast[type](message, {
    duration: 4000,
    position: "top-center",
  });
};

export default Notify;
