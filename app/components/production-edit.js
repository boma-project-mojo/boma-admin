import { Promise, allSettled } from 'rsvp';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  store: service('store'),
  squares: service('squares'),

  // Tracking the status of actions used to change the state of productions from :draft through :locked to :published.  
  // This is passed to the various components that handle this state change (locked-state and published-locked-state) 
  // to ascertain when buttons should be disabled whilst requests are being processed.  
  settingState: false,
  // This component is used in the event-edit component when this flag is set to true.  
  eventsView: false,
  eventsViewClass: computed('eventsView', function () {
    if (this.eventsView === true) {
      return 'active';
    }
  }),
  // Capturing tags selected when created/editing productions. 
  selectedTags: computed('production.tags', function(){
    return this.get('production.tags');
  }),
  // Show the length of the short description.  
  short_description_length: computed('production.short_description', function(){
    let sd = this.get('production.short_description');
    if(sd){return sd.length}else{return 0;}
  }), 
  // UI States
  // Shows true if production is new and unsaved or saved and being edited. 
  // If true the edit view is displayed, if not the show view is displayed.  
  is_editing_or_new: computed('is_editing', 'production.isNew', function(){
    return (this.get('production.isNew') === true || this.is_editing === true);
  }),
  // Disable if a current user can't update.  
  is_disabled: computed('production.can_update',function(){
    return this.get('production.can_update') == false;
  }),
  // Check if this is the events view and the production is in state :locked or :published
  // Used to hide actions if state is :published or :locked and the component is being used by edit-event.  
  is_events_view_and_is_published_or_locked: computed('production.aasm_state',function(){
    return this.eventsView && (this.get('production.aasm_state') == 'published' || this.get('production.aasm_state') == 'locked');
  }), 

  didInsertElement(){
    // Pan the page to the top when creating a new production.
    if(this.production.get('isNew') && !this.eventsView){
      this.squares.goToTop()
    }
  },

  didRender(){
    // Close all other open productions when rendering a new one.  
    this.squares.toggleSquare();
  },

  actions: {
    /* 
     * addEvent()
     * 
     * Initialise a new event and add it to a production
     */
    async addEvent(){
      var newEvent = this.store.createRecord('event');
      var productionEvents = await this.get('production.events')
      productionEvents.pushObject(newEvent);
    },

    /* 
     * edit()
     * 
     * Enable edit mode for this production.  
     */
    edit(){
      this.set('is_editing', true);
    },

    /* 
     * cancel()
     * 
     * Disable editing mode for this production and loose unsaved changes.  
     */
    cancel(){
      this.production.rollbackAttributes();
      this.set('is_editing', false);
    },

    /* 
     * discard()
     * 
     * Discard an unsaved record, cancel creating a new production and reset.  
     */
    discard(){
      if (confirm("Are you sure?")) {
        this.production.deleteRecord();
        this.resetNewProduction();
      } else {
        return false;
      }
    },
    
    /* 
     * delete()
     *
     * Delete a saved production which has been persisted to the API.   
     */
    delete(){
      var self = this;
      if (confirm("Are you sure?")) {
        this.production.destroyRecord().then(function(){
          self.refreshModel();
        });     
      } else {
        return false;
      }
    },

    /* 
     * saveEventsAndNewProduction()
     *
     * Save a new new production and then save it's events.  
     */
    saveEventsAndNewProduction(){
      this.set('is_saving',true);
      if(this.get('production.isNew')){
        this.saveProduction(this).then(()=>{
          this.send('saveEventsAndProduction', true);
        });
      }
    },

    /* 
     * saveEventsAndProduction()
     *
     * Save all events and then save the related production
     */
    saveEventsAndProduction(refreshModel=false){
      this.set('is_saving',true);
      if(this.eventsView == false){
        this.production.events.then((events)=>{
          var saveEvents = events.map((event)=>{
            if(Object.keys(event.changedAttributes()).length > 0){
              return new Promise((resolve,reject)=>{
                return event
                  .save()
                  .then(()=>resolve(event))
                  .catch(()=>reject(event));
              });
            } else {
              console.log('skipped saving, nothing has changed...');
            }
          })

          allSettled(saveEvents).then((array) => {
            if (array.filter((e) => e.state == 'rejected').length > 0) {
              this.set('is_saving', false);
              //nothing
            } else {
              this.saveProduction(this, refreshModel).then(() => {
                this.set('is_saving', false);
              });
            }
          });
        });
      } else {
        this.set('is_saving', false);
        this.saveProduction(this, refreshModel);
      }
    },

    /* 
     * saveEvent()
     *
     * Save an event.  
     */
    saveEvent(event){
      return event.save(); 
    },
  }
});
