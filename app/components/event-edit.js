import { debounce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  store: service('store'),
  squares: service('squares'),
  saveProductionService: service('saveProduction'),

  is_saving: false,

  // UI States
  // Disable if a current user can't update.  
  is_disabled: computed('event.can_update',function(){
    return this.get('event.can_update') == false;
  }),  
  // Returns true if event is new or is in editing state.  
  is_editing_or_new: computed('is_editing', 'event.isNew', function(){
    return (this.get('event.isNew') === true || this.is_editing === true);
  }),

  // The default start and end dates for the event start and end time timepickers.  
  defaultStartDate: computed('event.start_time',function(){
    // If there's a start time already set on the event
      // return event.start_time
    // Otherwise
      // return the festival start_date as the default.  
    if(this.event.start_time){
      return this.event.start_time
    }else{
      return this.festival.start_date
    }
  }),
  defaultEndDate: computed('event.start_time',function(){
    // If there's an event end_time set
      // return event.end_time
    // If there's an event_start time 
      // return that as it's likely the real end_time will be similar
    // Otherwise
      // Return the festival start_date
    if(this.event.end_time){
      return this.event.end_time
    }else if(this.event.start_time){
      return this.event.start_time
    }else{
      return this.festival.start_date
    }
  }),
  // Initialise newProduction
  newProduction: false,

  // Hide image and display content block for productions shown in this component.  
  productionImageStyle:  htmlSafe('display: none;'),
  productionContentStyle: htmlSafe('display: block;'),

  didInsertElement(){
    // Pan the page to the top when creating a new production.
    if(this.event.isNew === true){
      this.squares.goToTop()
    }
  },
  
  didRender(){
    // Close all other open productions when rendering a new one.  
    this.squares.toggleSquare();
  },
  searchProductions(query, resolve, reject) {
    let store = this.store;
    store
      .adapterFor('production')
      .set('namespace', 'admin_api/v1/festivals/' + this.festival_id);
    return store
      .query('production', {
        festival_id: this.festival_id,
        page: 1,
        query: query,
        unpublished_and_unlocked: false,
        searching: true,
      })
      .then((json) => resolve(json), reject);
  },
  actions:{
    /* 
     * saveProductionAndEvent()
     *
     * Save the production and the new event
     */
    async saveProductionAndEvent(){
      this.set('is_saving', true);
      let productions = await this.event.productions;
      let production = productions[0];
      let venue = this.event.venue;
      if (production && venue) {
        production.save().then(()=>{
           // Ember data now seems to require peeking this record to get the ember data object
          venue = this.store.peekRecord('venue', venue.id);
          this.event.set('venue', venue);
          this.event.save().then(()=>{
            this.set('is_editing',false);
            this.set('is_saving', false);
            this.set('showProduction', false);
            this.refreshModel();
          }).catch((response)=>{
            this.set('is_saving', false);
            this.set('errors', response.errors);
          });
        }).catch((response)=>{
          this.set('is_saving', false);
          this.set('errors', response.errors);
        })
      } else {
        alert("You need to select an Act and Venue.");
        this.set('is_saving', false);
      }
    },

    /* 
     * searchProductions() and doSearchProductions()
     * 
     * Debounced search for a production.  
     * 
     * @query   string   The Search query
     */
    searchProductions(query){
      let store = this.store;
      store.adapterFor('production').set('namespace', 'admin_api/v1/festivals/'+this.festival_id);
      return store.query('production', {festival_id: this.festival_id, page: 1, query: query, unpublished_and_unlocked: false, searching: true});
    },
    doSearchProductions(query) {
      return new Promise((resolve, reject) => {
        debounce(this, this.searchProductions, query, resolve, reject, 1000);
      });
    },

    /* 
     * delete()
     * 
     * Delete a saved event that has been persisted to the API.  
     */
    delete(){
      var self = this;
      if (confirm("Are you sure?")) {
        this.event.destroyRecord().then(function(){
          self.set('showProduction', false);
          self.set('file_is_loaded', false);
          self.refreshModel();
        });
      } else {
        return false;
      }
    },    

    /* 
     * edit()
     * 
     * Edit a saved event.   
     */
    edit(){
      this.set('is_editing', true);
    },

    /* 
     * cancel()
     * 
     * Cancel editing a saved event.   
     */
    cancel(){
      this.event.rollbackAttributes();
      this.set('is_editing', false);
    },
    
    /* 
     * discard()
     * 
     * Discard editing a new event that hasn't been persisted to the server.   
     */
    discard(){
      if (confirm("Are you sure?")) {
        this.event.deleteRecord();
        this.resetNewEvent();
      } else {
        return false;
      }      
    },

    /* 
     * addProduction()
     * 
     * Creates a new production for this event.
     */
    async addProduction(){
      var newProduction = this.store.createRecord('production');
      var productions = await this.get('event.productions');
      this.set('event.productions', productions.addObject(newProduction));
      this.set('newProduction', newProduction);
    },

  }
});
