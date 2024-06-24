import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  
  // UI States
  is_saving: false,
  // Returns true if event is new and unsaved or saved and being edited. 
  // If true the edit view is displayed, if not the show view is displayed.  
  is_editing_or_new: computed('is_editing', 'event.isNew', function(){
    return (this.get('event.isNew') === true || this.is_editing === true);
  }),
  is_disabled: computed('event.aasm_state','current_user', function(){
    var can_edit = false;
    // if the current user has admin or super admin privileges 
      // they can edit
    // Otherwise
      // If the event has aasm_state :draft and the current user can edit the events venue
      // allow the to edit.  
    if(
      this.get('current_user.is_admin_or_super_admin')
      ){
      can_edit = true;
    }else{
      can_edit = (
        this.get('event.aasm_state') === "draft" &&
        this.get('current_user.can_edit_venues') &&
        this.get('current_user.can_edit_venues').indexOf(this.get('selectedVenue.id')) > -1
        );
    }
    return can_edit == false;
  }),

  // Capturing venue selected when created/editing productions. 
  selectedVenue: computed('event.venue', function(){
    return this.get('event.venue');
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

  // The position of the datepicker widget
  widgetPositioning: { horizontal: 'left', vertical: 'top' },

  actions:{
    /* 
     * delete()
     * 
     * Delete a saved production which has been persisted to the API.   
     */
    delete(){
      if (confirm("Are you sure?")) {
        this.event.deleteRecord();
        this.event.save();
      } else {
        return false;
      }
    },

    /* 
     * discard()
     * 
     * Discard an unsaved record, cancel creating a new event and reset.  
     */
    discard(){
      if (confirm("Are you sure?")) {
        this.event.deleteRecord();
        this.sendAction('resetNewEvent');
      } else {
        return false;
      }
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
     * Disable editing mode for this event and loose unsaved changes.  
     */
    cancel(){
      this.event.rollbackAttributes();
      this.set('is_editing', false);
    },

    /* 
     * saveEvent()
     * 
     * Save the event
     */
    saveEvent(){
      this.set('is_saving', true);
      return this.saveEvent(this.event)
                .then(()=>{
                  this.set('is_editing', false);
                  this.set('is_saving', false);
                })
                .catch((response)=>{
                  this.set('errors',response.errors);
                  this.set('is_saving', false);
                });
    },

    /* 
     * cancelEvent()
     * 
     * Set the aasm_state for an event to cancelled
     */
    cancelEvent(){
      this.event.set('aasm_state', 'cancelled');
      this.send('saveEvent');
    },
  },
});
