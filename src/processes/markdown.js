import MarkdownIt from 'markdown-it';
import markdownItAlign from 'markdown-it-align';

export const markdown = {
  lib: null,

  init() {
    this.lib = new MarkdownIt('commonmark', {breaks: true})
      .use(markdownItAlign)
      .disable(['link', 'image'], true);
      return 'success'
  },

  render(text) {
    /* replaces three backslashes into an HTML break line 
    plus another empty line that is not being rendered by markdown 
    but necessary for proper rendering of other elements */
    const textWithBreaks = text.replace(/\\\\\\/g, '<br />\n');

    return this.lib.render(textWithBreaks);
  },
};
