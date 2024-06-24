import Component from '@ember/component';
import { computed } from '@ember/object';
import { debounce, later } from '@ember/runloop';

import jQuery from 'jquery';

export default Component.extend({
  value: computed('_value', 'editor', {
    set(_, newVal) {
      this.set('_value', newVal);
      this._updateEditorData(this.editor);
    },
    get() {
      return this.editor.getData();
    },
  }),

  init() {
    this._super(...arguments);
    // Create a random string to be the id of the editor
    this.set('id', (Math.random() + 1).toString(36).substring(7));
  },

  _initializeEditor() {
    BalloonEditor.create(jQuery(`#${this.id}`)[0], {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'indent',
          'outdent',
          '|',
          'mediaEmbed',
          'blockQuote',
          'insertTable',
          'redo',
          'undo',
        ],
      },
      language: 'en-gb',
      image: {
        toolbar: [
          'imageTextAlternative',
          'imageStyle:full',
          'imageStyle:side',
          'insertImage',
        ],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      licenseKey: '',
      mediaEmbed: {
        previewsInData: true,
      },
    })
      .then((editor) => {
        this._setupEditor(editor);
      })
      .catch((error) => {
        console.error('Oops, something gone wrong!');
        console.error(
          'Please, report the following error in the https://github.com/ckeditor/ckeditor5 with the build id and the error stack trace:'
        );
        console.warn('Build id: hdzt3b8sqzfn-tlpgdlxmsmis');
        console.error(error);
      });
  },
  _setupEditor(editor) {
    this.set('editor', editor);
    editor.model.document.on('change', () => {
      /**
       * For some reason, this event fires several times as a result of initialization.
       * For performance and state management reasons, we want exactly one event to fire, so
       * debounce by 100ms to smooth out the rapid-fire.
       */
      debounce(this, '_onEditorDataChange', ...[editor, ...arguments], 100);
    });
  },
  _onEditorDataChange(editor) {
    // if an "onChange" function is passed in, invoke it
    if (this.onChange && typeof this.onChange === 'function') {
      this.onChange(editor.getData());
    }
  },
  _updateEditorData(editor) {
    if (!editor) editor = this.editor;
    if (!editor) {
      later(this, '_updateEditorData', 100);
    } else {
      editor.setData(this._value);
    }
  },
  didInsertElement() {
    this._super(...arguments);
    this._initializeEditor();
  },
  willDestroyElement() {
    this._super(...arguments);
    // attempt to clean up the editor
    let editor = this.editor;
    if (editor) {
      editor.destroy();
    }
  },
});
