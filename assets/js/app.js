// entire code is wrapped in IIFE to prevent any free flowing of variables
(function () {
	// reference of initial containers where markups are rendered
	var mainContainer = document.getElementsByClassName('mainContainer')[0];
	var calendarWrapper = document.getElementsByClassName('calendarWrapper')[0];
	
	function dateClicked (date, event) {
		console.log(date, event)
	}
	
	// initail entry point
	function init () {
		var calendar = new Calendar(calendarWrapper);
		calendar.generateCalendar()
		calendar.registerDateClickMethod(dateClicked);
	}


	var reminderObject = {
		2019 : {
			july : {
				1 : {
					'timestampFrom-timestampTo' : {
						
					}
				}
			}
		}
	}

	init();

})()

