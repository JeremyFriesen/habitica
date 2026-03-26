<template>
  <b-modal
    id="task-adventure-modal"
    :no-close-on-esc="false"
    :no-close-on-backdrop="true"
    :hide-header-close="true"
    size="sm"
    :hide-footer="true"
  >
    <div
      slot="modal-header"
      class="adventure-modal-header p-4"
    >
      <h2 class="adventure-modal-title mb-0">
        Adventure!
      </h2>
    </div>
    <div class="adventure-modal-content px-4 py-4 d-flex flex-column align-items-center">
      <div class="adventure-animation-area">
        <img
          src="@/assets/images/adventure-modal/test/test-00.gif"
          class="adventure-gif"
          alt=""
        >
      </div>
      <div class="d-flex justify-content-center mt-4">
        <button
          class="btn btn-secondary adventure-close-btn"
          type="button"
          @click="close()"
        >
          Close
        </button>
      </div>
    </div>
  </b-modal>
</template>

<style lang="scss">
  @import '@/assets/scss/colors.scss';

  #task-adventure-modal {
    .modal-dialog.modal-sm {
      max-width: 480px;
    }

    .modal-content {
      border-radius: 8px;
      border: none;
      box-shadow: 0 14px 28px 0 rgba($black, 0.24), 0 10px 10px 0 rgba($black, 0.28);
    }

    .modal-header, .modal-body, .modal-footer {
      padding: 0;
      border: none;
    }

    .adventure-modal-header {
      width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background: linear-gradient(to bottom right, $purple-200, $purple-400);
    }

    .adventure-modal-title {
      color: $white;
    }

    .adventure-animation-area {
      width: 249px;
      height: 260px;
      border: 2px solid $gray-200;
      border-radius: 8px;
      overflow: hidden;
    }

    .adventure-gif {
      // Source is 45×47px pixel art — scale to 260px tall, preserving ratio
      display: block;
      width: 249px;
      height: 260px;
      image-rendering: pixelated;
      image-rendering: crisp-edges; // Firefox fallback
    }

    .adventure-close-btn {
      min-width: 120px;
    }
  }
</style>

<script>
export default {
  mounted () {
    this.$root.$on('habitica:show-adventure-modal', () => {
      this.$bvModal.show('task-adventure-modal');
    });
  },
  beforeDestroy () {
    this.$root.$off('habitica:show-adventure-modal');
  },
  methods: {
    close () {
      this.$bvModal.hide('task-adventure-modal');
    },
  },
};
</script>
