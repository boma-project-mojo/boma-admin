import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  survey: service(),

  /* 
   * indexForUI
   *
   * Return an index that can be used for numbering in the UX
   */
  indexForUI: computed('index', function () {
    return this.index + 1;
  }),
  actions: {
    /* 
     * newAnswer()
     *
     * Handle the action to create a new Answer.  
     */
    newAnswer() {
      this.survey.newAnswer(this.question);
    },
  },
});
