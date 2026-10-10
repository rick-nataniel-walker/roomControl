import { createApp, h } from "vue";
import CustomAlert from "@/components/shared/CustomAlert";

let activeBlinkingAlert;

const showAlert = (options, timeout = 10000) => {
  const { onDismiss, ...props } = options;
  if (props.blink) activeBlinkingAlert?.();
  let app;
  let cleanup;
  let closed = false;
  const container = document.createElement("div");
  const close = () => {
    closed = true;
    clearTimeout(cleanup);
    app?.unmount();
    app = null;
    container.remove();
    if (activeBlinkingAlert === close) activeBlinkingAlert = null;
  };
  const dismiss = () => {
    if (closed) return;
    closed = true;
    if (props.blink) close();
    else cleanup = setTimeout(close, timeout);
    onDismiss?.();
  };
  document.body.appendChild(container);
  app = createApp({
    render: () => h(CustomAlert, { ...props, onDismiss: dismiss }),
  });
  app.mount(container);
  if (props.blink) activeBlinkingAlert = close;
  return close;
};

export default showAlert;
