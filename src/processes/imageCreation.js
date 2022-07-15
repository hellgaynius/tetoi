import domtoimage from 'dom-to-image';

export const imageCreation = {
  options: {},

  init(previewEl) {
    this.options.scaleSize = 2;
    this.options.previewEl = previewEl;
  
    this.options.compilation = {
      width: this.options.previewEl.clientWidth * this.options.scaleSize,
      height: this.options.previewEl.clientHeight * this.options.scaleSize,
      style: { 
        transform: `scale(${this.options.scaleSize})`, 
        transformOrigin: 'top left'
      },
    };
  },  

  generateUrl() {
    return domtoimage.toPng(this.options.previewEl, this.options.compilation)
      .then(dataUrl => {
        return dataUrl;
    });
  },

  download(fileName) {
    domtoimage.toPng(this.options.previewEl, this.options.compilation)
      .then(dataUrl => { 
        const linkEl = document.createElement('a');

        linkEl.download = fileName;
        linkEl.href = dataUrl;
        linkEl.click();
      });
  },

  copy() {
    domtoimage.toBlob(this.options.previewEl, this.options.compilation)
      .then(blob => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png' : blob })]);
      });
  },
};
