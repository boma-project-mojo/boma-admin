import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { set } from '@ember/object';

export default class TdDatetimepickerComponent extends Component {
	picker = null;
	@tracked date = null;

  @action
  async createDateTimePicker(element) {
    let opts = {
			display: {
        theme: 'dark',
	    	inline: this.args.inline || false,
	    	sideBySide: this.args.sideBySide || false,
	    	components: {
	    		useTwentyfourHour: true
	    	},
	      icons: {
	        type: 'icons',
	        time: 'fas fa-clock',
	        date: 'fas fa-calendar',
	        up: 'fas fa-arrow-up',
	        down: 'fas fa-arrow-down',
	        previous: 'fas fa-chevron-left',
	        next: 'fas fa-chevron-right',
	        today: 'fas fa-calendar-check',
	        clear: 'fas fa-trash',
	        close: 'fas fa-xmark'
	      },
	   	},
	   	stepping: this.args.stepping || 1,
	   	restrictions: {
	   		minDate: this.args.minDate,
	   		maxDate: this.args.maxDate
	   	},
	   	viewDate: this.args.defaultDate || new Date().toDateString(),
	   	defaultDate: this.args.defaultDate || new Date().toDateString(),
	   	useCurrent: false
		}

		this.picker = await new tempusDominus.TempusDominus(element, opts)

		// Set the default date
		let date = this.args.date || new Date()
		const parsedDate = this.picker.dates.parseInput(date);

		this.picker.dates.setValue(parsedDate, this.picker.dates.lastPickedIndex);
		
		// Subscribe the event
		const subscription = this.picker.subscribe(tempusDominus.Namespace.events.change, (e) => {
			this.args.setDate(e.date);
		});
  }

  @action
  async updateDateTimePicker(element, args) {
    let defaultDate = args[0]

  	// Works round an issue where when the datepicker is first opened updating the default date
  	// cuases the picker to show the current date rather than the selected date.  
  	if(this.picker.optionsStore.options.defaultDate.getTime() === defaultDate.getTime()) return

  	let opts = {
	   	defaultDate: defaultDate || new Date(),
		}

    this.picker.updateOptions(opts);

		// Set the default date
		let date = defaultDate || new Date()
		const parsedDate = this.picker.dates.parseInput(date);

		this.picker.dates.setValue(parsedDate, this.picker.dates.lastPickedIndex);
  }
}