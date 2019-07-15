
var lib = new Common();

class Reminder {
	
	constructor (parentContainer) {
		// this.data = data;						// ref to hold the order data
		this.parentContainer = parentContainer; // reference to hold parent container where order card is attached
		
		this.reminderHeader = null;
		this.reminderBlock = null

		this.reminderFormBlock = null;
		this.reminderForm = null;

		this.currentReminderObject = {};
		this.getTimeArray();

		this.currentDate = {};
		this.today = new Date();
		this.today.setHours(0,0,0,0);

		this.currentDateObject = this.getDateMonthYear(this.today);

		this.saveCallback = null;


	}

	toggleClass(className, remove) {
		if (!remove) {
			this.reminderBlock.classList.add(className)
		} else {
			this.reminderBlock.classList.remove(className)
		}
	}

	registerSaveEvent (fn) {
		this.saveCallback = fn;
	}

	getDateMonthYear(date) {
		if (!date) {
			date = new Date ();
		}
		date.setHours(0,0,0,0);
		var month = date.getMonth();
		var day = date.getDay();
		var year = date.getFullYear();
		var dayName = this.daysArray[day];
		var monthName = this.monthsArray[month].name;
		var monthTotalDays = this.monthsArray[month].days;
		if (monthName.toLowerCase() === 'february') {
			if (year % 4 === 0) {
				monthTotalDays = 29;
			}
		}

		var firstDayDateRef = new Date(monthName+' '+year);
		var firstDayIndex = firstDayDateRef.getDay()
		var firstDayName = this.daysArray[firstDayIndex];

		return {
			dateObj: date,
			date: date.getDate(),
			day,
			month,
			monthName,
			dayName,
			monthTotalDays,
			firstDayIndex,
			firstDayName,
			year
		}
	}

	getDiffDays (date1, date2) {
		var diffTime = (date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
		return diffDays;
	}

	updateSelectedDate () {
		var left = this.reminderHeader.getElementsByClassName('left')[0];
		var obj = this.currentDateObject;
		var diff = this.getDiffDays(this.today, this.currentDate);
		console.log(diff);

		var appender = '';
		var dayToAppend = this.daysArray[obj.day];
		if (diff > 1 && diff <7) {
			appender = 'This'
		}

		if (diff > 6 && diff < 14) {
			appender = 'Next'
		}

		if (diff === 1) {
			appender = 'Tomorrow';
			dayToAppend = ''
		}

		left.childNodes[0].innerHTML = appender +' '+ dayToAppend;
		left.childNodes[1].innerHTML = obj.date+'/'+(obj.month+1)+'/'+obj.year;
	}

	setCurrentDate (date) {
		this.currentDate = date;
		this.currentDateObject = this.getDateMonthYear(date);
		this.updateSelectedDate();
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

		var todayDate = lib.createElement('div', 'todayDate', 'Today\'s Date');
		left.appendChild(todayDate);

		this.reminderHeader.appendChild(left);
		this.reminderHeader.appendChild(button);

		this.reminderBlock.appendChild(this.reminderHeader);

		this.setCurrentDate(this.today);
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
		var top = '0%'
		if (this.reminderBlock.className.indexOf('open') > -1) {
			top = '100%'
		}
		this.reminderFormBlock.style.height = top;
	}

	hideReminderModal () {
		this.reminderFormBlock.style.height = '0%';
	}

	handleAddEventClicks (event) {
		event.stopPropagation();
		if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'SELECT') {
			return;
		}
		var className = event.target.className;
	
		if ((className.indexOf('addEventForm') > -1 && className.indexOf('addEventFormContainer') === -1) || className.indexOf('datePicker') > -1) {
			return
		} 
		else if (className.indexOf('saveButton') > -1) {
			var saveSuccess = this.saveReminder();
			if (saveSuccess) {
				this.hideReminderModal();
			}
		} else {
			this.hideReminderModal();
			console.log('close;');

		}
	}

	reminderEventListener () {
		this.reminderBlock.addEventListener('click', (event) => {
			var className = event.target.className;
			var addEventFormBlock = event.target.closest('.addEventFormContainer');
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
			} 
			else if (className.indexOf('left') > -1 || className.indexOf('dateValue') > -1 || className.indexOf('title') > -1 || className.indexOf('todayDate') > -1 ) {
				this.saveCallback({reset: this.currentDateObject});
			}
			else if (className.indexOf('reminderBlock') > -1) {
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

	generateDateOptions (month) {
		var dateSelectElement = this.reminderForm.getElementsByClassName('dateSelect')[0];
		var yearSelectElement = this.reminderForm.getElementsByClassName('yearSelect')[0];

		var yearValue = yearSelectElement.value;

		var index = dateSelectElement.selectedIndex;
		var obj = this.monthsArray[index];

		dateSelectElement.innerHTML = '';
		if(obj.name.toLowerCase() === 'february') {
			if (yearValue % 4 === 0) {
				obj.days = 29;
			}
		}

		for (var i=1; i <= obj.days; i++) {
			var option = lib.createElement('option', '', i);
			option.setAttribute('value', i);
			dateSelectElement.appendChild(option);
		}
		dateSelectElement.value = this.currentDateObject.date;
	}

	getYearArray () {
		var year = parseInt((new Date()).getFullYear())
		var yearsArray = [];
		for (var i = (year - 40); i <= (year + 20); i++) {
			yearsArray.push(i);
		}
		return {
			currentYear: year,
			yearsArray
		}
	}

	getTimeArray () {
		var start = 0;
		var stepMins = 30;
		var arr = []
		for (var i=0; i<24; i++){
			arr.push(i+':'+'00')
			arr.push(i+':'+'30')
		}
		return arr;
	}

	generateReminderForm () {
		this.reminderFormBlock = lib.createElement('div', 'addEventFormContainer');
		this.reminderForm = lib.createElement('div', 'addEventForm');

		var datePicker = lib.createElement('div', 'datePicker');
		// var monthSelect = lib.createSingleSelect(valuesArray, defaultValue, classList)

		var monthsArray = [];
		this.monthsArray.forEach((elm, i) => {
			monthsArray[i] = elm.name;
		})

		var yearsObj = this.getYearArray()		
	
		var monthSelect = lib.createSingleSelect(monthsArray, monthsArray[this.currentDateObject.month], 'monthSelect');
		var dateSelect = lib.createSingleSelect([''], null ,'dateSelect');
		var yearSelect = lib.createSingleSelect(yearsObj.yearsArray, yearsObj.currentYear ,'yearSelect');

		datePicker.appendChild(monthSelect);
		datePicker.appendChild(dateSelect);
		datePicker.appendChild(yearSelect);

		var timeArray = this.getTimeArray();

		var timePicker = lib.createElement('div', 'datePicker timePicker');
		var timeFromSelect = lib.createSingleSelect(timeArray, timeArray[1] ,'timeFromSelect');
		var timeToSelect = lib.createSingleSelect(timeArray, timeArray[2] ,'timeToSelect');
		timePicker.appendChild(timeFromSelect);
		timePicker.appendChild(timeToSelect);

		var titleInput = lib.createInput('title');
		titleInput.setAttribute('placeholder', 'Reminder Title')
		var locationInput = lib.createInput('location');
		locationInput.setAttribute('placeholder', 'Reminder location')

		var saveButton = lib.createElement('button', 'saveButton', 'Create');
		saveButton.setAttribute('type', 'button');

		this.reminderForm.appendChild(datePicker);
		this.reminderForm.appendChild(titleInput);
		this.reminderForm.appendChild(locationInput);
		this.reminderForm.appendChild(timePicker);
		this.reminderForm.appendChild(saveButton);

		this.reminderForm.addEventListener('change', (event) => {
			this.formFieldsChanged(event);
		})

		this.reminderFormBlock.appendChild(this.reminderForm);
		this.reminderBlock.appendChild(this.reminderFormBlock);

		this.generateDateOptions();
		this.currentReminderObject.monthSelect = this.monthsArray[this.currentDateObject.month];
		this.currentReminderObject.yearSelect = this.currentDateObject.year;
		this.currentReminderObject.dateSelect = this.currentDateObject.date;
		this.currentReminderObject.timeFromSelect = timeArray[1];
		this.currentReminderObject.timeToSelect = timeArray[2];
	}

	formFieldsChanged (event) {
		var className = event.target.className;
		this.currentReminderObject[className] = event.target.value;
		if (className === 'monthSelect') {
			this.currentReminderObject[className] = this.monthsArray[event.target.selectedIndex];
		}
	}

	removeAllReminders () {
		var length = this.reminderBlock.childElementCount;
		for(var i=2; i<length; i++) {
			var node = this.reminderBlock.childNodes[2];
			this.reminderBlock.removeChild(node);
		}
	}

	saveReminder () {
		var ref = this.currentReminderObject;
		var date = new Date(ref.yearSelect,ref.monthSelect.index,ref.dateSelect);
		date.setHours(0,0,0,0);
		var fromRef = ref.timeFromSelect.split(':');
		var toRef = ref.timeToSelect.split(':');
		var dateFromTime = new Date(ref.yearSelect, ref.monthSelect.index, ref.dateSelect, fromRef[0], fromRef[1]);
		var dateToTime = new Date(ref.yearSelect, ref.monthSelect.index, ref.dateSelect, toRef[0], toRef[1]);
		
		var obj = {
			fromTime: ref.timeFromSelect,
			toTime: ref.timeToSelect,
			title: ref.title,
			location: ref.location,
		}

		if (obj.title === undefined ||obj.location === undefined || obj.title.trim() === '' || obj.location.trim() === '') {
			alert("Invalid title or location");
			return false;
		}
		var diff = this.getDiffDays(date, this.currentDateObject.dateObj);
		if (diff === 0) {
			this.generateReminderEntry(obj);
		} else {
			this.setCurrentDate(date);
			this.removeAllReminders();
			this.generateReminderEntry(obj);
		}
		this.saveCallback({...obj, date});
		return true;
	}



	generateReminderBlock () {
		this.reminderBlock = lib.createElement('div', 'reminderBlock');
		this.generateReminderForm();
		this.generateReminderHeaderBlock();
		this.reminderEventListener();
		this.parentContainer.appendChild(this.reminderBlock);
	}

}

Reminder.prototype.daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Reminder.prototype.monthsArray = [{name: 'January', days: 31, index:0}, {name: 'February', days: 29, index:1},{name: 'March', days: 31, index:2},{name: 'April', days: 30, index:3},{name: 'May', days: 31, index:4},{name: 'June', days: 30, index:5},{name: 'July', days: 31, index:6}, {name: 'August', days: 31, index:7},{name: 'September', days: 30, index:8},{name: 'October', days: 31, index:9},{name: 'November', days: 30, index:10},{name: 'December', days: 31, index:11}]


