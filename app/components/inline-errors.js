import { computed } from '@ember/object';
import Component from '@ember/component';
import { gt } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  errors_processed: null,
  has_errors: gt('errors_processed.length', 0),

  /* 
   * error_string
   *
   * Return a string of errors joined by commas
   */
  error_string: computed('errors_processed', function () {
    return this.errors_processed.join(', ');
  }),
  /* 
   * error_string
   *
   * Process errors for the attribute provided so that they can
   * be easily displayed.  
   */
  errors_processed: computed('errors', 'pointer', function () {
    var error_output = [];
    var error_input = this.errors;

    if (error_input) {
      for (var i = error_input.length - 1; i >= 0; i--) {
        if (error_input[i].source.pointer == this.pointer) {
          error_output.push(error_input[i].detail);
        }
      }
    }
    return error_output;
  }),
});
