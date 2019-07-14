
var lib = new Common();

class OrderRow {
	
	constructor (data, parentContainer) {
		this.data = data;						// ref to hold the order data
		this.parentContainer = parentContainer; // reference to hold parent container where order card is attached
		
		// object to hold several HTML dom elemnt references related object of this class
		this.row = {
			rowRef: null,
			children: {}
		}
	}


	// returns the data used in save
	returnFormData () {
		return this.data;
	}


	// called to delte the object and its corresponding dom element
	removeThisRow () {
		this.row.rowRef.removeEventListener('change', this.updateValue.bind(this));
		this.parentContainer.removeChild(this.row.rowRef);
	}


	// called when unit price or qty. is changed to ubpdate the total price
	updateTotalPrice () {
		var total = this.data.qty * this.data.unitPrice;
		this.row.children.totalPrice.value = total;
		this.data.totalPrice = total;
	}


	// updates the corresponding data as per the the input changes
	updateValue(event) {
		event.stopPropagation();
		if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
			return;
		}
		var className = event.target.className.split(' ');
		var inputType = className[className.length - 1];
		this.data[inputType] = event.target.value;

		if (inputType === 'unitPrice' || inputType === 'qty') {
			if (event.target.value === "") {
				event.target.value = 1;
			}
			this.updateTotalPrice();
		}
		
	}
	
	
	// genrates the order row and attaches it to its parent container
	// a form is created and event listener is attached to the form, which detect changes in every input field
	generateRow () {
		var row = this.row.children;
		var rowRef = {};

		rowRef = lib.createElement('form', 'orderRow');
		rowRef.setAttribute('data-rowid', this.data.rowId);
		rowRef.addEventListener('change', this.updateValue.bind(this));		
		
		row.id = lib.createInput('rowElm id');

		row.productName = lib.createInput('rowElm productName');
		row.qty = lib.createInput('rowElm qty', 'number', 1);
		row.unitPrice = lib.createInput('rowElm price unitPrice', 'number', 1);
		
		row.totalPrice = lib.createInput('rowElm price totalPrice disabled', 'number', 1);
		row.totalPrice.setAttribute('readonly', true);

		row.notes =  lib.createElement('textarea', 'rowElm notes');
		row.deleteButton = lib.createElement('div', 'rowElm deleteButton');
		row.button = lib.createElement('button', 'deleteRow', 'delete');
		row.button.setAttribute('type', 'button')
		row.button.setAttribute('data-rowid', this.data.rowId);
		row.deleteButton.appendChild(row.button)

		var appendOrder = ['id', 'productName', 'qty', 'unitPrice', 'totalPrice', 'notes', 'deleteButton'];
		appendOrder.forEach( elm => {
			rowRef.appendChild(row[elm]);
		})
		
		this.row.rowRef = rowRef;
		this.parentContainer.appendChild(rowRef);

	}
}