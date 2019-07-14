
var lib = new Common();

class Reminder {
	
	constructor (parentContainer) {
		// this.data = data;						// ref to hold the order data
		this.parentContainer = parentContainer; // reference to hold parent container where order card is attached
		
		this.reminderHeader = null;
		this.reminderBlock = null
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


	reminderEventListener () {
		this.reminderBlock.addEventListener('click', (event) => {
			var className = event.target.className;
			if (className.indexOf('addButton') > -1) {
				event.stopPropagation();
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



	generateReminderBlock () {
		this.reminderBlock = lib.createElement('div', 'reminderBlock');
		this.generateReminderHeaderBlock();
		this.reminderEventListener();
		this.parentContainer.appendChild(this.reminderBlock);
	}

}