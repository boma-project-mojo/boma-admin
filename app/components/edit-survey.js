import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  survey: service(),

  actions: {
    /* 
     * newQuestion()
     *
     * Handles the action to create a new Question.
     */
    newQuestion() {
      this.survey.newQuestion(this.survey, 'single_choice');
    },
  },
});
