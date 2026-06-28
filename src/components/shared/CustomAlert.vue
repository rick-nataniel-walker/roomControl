<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="isVisible"
      ref="alertRef"
      class="fixed z-50 max-w-md w-full shadow-lg rounded-lg pointer-events-auto"
      :class="[positionClasses, alertClasses]"
    >
      <div class="rounded-lg shadow-xs overflow-hidden">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0" :class="iconClasses">
              <component :is="iconComponent" class="h-5 w-5" />
            </div>
            <div class="ml-3 w-0 flex-1">
              <h3 class="text-sm font-medium" :class="titleClasses">
                {{ title }}
              </h3>
              <div v-if="message" class="mt-1 text-sm" :class="messageClasses">
                <p>{{ message }}</p>
              </div>
              <div v-if="actions.length" class="mt-4 flex space-x-3">
                <button
                  v-for="(action, index) in actions"
                  :key="index"
                  @click="handleAction(action)"
                  class="text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                  :class="actionClasses(action)"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                v-if="dismissible"
                @click="dismiss"
                class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="dismissClasses"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="showProgress"
          class="w-full h-1 bg-opacity-20"
          :class="progressClasses"
        >
          <div
            class="h-full transition-all duration-100 ease-linear"
            :class="progressBarClasses"
            :style="progressStyle"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  defineComponent,
} from "vue";

export default defineComponent({
  name: "CustomAlert",
  props: {
    type: {
      type: String,
      default: "info",
      validator: (value) =>
        ["success", "error", "warning", "info"].includes(value),
    },
    position: {
      type: String,
      default: "top-right",
      validator: (value) =>
        [
          "top-right",
          "top-left",
          "bottom-right",
          "bottom-left",
          "top-center",
          "bottom-center",
          "center",
        ].includes(value),
    },
    duration: {
      type: Number,
      default: 2000,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    actions: {
      type: Array,
      default: () => [],
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
    onDismiss: {
      type: Function,
      default: () => {},
    },
    onAction: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const isVisible = ref(true);
    const progress = ref(100);
    const timer = ref(null);
    const progressTimer = ref(null);
    const alertRef = ref(null);

    const positionClasses = computed(() => {
      const positions = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 transform -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
        center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
      };
      return positions[props.position];
    });

    const alertClasses = computed(() => {
      const base = "bg-white";
      const types = {
        success: "border-l-4 border-green-500",
        error: "border-l-4 border-red-500",
        warning: "border-l-4 border-yellow-500",
        info: "border-l-4 border-blue-500",
      };
      return `${base} ${types[props.type]}`;
    });

    const iconClasses = computed(() => {
      const types = {
        success: "text-green-400",
        error: "text-red-400",
        warning: "text-yellow-400",
        info: "text-blue-400",
      };
      return types[props.type];
    });

    const iconComponent = computed(() => {
      const icons = {
        success: "CheckCircleIcon",
        error: "ExclamationCircleIcon",
        warning: "ExclamationTriangleIcon",
        info: "InformationCircleIcon",
      };
      return icons[props.type];
    });

    const titleClasses = computed(() => {
      const types = {
        success: "text-green-800",
        error: "text-red-800",
        warning: "text-yellow-800",
        info: "text-blue-800",
      };
      return types[props.type];
    });

    const messageClasses = computed(() => {
      const types = {
        success: "text-green-700",
        error: "text-red-700",
        warning: "text-yellow-700",
        info: "text-blue-700",
      };
      return types[props.type];
    });

    const dismissClasses = computed(() => {
      const types = {
        success: "text-green-400 hover:text-green-500 focus:ring-green-500",
        error: "text-red-400 hover:text-red-500 focus:ring-red-500",
        warning: "text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500",
        info: "text-blue-400 hover:text-blue-500 focus:ring-blue-500",
      };
      return types[props.type];
    });

    const progressClasses = computed(() => {
      const types = {
        success: "bg-green-200",
        error: "bg-red-200",
        warning: "bg-yellow-200",
        info: "bg-blue-200",
      };
      return types[props.type];
    });

    const progressBarClasses = computed(() => {
      const types = {
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
      };
      return types[props.type];
    });

    const progressStyle = computed(() => {
      return { width: `${progress.value}%` };
    });

    const actionClasses = (action) => {
      const base = "px-3 py-2";
      const types = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
        success:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        warning:
          "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      };

      return `${base} ${types[action.type || "primary"]}`;
    };

    const startTimer = () => {
      if (props.duration > 0) {
        // Start the progress bar
        const interval = 50;
        const steps = props.duration / interval;
        const decrement = 100 / steps;

        progressTimer.value = setInterval(() => {
          progress.value -= decrement;
          if (progress.value <= 0) {
            clearInterval(progressTimer.value);
          }
        }, interval);

        // Set the dismiss timer
        timer.value = setTimeout(() => {
          dismiss();
        }, props.duration);
      }
    };

    const dismiss = () => {
      isVisible.value = false;
      clearTimeout(timer.value);
      clearInterval(progressTimer.value);
      props.onDismiss();
      emit("dismiss");
    };

    const handleAction = (action) => {
      props.onAction(action);
      if (action.dismissOnClick !== false) {
        dismiss();
      }
    };

    onMounted(() => {
      startTimer();
    });

    onBeforeUnmount(() => {
      clearTimeout(timer.value);
      clearInterval(progressTimer.value);
    });

    return {
      isVisible,
      progress,
      alertRef,
      positionClasses,
      alertClasses,
      iconClasses,
      iconComponent,
      titleClasses,
      messageClasses,
      dismissClasses,
      progressClasses,
      progressBarClasses,
      progressStyle,
      actionClasses,
      dismiss,
      handleAction,
    };
  },
});

// Mock icon components - these would be replaced with real FontAwesome icons
export const CheckCircleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
};
export const ExclamationCircleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
};
export const ExclamationTriangleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
};
export const InformationCircleIcon = {
  template:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
};
</script>

<style scoped>
/* We're using Tailwind, so no need for custom CSS */
</style>
