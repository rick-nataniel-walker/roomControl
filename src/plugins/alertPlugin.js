// alertPlugin.js
import { createApp, h } from "vue";
import CustomAlert from "@/components/shared/CustomAlert";

export default {
  install(app) {
    app.config.globalProperties.$alert = (options) => {
      const alertApp = createApp({
        render() {
          return h(CustomAlert, {
            ...options,
            onDismiss: () => {
              setTimeout(() => {
                alertApp.unmount();
                document.body.removeChild(container);
              }, 300);
            },
          });
        },
      });

      const container = document.createElement("div");
      document.body.appendChild(container);
      alertApp.mount(container);
    };
  },
};
