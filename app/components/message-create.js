import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { debounce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { equal } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  is_editing: equal('message.isNew', true),

  messageStreams: [
    { name: 'Critical Comms', key: 'critical-comms' },
    { name: 'HQ Comms', key: 'hq-comms' },
    { name: 'News Article Notification', key: 'article-news-notifications' },
    { name: 'Audio Article Notification', key: 'article-audio-notifications' },
    { name: 'Live Stream Notification', key: 'live-stream-notifications' },
  ],

  articleOrEvent: '',
  sendTo: 'all',
  linkedRecord: null,

  /* 
   * searchEvents
   *
   * Send the request to search events with a string query
   * 
   * query      str       The query to search in event name
   * resolve    func      The function to run when the promise is resolved
   * reject     func      The function to run when the promise is rejected
   */
  searchEvents(query, resolve, reject) {
    let store = this.store;
    store
      .adapterFor('event')
      .set('namespace', 'admin_api/v1/festivals/' + this.festival_id);
    return store
      .query('event', {
        festival_id: this.festival_id,
        page: 1,
        query: query,
        unpublished_and_unlocked: false,
        searching: true,
      })
      .then((json) => resolve(json), reject);
  },
  /* 
   * searchArticles
   *
   * Send the request to search articles with a string query
   * 
   * query      str       The query to search in article name
   * resolve    func      The function to run when the promise is resolved
   * reject     func      The function to run when the promise is rejected
   */ 
  searchArticles(query, resolve, reject) {
    let store = this.store;
    store
      .adapterFor('article')
      .set('namespace', 'admin_api/v1/festivals/' + this.festival_id);
    return store
      .query('article', {
        organisation_id: this.organisation_id,
        query: query,
        unpublished_and_unlocked: false,
        searching: true,
      })
      .then((json) => resolve(json), reject);
  },
  actions: {
    /* 
     * saveMessage()
     *
     * Save a message
     */
    saveMessage() {
      var stream = this.get('message.stream');

      // if stream
        // Populate the stream attribute on the message
      if (stream) {
        this.set('message.stream', stream.key);
      }

      // if token_type
        // Populate the token_type_id attribute on the message     
      // else
        // Make sure token_type_id attribute is set to null
      if (this.sendTo === 'token_type') {
        var token_type = this.get('message.token_type_id');

        if (token_type) {
          this.set('message.token_type_id', token_type.id);
        }
      } else {
        this.set('message.token_type_id', null);
      }
      // if app_version
        // Populate the app_version attribute on the message     
      // else
        // Make sure app_version attribute is set to null
      if (this.sendTo === 'app_version') {
        var app_version = this.get('message.app_version');

        if (app_version) {
          this.set('message.app_version', app_version.name);
        }
      } else {
        this.set('message.app_version', null);
      }
      // if address
        // Populate the address attribute on the message     
      // else
        // Make sure address attribute is set to null
      if (this.sendTo === 'address') {
        var address = this.get('message.address');

        if (address) {
          this.set('message.address', address);
        }
      } else {
        this.set('message.address', null);
      }

      // Save the message, refresh the model and reset new messages
      this.message.save().then(() => {
        this.refreshModel();
        this.resetNewMessage();
      });
    },
    /* 
     * setMessagableAttrs()
     *
     * Handle the action when an event or article is selected from the select box
     * 
     * model    Ember data object     The event or article that has been selected
     */
    setMessagableAttrs(model) {
      this.set('linkedRecord', model);
      if (model.constructor.modelName === 'event') {
        this.message.set('event_id', model.id);
      } else if (model.constructor.modelName === 'article') {
        this.message.set('article_id', model.id);
      }
    },
    /* 
     * discard()
     *
     * Discard changes on a new Message
     */
    discard() {
      if (confirm('Are you sure?')) {
        this.message.deleteRecord();
        this.resetNewMessage();
      } else {
        return false;
      }
    },
    /* 
     * doSearchEvents()
     * 
     * Handle the action to search for events, debounce the request 
     * 
     * @query     str     The search query
     */
    doSearchEvents(query) {
      return new Promise((resolve, reject) => {
        debounce(this, this.searchEvents, query, resolve, reject, 1000);
      });
    },
    /* 
     * doSearchArticles()
     * 
     * Handle the action to search for articles, debounce the request 
     * 
     * @query     str     The search query
     */
    doSearchArticles(query) {
      return new Promise((resolve, reject) => {
        debounce(this, this.searchArticles, query, resolve, reject, 1000);
      });
    },
  },
});
