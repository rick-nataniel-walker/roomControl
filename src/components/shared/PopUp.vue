<template>
  <slot name="activator" :open="openPopup" :close="closePopup"></slot>

  <Teleport to="body">
    <Transition
      name="popup"
      appear
      @before-enter="setAnimationOrigin"
      @after-enter="focusDialog"
      @after-leave="restoreFocus"
    >
      <div
        v-if="modelValue"
        class="popup-wrapper"
        @mousedown.self="onBackdropClick"
      >
        <section
          ref="dialog"
          class="popup-content"
          :class="`popup-content--${normalizedType}`"
          :style="popupStyle"
          :role="normalizedType === 'warning' ? 'alertdialog' : 'dialog'"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          @keydown.esc.stop="closePopup"
        >
          <header class="popup-header">
            <h2 :id="titleId">{{ title }}</h2>
            <button
              type="button"
              class="close-btn"
              aria-label="Fechar"
              @click="closePopup"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <div class="popup-body">
            <slot name="body"></slot>
            <slot></slot>
          </div>

          <footer class="popup-actions">
            <ActionBtn
              v-if="normalizedType === 'interact'"
              :text="cancelMsg"
              variant="cancel"
              @click="cancelPopup"
            />
            <ActionBtn :text="actionMsg" @click="confirmPopup" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import ActionBtn from "@/components/shared/ActionBtn.vue";

const WIDTHS = {
  small: "24rem",
  medium: "36rem",
  full: "calc(100vw - 2rem)",
};

let popupId = 0;

export default {
  name: "PopUp",
  components: { ActionBtn },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "medium",
    },
    type: {
      type: String,
      default: "interact",
      validator: (value) =>
        ["message", "interact", "warning"].includes(value.toLowerCase()),
    },
    actionMsg: {
      type: String,
      default: "Confirmar",
    },
    cancelMsg: {
      type: String,
      default: "Cancelar",
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue", "confirm", "cancel", "open", "close"],
  data() {
    popupId += 1;
    return {
      titleId: `popup-title-${popupId}`,
      origin: null,
      triggerElement: null,
    };
  },
  computed: {
    normalizedType() {
      return this.type.toLowerCase();
    },
    popupStyle() {
      const preset = WIDTHS[this.width.toLowerCase()];
      return { width: preset || this.width };
    },
  },
  beforeUnmount() {
    document.body.classList.remove("popup-open");
  },
  methods: {
    openPopup(eventOrElement) {
      const candidate = eventOrElement?.currentTarget || eventOrElement;
      const element = candidate instanceof Element ? candidate : null;

      this.triggerElement = element || document.activeElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        this.origin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      } else {
        this.origin = null;
      }

      document.body.classList.add("popup-open");
      this.$emit("update:modelValue", true);
      this.$emit("open");
    },
    closePopup() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    cancelPopup(event) {
      this.$emit("cancel", event);
      this.closePopup();
    },
    confirmPopup(event) {
      this.$emit("confirm", event);
    },
    onBackdropClick() {
      if (this.closeOnBackdrop) this.closePopup();
    },
    setAnimationOrigin(element) {
      document.body.classList.add("popup-open");
      const dialog = element.querySelector(".popup-content");
      if (!dialog || !this.origin) return;

      const rect = dialog.getBoundingClientRect();
      dialog.style.setProperty(
        "--popup-origin-x",
        `${this.origin.x - rect.left}px`
      );
      dialog.style.setProperty(
        "--popup-origin-y",
        `${this.origin.y - rect.top}px`
      );
    },
    focusDialog() {
      this.$refs.dialog?.focus();
    },
    restoreFocus() {
      document.body.classList.remove("popup-open");
      this.triggerElement?.focus?.();
    },
  },
};
</script>

<style scoped>
.popup-wrapper {
  @apply fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4;
  backdrop-filter: blur(2px);
}

.popup-content {
  --popup-origin-x: 50%;
  --popup-origin-y: 50%;
  @apply max-h-[calc(100vh-2rem)] max-w-full overflow-auto rounded-2xl bg-white p-6 text-primary shadow-2xl outline-none;
  transform-origin: var(--popup-origin-x) var(--popup-origin-y);
}

.popup-content--warning {
  @apply border-t-4 border-red-500;
}

.popup-header {
  @apply mb-4 flex items-start justify-between gap-4;
}

.popup-header h2 {
  @apply text-lg font-semibold;
}

.close-btn {
  @apply -mr-2 -mt-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-2xl leading-none text-slate-500 transition;
}

.close-btn:hover {
  @apply bg-red-50 text-red-500;
}

.close-btn:focus-visible {
  @apply outline-none ring-2 ring-secondary ring-offset-2;
}

.popup-body {
  @apply text-sm text-slate-600;
}

.popup-actions {
  @apply mt-6 flex flex-wrap justify-end gap-3;
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 220ms ease;
}

.popup-enter-active .popup-content,
.popup-leave-active .popup-content {
  transition: transform 260ms cubic-bezier(0.2, 0.85, 0.35, 1),
    opacity 180ms ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .popup-content,
.popup-leave-to .popup-content {
  opacity: 0;
  transform: scale(0.06);
}

@media (prefers-reduced-motion: reduce) {
  .popup-enter-active,
  .popup-leave-active,
  .popup-enter-active .popup-content,
  .popup-leave-active .popup-content {
    transition-duration: 1ms;
  }
}
</style>

<style>
body.popup-open {
  overflow: hidden;
}
</style>
