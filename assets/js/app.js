// entire code is wrapped in IIFE to prevent any free flowing of variables
(function () {
	// reference of initial containers where markups are rendered
	var mainContainer = document.getElementsByClassName('mainContainer')[0];
	var calendarWrapper = document.getElementsByClassName('calendarWrapper')[0];
	var calendarContainer = document.getElementsByClassName('calendarContainer')[0];
	var reminderWrapper = document.getElementsByClassName('reminderWrapper')[0];
	console.log(calendarContainer)
	// calendarContainer.style.height = calendarContainer.clientHeight + 'px'

	var localData = getLocalData();

	
	var calendar = new Calendar(calendarWrapper, localData);
	var reminder = new Reminder(reminderWrapper);
	var today = new Date();
	today.setHours(0,0,0,0);


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
			toggleReminderClass(calendar.getDateMonthYear(today));
			return;
		}
		calendar.setSelectedDate(obj.date);
		setTimeout(() => {
			calendar.generateDots(getLocalData());
		})
		var date = calendar.getDateMonthYear(obj.date);
		toggleReminderClass(date);
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

		var key = new Date();
		var copyObj = {...obj};
		delete copyObj.date;

		var k = key.getTime();
		objRef[k] = {
			...copyObj
		}
		localStorage.setItem('reminderData', JSON.stringify(data));
	}

	function retriveEventOnDate (date) {
		if (Object.keys(localData).length === 0) {
			return;
		}
		var dateVal = date.getDate();
		var monthVal = calendar.monthsArray[date.getMonth()].name.toLowerCase();
		var year = date.getFullYear();
		if (localData[year] === undefined) {
			return {};
		} else {
			if (localData[year][monthVal] === undefined) {
				return {};
			} else {
				if (localData[year][monthVal][dateVal] === undefined) {
					return {};
				}
			}
		}
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

	function init () {
		calendar.generateCalendar()
		calendar.registerDateClickMethod(dateClicked);
		reminder.generateReminderBlock();
		reminder.registerSaveEvent(reminderSaved);
		toggleReminderClass(calendar.getDateMonthYear(today));
		if (Object.keys(localData).length > 0) {
			generateReminders(today);
		}

		setTimeout(() => {
			calendarContainer.style.height = calendarContainer.clientHeight + 'px'
		},10)
	}

	init();

})()

