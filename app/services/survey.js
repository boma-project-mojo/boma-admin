/* 

This service handles all actions the creating surveys, questions and answers.  

*/

import Service, { inject as service } from '@ember/service';
import ENV from '../config/environment';
import { computed } from '@ember/object';

export default Service.extend({
  store: service(),
  session: service(),

  headers: computed(
    'session.data.authenticated.{token,user_email,user_token}',
    'session.isAuthenticated',
    function () {
      let headers = {};
      if (this.get('session.isAuthenticated')) {
        headers[
          'Authorization'
        ] = `Token user_token="${this.session.data.authenticated.user_token}", user_email="${this.session.data.authenticated.user_email}"`;
      }

      return headers;
    }
  ),

  /*
		newSurvey(surveyable_type, surveyable_id)

		Initialises a new survey model

		surveyable_type 	The type of related model										(string)
		surveyable				The ember data object of the related model 	(object)
	*/
  newSurvey(surveyable_type, surveyable) {
    let survey = this.store.createRecord('survey', {
      article: surveyable,
      surveyable_type: surveyable_type,
    });

    return survey;
  },

  /*
		newQuestion(survey_id, question_type, question_text)

		Initialises a new question model

		survey 					the ember data object of the related survey 	(object)
		question_type		the question_type															(string)
		question_text		the question text 														(string)
	*/
  async newQuestion(survey, question_type, question_text) {
    var question = this.store.createRecord('question', {
      question_type: question_type,
      question_text: question_text,
    });

    var questions = await survey.get('questions');
    questions.pushObject(question);

    return question;
  },

  /*
		newAnswer(question_id, answer_text)

		Initalises a new answer model
	
		question				the ember data object  of the related question 	(object)
		answer_text			the answer text 																(string)
	*/
  async newAnswer(question, answer_text) {
    let answer = this.store.createRecord('answer', {
      answer_text: answer_text,
    });

    let answers = await question.get('answers');
    answers.pushObject(answer);

    return answer;
  },

  /*
		buildPayloadForSave(survey)

		At time of writing the JSONAPIAdapter does not support sending nested attributes for
		Related models to the server.  Instead of sending multiple requests (one per survey, 
		question and answer) I have architected this to use AJAX to send all required attributes
		in one JSON object.  This function prepares and serialises the survey, questions and answers
		into the right format for the Rails API.  
	
		survey				the ember data object  of the survey 	(object)															(string)
	*/
  async buildPayloadForSave(survey) {
    var payload = {};

    payload['data'] = {};
    payload['data']['attributes'] = {};
    payload['data']['attributes']['id'] = survey.get('id');
    payload['data']['attributes']['enable_at'] = survey.get('enable_at');
    payload['data']['attributes']['disable_at'] = survey.get('disable_at');
    payload['data']['attributes']['article_id'] = survey.get('article.id');
    payload['data']['relationships'] = {};
    payload['data']['relationships']['questions'] = {};
    payload['data']['relationships']['questions']['data'] = [];

    let qs = await survey.get('questions');

    for await (const question of qs.map((q) => {
      return {
        q: q,
        a: q.get('answers'),
      };
    })) {
      var q_payload = {};
      q_payload['id'] = question['q'].id;
      q_payload['question_type'] = question['q'].question_type;
      q_payload['question_type'] = question['q'].question_type;
      q_payload['question_text'] = question['q'].question_text;
      q_payload['answers_attributes'] = [];

      let answers = await question['a']

      for (const answer of answers.map((a) => a)) {
        var a_payload = {};
        a_payload['id'] = answer.id;
        a_payload['answer_text'] = answer.answer_text;
        q_payload['answers_attributes'].push(a_payload);
      }

      payload['data']['relationships']['questions']['data'].push(q_payload);
    }

    return payload;
  },

  /*
		saveSurvey(survey)

		Saves the survey (persists to server)

		survey 				the ember data survey object		(object)
	*/
  async saveSurvey(survey) {
    let requestMethod = survey.isNew ? 'POST' : 'PATCH';
    let requestBase = ENV.APP['options']['apiURL'] + '/surveys/';
    let requestURL = survey.isNew ? requestBase : requestBase + survey.id;
    let surveyPayload = await this.buildPayloadForSave(survey);
    
    return axios({
      url: requestURL,
      method: requestMethod,
      data: surveyPayload,
      headers: this.headers,
    });
  },
});
