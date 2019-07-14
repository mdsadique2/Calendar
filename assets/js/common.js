class Common {
	constructor () {

	}
	
	createElement  (elmType, classList, innerText) {
		var elm = document.createElement(elmType);
		elm.setAttribute('class', classList);
		if (innerText !== undefined) {
			elm.innerText =  innerText
		}
		return elm;
	}

	createInput (classList, type, defaultValue) {
		var input = this.createElement('input', classList);
		if (type !== undefined) {
			input.setAttribute('type', type);
		}
		if (type === 'number') {
			input.setAttribute('min', defaultValue);
			input.value = defaultValue;
		}
		return input;
	}

	createSelectOption (selectRef, valuesArray, defaultValue) {
		var defaultFound = false;
		var optionArr = [];
		for (var i=0; i<valuesArray.length; i++) {
			var option = document.createElement('option');
			option.innerText = valuesArray[i];
			option.value = valuesArray[i];
			if (defaultValue === valuesArray[i]) {
				defaultFound = true;
				option.setAttribute('selected', 'selected');
			}
			optionArr.push(option);
			selectRef.appendChild(option);
		}
		if (defaultFound === false) {
			optionArr[0].setAttribute('selected', 'selected');
		}
	}

	createSingleSelect (valuesArray, defaultValue, classList) {
		var elm = document.createElement('select');
		this.createSelectOption(elm, valuesArray, defaultValue);
		if (!classList === false) {
			elm.setAttribute('class', classList);
		}
		return elm;
	}

}



