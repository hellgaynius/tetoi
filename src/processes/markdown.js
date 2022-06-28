import MarkdownIt from 'markdown-it';
import markdownItAlign from 'markdown-it-align';

export const markdown = {
  markdownLib: null,

  init() {
    this.markdownLib = new MarkdownIt('commonmark', {breaks: true})
      .use(markdownItAlign)
      .disable(['link', 'image'], true);
      return 'success'
  },

  render(text) {
    /* replaces three backslashes into an HTML break line 
    plus another empty line that is not being rendered by markdown 
    but necessary for proper rendering of other elements */
    const textWithBreaks = text.replace(/\\\\\\/g, '<br />\n');

    return this.markdownLib.render(textWithBreaks);
  },
};
