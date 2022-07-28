<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import { markdown } from '@/processes/markdown.js';
import { imageCreation } from '@/processes/imageCreation.js';
import { debounce } from 'throttle-debounce';

markdown.init();

const RENDER_TEXT_DELAY = 1000;
const RENDER_BULK_IMAGES_DELAY = 2000;

export default {
  COPIED_REMOVE_DELAY: 2000,
  CURRENT_TEXTAREA_MAXLENGTH: 5000,

  components: {
    AppButton,
  },

  props: {
    isDisabled: Boolean,
    isProjectFilled: Boolean,
    isCreateBulkImagesRequested: Boolean,
    isRenderOngoing: Boolean,
    currentSlotIndex: Number,
    slotsMaxQuantity: Number,
    post: Object,
    previewSettings: Object,
  },

  emits: [
    'toggle-switcher',
    'save-text', 
    'change-slot-image',
    'set-rendering-status',
    'set-rendering-need',
    'set-create-bulk-images-request-status',
  ],

  data() {
    return {
      isBigScreen: window.matchMedia('(min-width: 600px)').matches,
      isCopiedPopupHidden: true,
      isCopiedPopupInvisible: false,
      isTextOverflowing: false,
      renderedPreview: '',
    }
  },

  computed: {
    isPreviewButtonDisabled() {
      return !this.renderedPreview || !this.isProjectFilled;
    },

    currentTextValue() {
      return this.post.slots[this.currentSlotIndex]?.text;
    },

    previewPaddingSettings() {
      if (this.previewSettings.settings) {
        return `
          padding-left: ${this.previewSettings.settings.paddings.left}px;
          padding-right: ${this.previewSettings.settings.paddings.right}px;
          padding-bottom: ${this.previewSettings.settings.paddings.bottom}px;
          padding-top: ${this.previewSettings.settings.paddings.top}px;
        `
      };
    },

    previewTextSettings() {
      if (this.previewSettings.settings) {
        return `
          --main-text-font-size: ${this.previewSettings.settings.textApplicants.mainText.fontSize}px;
          --headings-font-size: ${this.previewSettings.settings.textApplicants.headings.fontSize}px;
          --main-text-line-height: ${this.previewSettings.settings.textApplicants.mainText.lineHeight};
          --headings-line-height: ${this.previewSettings.settings.textApplicants.headings.lineHeight};
          --main-text-font-family: 
            ${this.previewSettings.settings.textApplicants.mainText.font}, 
            ${this.previewSettings.mainTextFontFallback};
          --headings-font-family: 
            ${this.previewSettings.settings.textApplicants.headings.font}, 
            ${this.previewSettings.headingsFontFallback};
        `
      };
    }
  },

  watch: {
    currentSlotIndex(index) {
      if (this.currentTextValue) {
        this.renderPreview(index);
      };
    },

    currentTextValue(value) {
      if (!value) {
        this.renderedPreview = '';
      };
    },

    previewSettings: {
      handler() {
        this.$nextTick()
          .then(() => {
              this.checkTextOverflow();
              this.buildDependentEntitiesForSlot(this.currentSlotIndex);
            }
          );
      },

      deep: true,
    },

    isCreateBulkImagesRequested(value) {
      if (value) {
        this.createBulkImages();
      };
    },
  },

  mounted() {
    imageCreation.init(this.$refs.previewForConverting);

    if (this.isCreateBulkImagesRequested) {
      this.createBulkImages();
    };
  },

  methods: {
    saveSlotText(event) {
      this.$emit('save-text', event.target.value, 'slot');

      if (this.currentTextValue) {
        this.buildDependentEntitiesForSlotDebounced();
      } else {
        this.buildDependentEntitiesForSlot(this.currentSlotIndex);
      };
    },

    saveFullText(event) {
      this.$emit('save-text', event.target.value);
    },

    async createBulkImages() {
      this.$emit('set-rendering-status', true);

      for (let i = 0; i < this.post.slots.length; i++) {
        if (this.post.slots[i].text) {
          await this.buildDependentEntitiesForSlot(i);
        }
      };

      this.renderPreview(this.currentSlotIndex);
      this.$emit('set-rendering-status', false);
      this.$emit('set-rendering-need', false);
      this.$emit('set-create-bulk-images-request-status', false);
    },

    createBulkImagesDebounced: debounce(RENDER_BULK_IMAGES_DELAY, function() {
      this.createBulkImages();
    }),

    renderPreview(slotIndex) {
      this.renderedPreview = markdown.render(this.post.slots[slotIndex]?.text);
      this.checkTextOverflow();
    },

    async checkTextOverflow() {
      await this.$nextTick();

      this.isTextOverflowing = 
        this.$refs.previewContainer.offsetHeight - this.$refs.renderedPreview.offsetHeight < 0;
    },

    async saveImageToSlot(slotIndex) {
      const imgSrc = await imageCreation.generateUrl();
      this.$emit('change-slot-image', {
        imgSrc: imgSrc,
        slotId: this.post.slots[slotIndex].id,
      });
    },

    buildDependentEntitiesForSlot(slotIndex) {
      if (this.post.slots.length === 1) {
        this.$emit('set-rendering-need', false);
      };

      this.renderPreview(slotIndex);
      return this.saveImageToSlot(slotIndex);
    },

    buildDependentEntitiesForSlotDebounced: debounce(RENDER_TEXT_DELAY, function() {
      this.buildDependentEntitiesForSlot(this.currentSlotIndex);
    }),

    downloadImage() {
      imageCreation.download(`picture_page-${this.currentSlotIndex + 1}.png`);
    },

    copyImage() {
      imageCreation.copy();
      this.isCopiedPopupHidden = false;

      setTimeout(() => {
        this.isCopiedPopupHidden = true;
      }, this.$options.COPIED_REMOVE_DELAY);
    },
  },
}
</script>

<template>
  <div class="text-transformator">
    <div class="inner">
      <div class="fields">
        <label class="field-container full">
          <h3 class="field-title">
            Whole text:
          </h3>
          <textarea 
            :maxlength="$options.CURRENT_TEXTAREA_MAXLENGTH * this.slotsMaxQuantity"
            :disabled="isDisabled"
            :value="post.fullText"
            @input="saveFullText"
            class="field full"
            placeholder="Place your full text here, and divide it between images later"
          ></textarea>
        </label>
        <label class="field-container current">
          <h3 class="field-title">
            Current page:
          </h3>
          <textarea
            :maxlength="$options.CURRENT_TEXTAREA_MAXLENGTH"
            :autofocus="isBigScreen"
            :disabled="isDisabled"
            :value="currentTextValue"
            @input="saveSlotText"
            class="field current"
            placeholder="Write text here"
          ></textarea>
        </label>
      </div>
    </div>
    <div class="preview-block">
      <div class="preview-label">
        Preview:
      </div>
      <div 
        class="preview-wrapper border"
        :class="{ 'text-overflow': isTextOverflowing }"
      > 
        <span 
          class="overflow-warning-text"
          v-show="isTextOverflowing"
        >
          text does not fit in
        </span>
        <div 
          class="preloader-mask"
          v-show="isRenderOngoing"
        >
          <div class="preview-preloader centered">
            Rendering . . .
          </div>
        </div>
        <div 
          class="preview-wrapper padding"
          ref="previewForConverting"
          :style="previewPaddingSettings"
        >
          <div 
            ref="previewContainer"
            class="preview-container"
            :style="previewTextSettings"
          >
            <div
              v-html="renderedPreview"
              ref="renderedPreview"
            ></div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <AppButton 
          :disabled="isPreviewButtonDisabled"
          button-like
          @click="downloadImage"
        >
          download
        </AppButton>
        <AppButton
          :disabled="isPreviewButtonDisabled"
          button-like
          @click="copyImage"
        > 
          copy
        </AppButton>
      </div>
      <Transition name="fade-copied">
        <div 
          class="copied-notification centered"
          v-if="!isCopiedPopupHidden"
        >
          copied
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/style/colors';
@use '@/assets/style/breakpoints';
@import '@/assets/style/mixins';

.text-transformator {
  display: flex;
  justify-content: space-between;
  gap: calc(
    var(--label-padding-top)
    + var(--label-padding-bottom)
    + var(--font-size)
  );
  width: 100%;
  .inner {
    flex-grow: 1;
    min-width: 200px;
  }
  .fields {
    display: flex;
    flex-direction: column;
    height: calc(
      (var(--preview-width) / var(--preview-aspect-ratio)) 
      + var(--preview-padding) 
      + var(--preview-width-border) * 2
    ); 
  }
  .field-container {
    display: flex;
    flex-direction: column;
    &.full {
      flex-grow: 1;
    }
    &.current {
      flex-grow: 3;
    }
  }
  .field-title {
    font-size: 1em;
    font-weight: 100;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    color: colors.$dark;
  }
  .field {
    display: block;
    flex-grow: 1;
    width: 100%;
    padding: 10px;
    resize: none;
    border-radius: unset;
    transition: box-shadow 0.2s;
    border: 1px solid colors.$secondary;
    font-family: 'Roboto', Verdana, sans-serif;
    &:focus-visible {
      box-shadow: 4px 4px 0 colors.$secondary;
    }
  }
  .preview-block {
    display: flex;
    flex-direction: column;
    padding-top: var(--preview-padding);
    position: relative;
  }
  .preview-label {
    display: none;
    padding-bottom: var(--label-padding-bottom);
    padding-top: var(--label-padding-top);
    margin: 0 auto;
    font-size: 16px;
    color: colors.$secondary-darker;
  }
  .preview-wrapper {
    &.border {
      position: relative;
      margin-bottom: 10px;
      border: 1px solid colors.$secondary;
      &.text-overflow {
        border-color: colors.$warning;
      }
    }
    &.padding {
      width: var(--preview-width);
      aspect-ratio: var(--preview-aspect-ratio);
      padding: var(--preview-wrapper-padding);
      overflow: hidden;
      background-color: colors.$light;
    }
  } 
  .preloader-mask {
    box-sizing: content-box;
    position: absolute;
    z-index: 8;
    left: -1px;
    top: -1px;
    width: var(--preview-width);
    aspect-ratio: var(--preview-aspect-ratio);
    background-color: colors.$app-background;
    border: 1px solid colors.$secondary;
  }
  .preview-preloader {
    text-align: center;
    font-size: 22px;
    color: colors.$secondary-darker;
    letter-spacing: 1px;
    animation-name: preview-preloader;
    @include preloader-animation;
    @keyframes preview-preloader {
      from {
        opacity: 0.2;
      }
      to {
        opacity: 1;
      }
    }
  }
  .overflow-warning-text {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0px 10px;
    color: colors.$warning;
    background-color: colors.$app-background;
    opacity: 0.9;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    height: 50px;
  }
  .copied-notification {
    display: block;
    padding: 10px 30px;
    background-color: colors.$secondary-darker;
    color: colors.$main;
    font-size: 14px;
    font-variant-caps: all-small-caps;
    letter-spacing: 2px;
    border-radius: 5px;
    box-shadow: 0 0 10px colors.$secondary-darker;
  }
  .centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

@media #{breakpoints.$s-media} {
  .text-transformator {
    flex-wrap: wrap;
    padding-bottom: 20px;
    .inner {
      min-width: var(--preview-width);
    }
    .field-container {
      align-items: center;
      &.current {
        order: -1;
      }
    }
    .field {
      width: var(--preview-width);
    }
    .preview-label {
      display: block;
    }
    .preview-wrapper {
      margin: 0 auto;
    }
    .preview-block {
      order: -1;
      margin: 0 auto;
      padding: 0;
    }
  }
}  
</style>
