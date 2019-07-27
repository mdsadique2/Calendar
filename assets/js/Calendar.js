
var lib = new Common();

class Calendar {
	
	constructor (parentContainer, localData) {
		this.calendar = null;
		this.calendarHeader = {
			leftButton: null,
			rightButton: null,
			centerButton: null,
			headerRef: null
		};


		this.calendarBody = null;
		this.parentContainer = parentContainer;
		this.currentDate = this.getDateMonthYear();
		this.datePicker = null;
		this.selectedDate = null;
		this.localData = localData;
		this.initializeMembers();
	}

	setSelectedDate (dateObj) {
		var detailObj = this.getDateMonthYear(dateObj);
		var classToFind = 'date-'+detailObj.date;
		this.currentDate = detailObj; // this.getDateMonthYear(detailObj.dateObj);
		this.initializeCalendarToThisDate();
		setTimeout(()=>{
			var currentCal = this.calendarBody.getElementsByClassName('currentCal')[0];
			var cell = currentCal.getElementsByClassName(classToFind)[0];
			cell.classList.add("selected");
			if (this.selectedDate !== null) {
				this.selectedDate.classList.remove("selected");
			}
			this.selectedDate = cell;
		}, 250)
	}

	registerDateClickMethod (fn) {
		this.dateClicked = fn; 
	}

	initializeMembers () {
		this.currentMonthCalendar = lib.createElement('div', 'cellsGroup calWrapper currentCal');
		this.nextMonthCalendar = lib.createElement('div', 'cellsGroup calWrapper nextCal');
		this.prevMonthCalendar = lib.createElement('div', 'cellsGroup calWrapper prevCal');
	}


	getDateMonthYear(date) {
		if (!date) {
			date = new Date ();
		}
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

		var firstDayDateRef = new Date(year,month);
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


	generateCalendarHeader () {
		var header = {};
		var centerButtonText = this.monthsArray[this.currentDate.month].name +' '+ this.currentDate.year;
		header.headerRef = lib.createElement('header', 'header');
		header.leftButton = lib.createElement('button', 'headerButton leftButton');
		header.rightButton = lib.createElement('button', 'headerButton rightButton');
		header.centerButton = lib.createElement('button', 'headerButton centerButton', centerButtonText);

		header.leftButton.setAttribute('type', 'button');
		header.rightButton.setAttribute('type', 'button');
		header.centerButton.setAttribute('type', 'button');

		var leftIcon = lib.createElement('i', 'arrow  arrowLeft icon-left-circle');
		var rightIcon = lib.createElement('i', 'arrow  arrowRight icon-right-circle');
		header.leftButton.appendChild(leftIcon);
		header.rightButton.appendChild(rightIcon);

		header.headerRef.appendChild(header.leftButton);
		header.headerRef.appendChild(header.centerButton);
		header.headerRef.appendChild(header.rightButton);

		this.calendarHeader = header;
		this.calendar.appendChild(this.calendarHeader.headerRef);
	}


	generateCalendarBodyHeaderRow () {
		var daysHeader = lib.createElement('div', 'cellsGroup');
		this.daysArray.forEach( (day, index) => {
			var text = day[0] + day[1]
			var className = 'cell headerCell ' + day;
			if (index === 0 || index === 6) {
				className = className +' weekend'
			}
			var cell = lib.createElement('div', className, text);
			daysHeader.appendChild(cell);
		})
		this.calendarBody.appendChild(daysHeader);
	}


	generateCalendarBodyCells (type) {
		var row = ['row-01', 'row-02', 'row-03', 'row-04', 'row-05', 'row-06']

		var refToCheck = this.currentDate;
		var bodyRef = this.currentMonthCalendar

		if (type === 'current' || type === undefined) {
			bodyRef = this.currentMonthCalendar
		} else{
			var dateObject = new Date(this.currentDate.dateObj);
			if (type === 'prev') {
				bodyRef = this.prevMonthCalendar
				dateObject.setMonth(dateObject.getMonth() - 1);

			} else {
				bodyRef = this.nextMonthCalendar
				dateObject.setMonth(dateObject.getMonth() + 1);
			}
			refToCheck = this.getDateMonthYear(dateObject);
		} 

		var maxDays = refToCheck.monthTotalDays;
		var today = this.getDateMonthYear();
		var runningMonth = false;

		if (refToCheck.month === today.month && refToCheck.year === today.year) {
			runningMonth = true;
		}
		
		var fill = false;
		var dateToPrint = 1;
		row.forEach( (row, index) => {
			var currentRow = row;
			this.daysArray.forEach((day, i) => {
				if (refToCheck.firstDayIndex === i && dateToPrint < maxDays) {
					fill = true;
				}
				var currentColumn = 'col-0'+i;
				var cell = {}
				if (fill === true) {

					let className = `cell days ${day.toLowerCase()} ${currentColumn} ${currentRow} date-${dateToPrint}`;
					if (i === 0 || i === 6) {
						className = className + ' weekend';
					}

					if (runningMonth === true && today.date === dateToPrint) {
						className = className + ' today';
					}


					cell = lib.createElement('div', className, dateToPrint);
					if (dateToPrint >= maxDays) {
						fill = false;
					} else {
						dateToPrint = dateToPrint + 1;
					}
				} else {
					cell = lib.createElement('div', `cell ${day.toLowerCase()} ${currentColumn} ${currentRow}`, '');
				}
				bodyRef.appendChild(cell);
			})
		})
		this.calendarBody.appendChild(bodyRef);
	}

	updateButtonTitle () {
		var centerButtonText = this.monthsArray[this.currentDate.month].name +' '+ this.currentDate.year;
		this.calendarHeader.centerButton.innerHTML = centerButtonText;
	}

	handleDateClicked (event) {
		var className = event.target.className;
		var elm = event.target;
		if (className.indexOf('dotContainer') > -1 || className.indexOf('dot') > -1) {
			elm = event.target.closest('.days');
			className = elm.className;
		}

		if (className.indexOf('selected') > -1) {
			return;
		}

		if (this.selectedDate !== null) {
			this.selectedDate.classList.remove("selected");
		}

		var date = elm.innerText;
		var month = this.currentDate.month + 1;
		var year = this.currentDate.year;
		var dateObj = new Date(month+'/'+date+'/'+year);
		var dateToReturn = this.getDateMonthYear(dateObj);

		this.selectedDate = elm;
		this.selectedDate.className = this.selectedDate.className + ' selected'

		this.dateClicked.call('', dateToReturn, event)
	}

	clickEventHandler (event) {
		event.stopPropagation();
		var className = event.target.className;
		if (className.indexOf('dotContainer') > -1 || className.indexOf('dot') > -1) {
			this.handleDateClicked(event);
		}

		if (className.indexOf('days') > -1) {
			this.handleDateClicked(event);
		} else if (className.indexOf('headerButton') > -1 || className.indexOf('arrow') > -1) {
			this.prevNextCalendarHandler(event);
		} else if (className.indexOf('datePickerButton') > -1) {
			this.handleDatePickerClick(event);
		}
	}

	initializeCalendarToThisDate () {
		for (var i=3; i>0; i--) {
			this.calendarBody.removeChild(this.calendarBody.children[i])
		}
		this.initializeMembers();
		this.updateButtonTitle();
		this.generateCalendarBodyCells();
		this.generateAnotherMonth();
		this.generateDots();
	}

	handleDatePickerClick (event) {
		var className = event.target.className;
		if (className.indexOf('applyButton') > -1) {
			var month = (this.datePicker.getElementsByClassName('monthSelect')[0]).selectedIndex;
			var year = (this.datePicker.getElementsByClassName('yearSelect')[0]).value;
			this.currentDate = this.getDateMonthYear(new Date(year, month));
			this.initializeCalendarToThisDate();
		} 
		this.datePicker.style.top = '-100px'
	}


	moveLeft () {
		var currentBody = this.currentMonthCalendar;
		var next = this.nextMonthCalendar;

		this.currentMonthCalendar = this.prevMonthCalendar;
		this.nextMonthCalendar = currentBody;
		this.currentMonthCalendar.className = 'cellsGroup calWrapper currentCal'
		this.nextMonthCalendar.className = 'cellsGroup calWrapper nextCal';

		var dateObject = new Date(this.currentDate.dateObj);
		dateObject.setMonth(dateObject.getMonth() - 1);
		this.currentDate = this.getDateMonthYear(dateObject);
		this.calendarBody.removeChild(next);
		this.prevMonthCalendar = lib.createElement('div', 'cellsGroup calWrapper prevCal');
		this.generateCalendarBodyCells('prev');
		this.updateButtonTitle();
		this.updateDatePickerValue(dateObject);
		this.generateDots();
	}

	moveRight () {
		var currentBody = this.currentMonthCalendar;
		var prev = this.prevMonthCalendar;
		
		this.currentMonthCalendar = this.nextMonthCalendar;
		this.prevMonthCalendar = currentBody;

		this.currentMonthCalendar.className = 'cellsGroup calWrapper currentCal'
		this.prevMonthCalendar.className = 'cellsGroup calWrapper prevCal';

		var dateObject = new Date(this.currentDate.dateObj);
		dateObject.setMonth(dateObject.getMonth() + 1);
		this.currentDate = this.getDateMonthYear(dateObject);
		this.calendarBody.removeChild(prev);
		this.nextMonthCalendar = lib.createElement('div', 'cellsGroup calWrapper nextCal');
		this.generateCalendarBodyCells('next');
		this.updateButtonTitle();
		this.updateDatePickerValue(dateObject);
		this.generateDots();
	}

	prevNextCalendarHandler (event) {
		var className = event.target.className;
		if (className.indexOf('leftButton') > -1 || className.indexOf('arrowLeft') > -1) {
			this.moveLeft();

		} else if (className.indexOf('rightButton') > -1 || className.indexOf('arrowRight') > -1) {
			this.moveRight();

		} else if (className.indexOf('centerButton')) {
			this.datePicker.style.top = '0px'
		}
	}

	generateCalendarBody () {
		// calendarBody
		this.calendarBody = lib.createElement('div', 'calendarBody');
		this.generateCalendarBodyHeaderRow();
		this.generateCalendarBodyCells();
		this.calendar.appendChild(this.calendarBody);
	}
	
	generateCalendar () {
		this.calendar = lib.createElement('div', 'calendar');		
		this.generateCalendarHeader();
		this.generateCalendarBody();
		this.calendar.addEventListener('click', (event) => {
			this.clickEventHandler(event);
		})
		this.parentContainer.appendChild(this.calendar);
		this.generateAnotherMonth();
		this.generateDatePicker();
		this.generateDots();
	}

	updateDatePickerValue (dateObj) {
		var monthSelect = this.datePicker.childNodes[0];
		var yearSelect = this.datePicker.childNodes[1];
		monthSelect.value = this.monthsArray[dateObj.getMonth()].name;
		yearSelect.value = dateObj.getFullYear();
	}

	generateDatePicker () {
		this.datePicker = lib.createElement('form', 'datePicker');	
		var applyButton = lib.createElement('button', 'applyButton datePickerButton', 'apply');
		applyButton.setAttribute('type', 'button');

		var cancelButton = lib.createElement('button', 'cancelButton datePickerButton', 'cancel');
		cancelButton.setAttribute('type', 'button');

		var monthsArr = [];
		var yearsArr = [];
		this.monthsArray.forEach(elm=>{
			monthsArr.push(elm.name);
		})

		var date = new Date();

		var year = parseInt(date.getFullYear());
		for (var i = (year - 40); i <= (year + 20); i++) {
			yearsArr.push(i);
		}

		var month = lib.createSingleSelect(monthsArr, monthsArr[date.getMonth()], 'monthSelect');
		var years = lib.createSingleSelect(yearsArr, year, 'yearSelect');
		this.datePicker.appendChild(month);
		this.datePicker.appendChild(years);
		this.datePicker.appendChild(applyButton);
		this.datePicker.appendChild(cancelButton);
		
		this.calendar.appendChild(this.datePicker);
		this.datePicker.addEventListener('change', (event) => {

		})

	}


	generateAnotherMonth(type) {
		this.generateCalendarBodyCells('next');
		this.generateCalendarBodyCells('prev');
	}

	getDateCell (className) {
		var refNode = this.calendarBody.getElementsByClassName('currentCal')[0];
		var dateNode = refNode.getElementsByClassName(className)[0];
		return dateNode;
	}

	generateDots (data) {
		if (data !== undefined) {
			this.localData = data;
		}

		if (Object.keys(this.localData).length === 0) {
			return;
		}

		var obj = this.localData[this.currentDate.year];
		var month = this.monthsArray[this.currentDate.month].name.toLowerCase();
		if (obj === undefined) {
			return;
		}
		obj = obj[month];
		var ref = {};
		for (var k in obj) {
			ref[k] = Object.keys(obj[k]).length;
		}
		for (var k in ref) {
			var val = ref[k];
			var className = 'date-'+k;
			var dateNode = this.getDateCell(className);
			var dotContainer = dateNode.getElementsByClassName('dotContainer')[0];
			if (dotContainer === undefined) {
				dotContainer = lib.createElement('div','dotContainer');
			} else {
				dotContainer.innerHTML = '';
			}
		


			for (var i=0; i<val; i++) {
				if (i > 2) {
					break;
				}
				var dot = lib.createElement('div','dot');
				dotContainer.appendChild(dot);
			}
			dateNode.appendChild(dotContainer);
		}
	}

}

Calendar.prototype.daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
Calendar.prototype.monthsArray = [{name: 'January', days: 31},{name: 'February', days: 28},{name: 'March', days: 31},{name: 'April', days: 30},{name: 'May', days: 31},{name: 'June', days: 30},{name: 'July', days: 31}, {name: 'August', days: 31},{name: 'September', days: 30},{name: 'October', days: 31},{name: 'November', days: 30},{name: 'December', days: 31}]

