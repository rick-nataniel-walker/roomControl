// alert.js
import { createApp, h } from "vue";
import CustomAlert from "@/components/shared/CustomAlert"; // adjust the path as needed

const showAlert = (options) => {
  const alertApp = createApp({
    render() {
      return h(CustomAlert, {
        ...options,
        onDismiss: () => {
          setTimeout(() => {
            alertApp.unmount();
          }, 300); // wait for animation to finish
        },
      });
    },
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  alertApp.mount(container);
};

export default showAlert;
