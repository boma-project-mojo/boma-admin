import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  columns: 5,
  setNumber: null,
  imageOrder: null,
  contentOrder: null,
  
  /* 
   * changeWatch
   *
   * Recalculate the order when the index is changed (e.g when a new model is created)
   */
  changeWatch: computed('index', function () {
    this.order();
  }),
  
  /* 
   * init()
   *
   * Init and calculate the order for this component
   */
  init() {
    this._super(...arguments);
    this.order();
  },

  /* 
   * didUpdateAttrs()
   *
   * Recalculate the order when attributes are updated.
   */
  didUpdateAttrs() {
    this._super(...arguments);
    this.order();
  },

  /* 
   * order()
   *
   * Generate the CSS used to order and display the images and content
   */
  order() {
    // The setNumber is based on the number of columns, in this case a set
    // consists of 5 models.
    //
    // The setNumber is then used to calculate the 'order' CSS property is
    // used reorder the DOM using display:flex;
    //
    // Per set the order of the content should be one greater that the image
    var setNumber = Math.ceil((this.index + 1) / this.columns);
    this.set('setNumber', setNumber);

    this.set('imageOrder', setNumber + (setNumber - 1));
    this.set('contentOrder', setNumber * 2);

    this.set(
      'imageStyle',
      htmlSafe(
        'order:' +
          this.imageOrder +
          "; background-image:url('" +
          this.image_url +
          "');display:block;"
      )
    );
    this.set('contentStyle', htmlSafe('order:' + this.contentOrder + ';'));
  },
});
