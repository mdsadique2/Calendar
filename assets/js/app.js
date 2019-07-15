// entire code is wrapped in IIFE to prevent any free flowing of variables
(function () {
	// reference of initial containers where markups are rendered
	var mainContainer = document.getElementsByClassName('mainContainer')[0];
	var calendarWrapper = document.getElementsByClassName('calendarWrapper')[0];
	var calendarContainer = document.getElementsByClassName('calendarContainer')[0];
	var reminderWrapper = document.getElementsByClassName('reminderWrapper')[0];
	console.log(calendarContainer)
	// calendarContainer.style.height = calendarContainer.clientHeight + 'px'


	var template = {
		fromTime: 1563143390579,
		toTime: 1563143750579,
		title: 'Meet John Doe cred task',
		location: 'Starbucks, XYZ St'
	}

	var template222 = {
		fromTime: 1563143390579,
		toTime: 1563143750579,
		title: 'Go buy Groceries ',
		location: 'Store, XYZ St'
	}

	
	var calendar = new Calendar(calendarWrapper);
	var reminder = new Reminder(reminderWrapper);
	var today = new Date();
	today.setHours(0,0,0,0);
	var localData = getLocalData();


	function dateClicked (date, event) {
		var dateVal = new Date(date.year, date.month, date.date);
		reminder.setCurrentDate(dateVal);
		toggleReminderClass(date);
		generateReminders(dateVal);
	}

	function toggleReminderClass (date) {
		if (date.day === 0 || date.day ===6) {
			reminder.toggleClass('weekend');
		} else{
			reminder.toggleClass('weekend', true)
		}
	}

	function reminderSaved (obj) {
		if (obj.reset !== undefined) {
			calendar.setSelectedDate(today);
			reminder.setCurrentDate(today);
			generateReminders(today);
			return;
		}
		calendar.setSelectedDate(obj.date);
		toggleReminderClass(obj);
		setLocalData(obj);
	}

	function getLocalData () {
		var data = localStorage.getItem('reminderData');
		if (data === null) {
			localStorage.setItem('reminderData', '{}');
			return {};
		}
		return JSON.parse(data);
	}

	function setLocalData (obj) {
		var data = getLocalData();
		var year = obj.date.getFullYear();
		var month = calendar.monthsArray[obj.date.getMonth()].name.toLowerCase();
		var date = obj.date.getDate();

		var objRef = {};

		if (data[year] !== undefined) {
			objRef = data[year] 
		} else {
			data[year] = {};
			objRef = data[year];
		}

		if (data[year][month] !== undefined) {
			objRef = data[year][month];
		} else {
			data[year][month] = {};
			objRef = data[year][month];
		}

		if (data[year][month][date] !== undefined) {
			objRef = data[year][month][date];
		} else {
			data[year][month][date] = {};
			objRef = data[year][month][date];
		}

		var key = new Date(obj.date);
		var from = obj.fromTime.split(':');
		key.setHours(from[0], from[1], 0, 0);

		var copyObj = {...obj};
		delete copyObj.date;

		var k = key.getTime();
		objRef[k] = {
			...copyObj
		}

		localStorage.setItem('reminderData', JSON.stringify(data));
	}

	function retriveEventOnDate (date) {
		var dateVal = date.getDate();
		var monthVal = calendar.monthsArray[date.getMonth()].name.toLowerCase();
		var year = date.getFullYear();
		var obj = localData[year][monthVal][dateVal];
		return obj
	}

	function generateReminders(date) {
		var obj = retriveEventOnDate(date);
		reminder.removeAllReminders();
		for (var key in obj) {
			reminder.generateReminderEntry(obj[key]);
		}
	}

	// initail entry point
	function init () {
		calendar.generateCalendar()
		calendar.registerDateClickMethod(dateClicked);
		reminder.generateReminderBlock();
		reminder.registerSaveEvent(reminderSaved);
		if (Object.keys(localData).length > 0) {
			generateReminders(today);
		}

		setTimeout(() => {
			calendarContainer.style.height = calendarContainer.clientHeight + 'px'
		},10)
	}

	init();

})()

