import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  store: service('store'),
  squares: service('squares'),

  // UI States
  is_saving: false,
  // Disable if a current user can't update.  
  is_disabled: computed('event.can_update',function(){
    return this.get('event.can_update') == false;
  }), 
  // Capturing selectedVenue when editing community events. 
  selectedVenue: computed('event.venue', function(){
    return this.get('event.venue');
  }),

  /* 
    *
    * save()
    * 
    * save Event.
    * 
    * event    ember data object   the event to be saved.
    */
  saveEvent(event){
    if(event){
      event
        .save()
        .then(() => {
          this.set('is_editing', false);
          this.set('is_saving', false);
          this.sendAction('refreshModel');
        })
        .catch(() => {
          this.set('is_saving', false);
        });
    }
  },

  didInsertElement(){
    if(this.get('event.isNew')){
      this.squares.goToTop()
    }
  },
  
  didRender(){
    this.squares.toggleSquare();
  },

  actions:{
    /* 
     * saveCommunityEvent()
     * 
     * Action to save a community event.  
     */
    saveCommunityEvent(){
      if(this.event){
        this.event.save()
          .then(()=>{
            this.set('is_editing',false);
            this.set('is_saving',false);
          })
          .catch(()=>{
            this.set('is_saving',false);
          })
          .catch(() => {
            this.set('is_saving', false);
          });
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
    delete(){
      var self = this;
      if (confirm("Are you sure?")) {
        this.event.destroyRecord().then(function(){
          self.set('file_is_loaded', false);
        });
      } else {
        return false;
      }
    },
  }
});
