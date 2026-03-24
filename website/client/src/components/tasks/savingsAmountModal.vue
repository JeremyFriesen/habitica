<template>
  <b-modal
    id="savings-amount-modal"
    size="sm"
    :hide-footer="true"
    @hidden="onHidden"
  >
    <div
      slot="modal-header"
      class="savings-amount-modal-header p-4"
    >
      <div class="d-flex align-items-center justify-content-between mb-2">
        <h2 class="my-auto savings-amount-title">
          Nice work saving up!
        </h2>
        <button
          type="button"
          class="savings-close-btn"
          aria-label="Cancel"
          @click="cancel()"
        >
          &#10005;
        </button>
      </div>
      <p class="savings-amount-subtitle mb-0">
        Every dollar gets you closer to something awesome. How much are you putting away today?
      </p>
    </div>
    <div class="savings-amount-modal-content px-4 py-3">
      <div class="form-group mb-4">
        <label class="mb-1 savings-amount-label">
          Amount ($)
        </label>
        <input
          ref="amountInput"
          v-model.number="amountValue"
          class="form-control savings-amount-input"
          type="number"
          :min="1"
          step="1"
          placeholder="Enter deposit amount"
          @keypress.enter="canSave && submit()"
        >
        <small
          v-if="amountValue !== null && !isValid"
          class="savings-amount-hint text-danger"
        >
          <span v-if="amountValue >= 1 && amountValue > maxAmount">Not enough GP (you have {{ maxAmount }})</span>
          <span v-else>Must be a whole number of at least 1</span>
        </small>
      </div>
      <div class="d-flex justify-content-center gap-3 mb-3">
        <button
          class="btn btn-flat savings-amount-cancel-btn"
          type="button"
          @click="cancel()"
        >
          Cancel
        </button>
        <button
          class="btn btn-secondary savings-amount-save-btn"
          :class="{ 'btn-disabled': !canSave }"
          type="button"
          :disabled="!canSave"
          @click="submit()"
        >
          Save
        </button>
      </div>
    </div>
  </b-modal>
</template>

<style lang="scss">
  @import '@/assets/scss/colors.scss';

  #savings-amount-modal {
    .modal-dialog.modal-sm {
      max-width: 448px;
    }

    .modal-content {
      border-radius: 8px;
      border: none;
      box-shadow: 0 14px 28px 0 rgba($black, 0.24), 0 10px 10px 0 rgba($black, 0.28);
    }

    .modal-header, .modal-body, .modal-footer {
      padding: 0px;
      border: none;
    }

    .savings-amount-modal-header {
      position: relative;
      width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background: linear-gradient(to bottom right, $green-10, $green-50);
      padding: 1.5rem;
    }

    .savings-amount-title {
      color: $white;
    }

    .savings-amount-subtitle {
      color: rgba($white, 0.85);
      font-size: 14px;
      line-height: 1.5;
    }

    .savings-close-btn {
      background: none;
      border: none;
      color: rgba($white, 0.7);
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
      padding: 0 0 0 8px;
      &:hover {
        color: $white;
      }
    }

    .savings-amount-label {
      color: $gray-50;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
    }

    .savings-amount-input {
      background-color: rgba($white, 0.5);
      &:focus, &:active, &:hover {
        background-color: rgba($white, 0.75);
      }
    }

    .savings-amount-hint {
      display: block;
      margin-top: 4px;
      font-size: 12px;
    }

    .savings-amount-cancel-btn {
      min-width: 100px;
      color: $gray-100;
    }

    .savings-amount-save-btn {
      min-width: 120px;
    }

    .btn-disabled {
      background-color: $white;
      border: 2px solid transparent;
      color: $gray-200;
      line-height: 1.714;
      box-shadow: 0px 1px 3px 0px rgba(26, 24, 29, 0.12), 0px 1px 2px 0px rgba(26, 24, 29, 0.24);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
</style>

<script>
export default {
  data () {
    return {
      amountValue: null,
      maxAmount: 0,
      submitted: false,
    };
  },
  computed: {
    isValid () {
      return Number.isInteger(this.amountValue)
        && this.amountValue >= 1
        && this.amountValue <= this.maxAmount;
    },
    canSave () {
      return this.amountValue !== null && this.isValid;
    },
  },
  mounted () {
    this.$root.$on('habitica:show-savings-amount-modal', ({ maxAmount }) => {
      this.amountValue = null;
      this.maxAmount = maxAmount;
      this.submitted = false;
      this.$bvModal.show('savings-amount-modal');
      this.$nextTick(() => {
        if (this.$refs.amountInput) this.$refs.amountInput.focus();
      });
    });
  },
  beforeDestroy () {
    this.$root.$off('habitica:show-savings-amount-modal');
  },
  methods: {
    submit () {
      if (!this.canSave) return;
      this.submitted = true;
      this.$bvModal.hide('savings-amount-modal');
      this.$root.$emit('habitica:savings-amount-submitted', this.amountValue);
    },
    cancel () {
      this.$bvModal.hide('savings-amount-modal');
    },
    onHidden () {
      if (!this.submitted) {
        this.$root.$emit('habitica:savings-amount-submitted', null);
      }
    },
  },
};
</script>
