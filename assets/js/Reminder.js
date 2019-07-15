
var lib = new Common();

class Reminder {
	
	constructor (parentContainer) {
		// this.data = data;						// ref to hold the order data
		this.parentContainer = parentContainer; // reference to hold parent container where order card is attached
		
		this.reminderHeader = null;
		this.reminderBlock = null

		this.reminderFormBlock = null;
		this.reminderForm = null;
	}

	
	generateReminderHeaderBlock () {
		this.reminderHeader = lib.createElement('div', 'reminderTitleAction');
		var left = lib.createElement('div', 'left');
		var title = lib.createElement('div', 'title', 'Next Sunday');
		var dateValue = lib.createElement('div', 'dateValue', '11/07/2019');
		var button = lib.createElement('button', 'button addButton', 'Add New');
		button.setAttribute('type', 'button');

		left.appendChild(title);
		left.appendChild(dateValue);

		this.reminderHeader.appendChild(left);
		this.reminderHeader.appendChild(button);

		this.reminderBlock.appendChild(this.reminderHeader);
	}


	toggleThisBlock () {
		var className = this.reminderBlock.className;
		if (className.indexOf('open') > -1) {
			this.reminderBlock.classList.remove("open");
			setTimeout(() => {
				this.reminderBlock.classList.remove("transition");
			},300)

		} else {
			this.reminderBlock.classList.add("transition");
			setTimeout(() => {
				this.reminderBlock.classList.add("open");
			},5)
		}
	}

	showReminderModal () {
		var top = '-100px'
		if (this.reminderBlock.className.indexOf('open') > -1) {
			top = '0px'
		}
		this.reminderFormBlock.style.top = top;
	}

	hideReminderModal () {
		this.reminderFormBlock.style.top = '5000px';
	}

	handleAddEventClicks (event) {
		event.stopPropagation();
		if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'SELECT') {
			return;
		}
		var className = event.target.className
		console.log(className);
		if (className.indexOf('addEventForm') > -1 && className.indexOf('addEventFormContainer') === -1) {
			return
		} 
		if (className.indexOf('saveButton') > -1) {
			console.log('saveButton;');
			this.hideReminderModal();
			setTimeout(() => {
				this.toggleThisBlock(this.reminderBlock);
			},100)

		} else {
			this.hideReminderModal();
			console.log('close;');

		}
	}

	reminderEventListener () {
		this.reminderBlock.addEventListener('click', (event) => {
			var className = event.target.className;
			var addEventFormBlock = event.target.closest('.addEventFormContainer');
			console.log(addEventFormBlock);

			if (className.indexOf('addEventForm') > -1 || className.indexOf('addEventFormContainer') > -1) {
				this.handleAddEventClicks(event);
				return;
			}

			if (addEventFormBlock !== null) {
				if (addEventFormBlock.className.indexOf('addEventForm') > -1 || addEventFormBlock.className.indexOf('addEventFormContainer') > -1) {
					this.handleAddEventClicks(event);
					return;
				}
			}




			if (className.indexOf('addButton') > -1) {
				event.stopPropagation();
				if (this.reminderBlock.className.indexOf('open') === -1) {
					this.toggleThisBlock(this.reminderBlock);
				}

				setTimeout(() => {
					this.showReminderModal();
				},10)
			} else if (className.indexOf('reminderBlock') > -1) {
				this.toggleThisBlock(this.reminderBlock);
			} else {
				var closestElement = event.target.closest('.reminderBlock');
				this.toggleThisBlock(this.reminderBlock);
			}
		})
	}

	generateReminderEntry (reminderData) {
		var reminderRow = lib.createElement('div', 'reminder');

		var line = lib.createElement('div', 'line');
		var circle = lib.createElement('div', 'circle');
		line.appendChild(circle);
		reminderRow.appendChild(line);

		var content = lib.createElement('div', 'content');
		var title = lib.createElement('div', 'title', reminderData.title);

		var location = lib.createElement('div', 'contentText location');
		var locationIcon = lib.createElement('i', 'icon icon-location-alt');
		var locationText = lib.createElement('div', 'text', reminderData.location);
		location.appendChild(locationIcon);
		location.appendChild(locationText);

		var time = lib.createElement('div', 'contentText time');
		var timeIcon = lib.createElement('i', 'icon icon-clock');
		var timeTextFromTime = lib.createElement('div', 'text fromTime', reminderData.fromTime);
		var timeTextToTime = lib.createElement('div', 'text toTime', reminderData.toTime);
		time.appendChild(timeIcon);
		time.appendChild(timeTextFromTime);
		time.appendChild(timeTextToTime);

		content.appendChild(title);
		content.appendChild(location);
		content.appendChild(time);

		reminderRow.appendChild(content);

		this.reminderBlock.appendChild(reminderRow);
	}


	generateReminderForm () {
		this.reminderFormBlock = lib.createElement('div', 'addEventFormContainer');
		this.reminderForm = lib.createElement('div', 'addEventForm');

		var datePicker = lib.createElement('div', 'datePicker');
		// var monthSelect = lib.createSingleSelect(valuesArray, defaultValue, classList)

		var monthsArray = [];
		this.monthsArray.forEach((elm,i) => {
			monthsArray[i] = elm.name;
		})


		var monthSelect = lib.createSingleSelect(monthsArray);
		var dateSelect = lib.createSingleSelect(['']);
		var yearSelect = lib.createSingleSelect(['']);
		datePicker.appendChild(monthSelect);
		datePicker.appendChild(dateSelect);
		datePicker.appendChild(yearSelect);

		var titleInput = lib.createInput('title');
		var locationInput = lib.createInput('location');
		var saveButton = lib.createElement('button', 'saveButton', 'Create');
		saveButton.setAttribute('type', 'button');

		this.reminderForm.appendChild(datePicker);
		this.reminderForm.appendChild(titleInput);
		this.reminderForm.appendChild(locationInput);
		this.reminderForm.appendChild(saveButton);

		this.reminderFormBlock.appendChild(this.reminderForm);
		this.reminderBlock.appendChild(this.reminderFormBlock);
	}



	generateReminderBlock () {
		this.reminderBlock = lib.createElement('div', 'reminderBlock');
		this.generateReminderForm();
		this.generateReminderHeaderBlock();
		this.reminderEventListener();
		this.parentContainer.appendChild(this.reminderBlock);
	}

}

Reminder.prototype.daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
Reminder.prototype.monthsArray = [{name: 'January', days: 31},{name: 'February', days: 29},{name: 'March', days: 31},{name: 'April', days: 30},{name: 'May', days: 31},{name: 'June', days: 30},{name: 'July', days: 31}, {name: 'August', days: 31},{name: 'September', days: 30},{name: 'October', days: 31},{name: 'November', days: 30},{name: 'December', days: 31}]


