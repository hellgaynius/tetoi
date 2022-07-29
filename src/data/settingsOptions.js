export const settingsOptions = {
  paddings: {
    name: 'Paddings',
    default: 20,
    min: 20,
    max: 80,
    step: 1,
    sides: {
      left: 'left:',
      right: 'right:',
      bottom: 'bottom:',
      top: 'top:',
    },
  },

  textApplicants: {
    headings: {
      name: 'Headings',
      settings: {
        fontSize: {
          name: 'size:',
          value: 16,
          step: 1,
          min: 8,
          max: 30,
        },
        lineHeight: {
          name: 'line height:',
          value: 1.1,
          min: 0.5,
          max: 2.5,
          step: 0.05,
        },
      },
    },
    mainText: {
      name: 'Main text',
      settings: {
        fontSize: {
          name: 'size:',
          value: 16,
          step: 1,
          min: 8,
          max: 30,
        },
        lineHeight: {
          name: 'line height:',
          value: 1.2,
          min: 0.5,
          max: 2.5,
          step: 0.05,
        },
      },
    },
  },

  fonts: {
    name: 'fonts:',
    default: 'Roboto',
    options: {
      'Philosopher': {
        fallback: 'sans-serif',
        value: 'Philosopher',
      },
      'Alice': {
        fallback: 'serif',
        value: 'Alice',
      },
      'Fira Mono': { 
        fallback: 'monospace',
        value: 'Fira Mono', 
      },
      'Cormorant Infant': {
        fallback: 'serif',
        value: 'Cormorant Infant', 
      },
      'Bona Nova': {
        fallback: 'serif',
        value: 'Bona Nova',
      },
      'Jura': {
        fallback: 'sans-serif',
        value: 'Jura',
      },
      'Finlandica': {
        fallback: 'sans-serif',
        value: 'Finlandica',
      },
      'Roboto': {
        fallback: 'sans-serif',
        value: 'Roboto',
      },
    },
  },
}

export function getDefaultSettings() {
  return {
    paddings: {
      left: previewSettings.paddings.default,
      right: previewSettings.paddings.default,
      bottom: previewSettings.paddings.default,
      top: previewSettings.paddings.default,
    },
    textApplicants: {
      headings: {
        font: previewSettings.fonts.default,
        fontSize: previewSettings.textApplicants.headings.settings.fontSize.value,
        lineHeight: previewSettings.textApplicants.headings.settings.lineHeight.value,
      },
      mainText: {
        font: previewSettings.fonts.default,
        fontSize: previewSettings.textApplicants.mainText.settings.fontSize.value,
        lineHeight: previewSettings.textApplicants.mainText.settings.lineHeight.value,
      },
    },
  }
};
