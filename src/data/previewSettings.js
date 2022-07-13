export const previewSettings = {
  paddings: {
    name: 'Paddings',
    default: 20,
    params: {
      min: 20,
      max: 80,
      step: 1,
    },
    sides: {
      left: {
        label: 'left:',
        value: 20,
      },
      right: {
        label: 'right:',
        value: 20,
      },
      bottom: {
        label: 'bottom:',
        value: 20,
      },
      top: {
        label: 'top:',
        value: 20,
      },
    },
  },

  textApplicants: {
    headings: {
      name: 'Headings',
      class: 'headings',
      font: {
        value: 'Roboto',
      },
      fontSize: {
        value: 16,
      },
      lineHeight: {
        value: 1.3,
      },
    },
    mainText: {
      name:  'Main text',
      class: 'main-text',
      font: {
        value: 'Alice',
      },
      fontSize: {
        value: 16,
      },
      lineHeight: {
        value: 1.3,
      },
    },
  },

  fonts: {
    name: 'fonts:',
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

  textSettings: {
    fontSize: {
      name: 'size:',
      value: 16,
      min: 10,
      max: 24,
      step: 2,
    },

    lineHeight: {
      name: 'line height:',
      value: 1.3,
      min: 0.5,
      max: 2.5,
      step: 0.1,
    },
  },

  getDefaultValues() {
    return {
      mainTextFontSize: this.textSettings.fontSize.value,
      headingsFontSize: this.textSettings.fontSize.value,
      mainTextLineHeight: this.textSettings.lineHeight.value,
      headingsLineHeight: this.textSettings.lineHeight.value,
      padding: this.paddings.default,
    }
  },
}
