<template>
  <b-modal
    id="crit-roll-modal"
    :no-close-on-esc="true"
    :no-close-on-backdrop="true"
    :hide-header-close="true"
    size="sm"
    :hide-footer="true"
  >
    <div
      slot="modal-header"
      class="crit-roll-modal-header p-4"
    >
      <div class="d-flex align-items-center mb-3">
        <h2 class="my-auto crit-roll-title">
          Enter your critical roll
        </h2>
      </div>
    </div>
    <div class="crit-roll-modal-content px-4 py-3">
      <div class="form-group mb-4">
        <label class="mb-1 crit-roll-label">
          Roll a d{{ dice }}
        </label>
        <input
          ref="rollInput"
          v-model.number="rollValue"
          class="form-control crit-roll-input"
          type="number"
          :min="1"
          :max="dice"
          step="1"
          placeholder="Enter your roll"
          @keypress.enter="canSave && submit()"
        >
        <small
          v-if="rollValue !== null && !isValid"
          class="crit-roll-hint text-danger"
        >
          Must be between 1 and {{ dice }}
        </small>
      </div>
      <div
        v-if="isValid"
        class="crit-roll-bonus-message mb-4 px-3 py-2"
        :class="bonusModifier > 0 ? 'bonus-active' : 'bonus-none'"
      >
        <span v-if="bonusModifier > 0">
          Outstanding roll! You've earned a <strong>+{{ bonusPercent }}% GP bonus</strong> on this task!
        </span>
        <span v-else>
          No bonus this time — better luck on the next one!
        </span>
      </div>
      <div class="d-flex justify-content-center mb-3">
        <button
          class="btn btn-secondary crit-roll-save-btn"
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

  #crit-roll-modal {
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

    .crit-roll-modal-header {
      position: relative;
      width: 100%;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background: linear-gradient(to bottom right, $purple-300, $purple-400);
    }

    .crit-roll-title {
      color: $white;
    }

    .crit-roll-label {
      color: $gray-50;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.71;
    }

    .crit-roll-input {
      background-color: rgba($white, 0.5);
      &:focus, &:active, &:hover {
        background-color: rgba($white, 0.75);
      }
    }

    .crit-roll-hint {
      display: block;
      margin-top: 4px;
      font-size: 12px;
    }

    .crit-roll-bonus-message {
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;

      &.bonus-active {
        background-color: rgba($purple-400, 0.12);
        border: 1px solid rgba($purple-400, 0.4);
        color: $purple-300;
      }

      &.bonus-none {
        background-color: rgba($gray-200, 0.12);
        border: 1px solid rgba($gray-200, 0.3);
        color: $gray-100;
      }
    }

    .crit-roll-save-btn {
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
      dice: 20,
      ranges: [],
      rollValue: null,
    };
  },
  computed: {
    isValid () {
      return Number.isInteger(this.rollValue)
        && this.rollValue >= 1
        && this.rollValue <= this.dice;
    },
    canSave () {
      return this.rollValue !== null && this.isValid;
    },
    bonusModifier () {
      if (!this.isValid || !this.ranges.length) return 0;
      const range = this.ranges.find(r => this.rollValue >= r.min && this.rollValue <= r.max);
      return range ? range.modifier : 0;
    },
    bonusPercent () {
      return Math.round(this.bonusModifier * 100);
    },
  },
  mounted () {
    this.$root.$on('habitica:show-crit-roll-modal', task => {
      this.dice = task.criticalityChance.dice;
      this.ranges = task.criticalityChance.ranges || [];
      this.rollValue = null;
      this.$bvModal.show('crit-roll-modal');
      this.$nextTick(() => {
        if (this.$refs.rollInput) this.$refs.rollInput.focus();
      });
    });
  },
  beforeDestroy () {
    this.$root.$off('habitica:show-crit-roll-modal');
  },
  methods: {
    submit () {
      if (!this.canSave) return;
      this.$bvModal.hide('crit-roll-modal');
      this.$root.$emit('habitica:crit-roll-submitted', this.rollValue);
    },
  },
};
</script>
