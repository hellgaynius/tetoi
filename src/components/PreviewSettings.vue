<script>
import AppButton from '@/components/simpleComponents/AppButton.vue';
import SettingBlockWrapper from '@/components/helperComponents/SettingBlockWrapper.vue';
import AppRange from '@/components/simpleComponents/AppRange.vue';
import { previewSettings } from '@/data/previewSettings.js';
import { browserStorage } from '@/browserStorage/browserStorage.js'

export default {
  LOCAL_SETTINGS_ITEM_NAME: 'localSettings',

  components: {
    AppButton,
    AppRange,
    SettingBlockWrapper,
  },

  emits: [
    'change',
  ],

  data() {
    return {
      staticSettings: JSON.parse(JSON.stringify(previewSettings)),
      reactiveSettings: {},
    }
  },

  created() {
    this.reactiveSettings = browserStorage.fetch(this.$options.LOCAL_SETTINGS_ITEM_NAME) 
      || this.getInitialValues();

    this.passSettingsObject();
  },

  methods: {
    getInitialValues() {
      return {
        paddings: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 20,
        },
        textApplicants: {
          headings: {
            font: 'Roboto',
            fontSize: 16,
            lineHeight: 1.1,
          },
          mainText: {
            font: 'Roboto',
            fontSize: 16,
            lineHeight: 1.2,
          },
        },
      }
    },

    passSettingsObject() {
      const settingsValues = {
        settings: JSON.parse(JSON.stringify(this.reactiveSettings)),
        mainTextFontFallback: 
          this.staticSettings.fonts.options[this.reactiveSettings.textApplicants.mainText.font].fallback,
        headingsFontFallback: 
          this.staticSettings.fonts.options[this.reactiveSettings.textApplicants.headings.font].fallback,
      };

      this.saveSettingsToBrowserStorage();
      this.$emit('change', settingsValues);
    },

    saveSettingsToBrowserStorage() {
      browserStorage.saveItem(this.$options.LOCAL_SETTINGS_ITEM_NAME, this.reactiveSettings);
    },

    resetValue(textApplicant, setting, defaultValue) {
      this.reactiveSettings.textApplicants[textApplicant][setting] = defaultValue;
      this.passSettingsObject();
    },

    resetPaddings() {
      this.reactiveSettings.paddings.left = this.staticSettings.paddings.default;
      this.reactiveSettings.paddings.right = this.staticSettings.paddings.default;
      this.reactiveSettings.paddings.bottom = this.staticSettings.paddings.default;
      this.reactiveSettings.paddings.top = this.staticSettings.paddings.default;
      this.passSettingsObject();
    },

    resetAllToDefault() {
      this.reactiveSettings = this.getInitialValues();
      this.passSettingsObject();
    },
  },
}
</script>

<template>
<div 
  class="preview-settings"
  v-if="true"
>   
  <div class="settings-wrapper">
    <div 
      class="setting-column"
      v-for="(textApplicant, textAppllicantKey) in staticSettings.textApplicants"
      :key="textAppllicantKey"
    >   
      <SettingBlockWrapper :name="textApplicant">
        <AppRange 
          v-for="(setting, settingKey) in staticSettings.textSettings"
          :key="settingKey"
          :min="setting.min"
          :max="setting.max"
          :step="setting.step"
          :range-name="setting.name"
          v-model="reactiveSettings.textApplicants[textAppllicantKey][settingKey]"
          @input="passSettingsObject"
        >
          <div class="single-button-wrapper">
            <AppButton 
              link-like
              class="reset-range"
              @click="resetValue(textAppllicantKey, settingKey, setting.value)"
            >
              reset
            </AppButton>
          </div>
        </AppRange>
        <SettingBlockWrapper subname="font:">
          <label class="fonts-dropdown-wrapper">
            <select
              class="fonts-dropdown"
              v-model="reactiveSettings.textApplicants[textAppllicantKey].font"
              @change="passSettingsObject"
            >
              <option 
                v-for="(option, optionKey) in staticSettings.fonts.options"
                :key="optionKey"
                :value="option.value"
                :style="`font-family: ${option.value}, ${option.fallback};`"
              >
                {{ option.value }}
              </option>
            </select>
          </label>
        </SettingBlockWrapper>
      </SettingBlockWrapper>
    </div>
    <div class="setting-column">
      <SettingBlockWrapper :name="staticSettings.paddings.name">
        <div 
          v-for="(side, sideKey) in staticSettings.paddings.sides"
          :key="sideKey"
        >
          <AppRange 
            :min="staticSettings.paddings.min"
            :max="staticSettings.paddings.max"
            :step="staticSettings.paddings.step"
            :range-name="side"
            v-model="reactiveSettings.paddings[sideKey]"
            @input="passSettingsObject"
          />
        </div>
        <div class="single-button-wrapper">
          <AppButton 
            link-like
            class="reset-range"
            @click="resetPaddings"
          >
            reset paddings
          </AppButton>
        </div>
      </SettingBlockWrapper>
    </div>
  </div>
  <AppButton 
    class="reset"
    link-like
    @click="resetAllToDefault"
  >
    reset all to default
  </AppButton>
</div>
</template>

<style lang="scss">
@use '@/assets/colors';
@use '@/assets/breakpoints';

.preview-settings {
  margin-bottom: 10px;
  padding: 20px;
  border: 3px solid colors.$secondary;
  .settings-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    gap: 40px;
  }
  .setting-column {
    display: flex;
    flex-direction: column;
  }
  .single-button-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .fonts-dropdown-wrapper {
    border-bottom: 2px solid colors.$secondary;
    padding: 5px 0;
    cursor: pointer;
  }
  .fonts-dropdown {
    border: none;
    cursor: pointer;
  }
  .reset-range {
    font-size: 12px;
    cursor: pointer;
  }
  .reset {
    margin: 15px 30px;
  }
}

@media #{breakpoints.$s-media} {
  .preview-settings {
    width: fit-content;
    margin: 30px auto;
    .settings-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 30px 15px 0;
    }
    .reset {
      margin-right: 0;
      margin-left: 55%;
    }
  }
}
</style>
