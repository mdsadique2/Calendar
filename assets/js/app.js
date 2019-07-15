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

	
	

	function dateClicked (date, event) {
		console.log(date, event)
	}
	
	// initail entry point
	function init () {
		var calendar = new Calendar(calendarWrapper);
		calendar.generateCalendar()
		calendar.registerDateClickMethod(dateClicked);

		var reminder = new Reminder(reminderWrapper);
		reminder.generateReminderBlock();
		reminder.generateReminderEntry(template222);
		// reminder.generateReminderEntry(template222);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry(template);
		// reminder.generateReminderEntry();
		// reminder.generateReminderEntry();

		setTimeout(() => {
			calendarContainer.style.height = calendarContainer.clientHeight + 'px'

		},10)



	}



	var reminderObject = {
		2019 : {
			july : {
				1 : {
					1563143390579 : {
						fromTime: 1563143390579,
						toTime: 1563143750579,
						title: 'Meet John Doe cred task',
						location: 'Starbucks, XYZ St'
					}
				}
			}
		}
	}

	init();

})()

