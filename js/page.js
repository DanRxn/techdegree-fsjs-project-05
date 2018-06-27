(function(){

	let employeesDiv = document.querySelector('#employees');

	let employeesData = [];

	function checkStatus(response) {
		if(response.ok) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(new Error(response.statusText));
		}
	}
	
	function fetchData(url) {
		return fetch(url, {mode: 'cors'})
			.then(checkStatus)
			.then(res => res.json())
			.catch(error => console.log('Looks like there was a problem', error))
	}
	
	function makeContactHTML(contactObject) {
		let html =  `
			<div id="${contactObject.id}" class="contact">
				<div class="thumb-div">
					<img src="${contactObject.picture.large}" class="thumbnail">
				</div>
				<div class="contact-summary">
					<h3>${contactObject.name.first} ${contactObject.name.last}</h3>
					<p>${contactObject.email}</p>
					<p class="location">${contactObject.location.city}</p>
				</div>
			</div>
		`;
		return html;
	}

	function makeDetailsHTML(contactObject) {
		const location = contactObject.location;
		const birthdate = new Date(contactObject.dob.date);
		let html = `
			<span class="close">&times;</span>
			<div class="avatar-div">
				<img src="${contactObject.picture.large}" class="avatar" height="175" width="175">
			</div>
			<div class="contact-summary">
				<h3>${contactObject.name.first} ${contactObject.name.last}</h3>
				<p>${contactObject.email}</p>
				<p class="location">${contactObject.location.city}</p>
			</div>
			<hr>
			<div class="additional-details">
				<p>${contactObject.cell}</p>
				<p class="address">${location.street} 
				<br>${location.city}, ${location.state} ${location.city} ${location.postalcode}</p>
				<p>Birthday: ${birthdate.toLocaleDateString("en-US")}</p>
			</div>
		`;
		if (hasPrevious(contactObject.id)) {
			html += `<div id="previous" class="button" display="inline-block">&#8249;</div>`;
		}
		if (hasNext(contactObject.id)) {
			html += `<div id="next" class="button" display="inline-block">&#8250;</div>`;
		}
		return html;
	}

	function makeEmployeesHTML(results) {
		let html = [];
		results.forEach( (employee, i) => {
			const employeeHtml = makeContactHTML(employee, i);
			if (employee.filteredFor === true) {
				html.push(employeeHtml);
			}
		});
		return html.join('')
	}

	function addEmployeeAttributes(contactObject, i) {
		const extendedObject = contactObject;
		extendedObject.filteredFor = true;
		extendedObject.detailsDisplayed = false;
		extendedObject.id = i;
		return extendedObject;
	}

	function persistEmployees(results) {
		const data = results.map((result, i) => addEmployeeAttributes(result, i));
		employeesData = data;
		console.log("Persisted employeesData on page load:");
		console.log(employeesData);
		return data;
	}

	function updateEmployeesHtml(html) {
		employeesDiv.innerHTML = html
		contacts = document.querySelectorAll('.contact');
		addEventListenerList(contacts, 'click', openContactDetails);
	}

	function markAsDetailsDisplayed(id) {
		employeesData.forEach(employee => employee.detailsDisplayed = false);
		const employee = employeesData[id];
		employee.detailsDisplayed = true;
	}

	function addEventListenerList(list, event, fn) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener(event, fn);
    }
	}

	function isDisplayed(employee) { 
    return employee.detailsDisplayed === true;
}

	function getAdjacentContact(direction) {
		const currentlyDisplayed = employeesData.find(isDisplayed);
		const indexOfCurrent = employeesData.indexOf(currentlyDisplayed);
		let indexOfNew;
		if (direction === 'next') {
			indexOfNew = indexOfCurrent + 1;
		} else if (direction === 'previous') {
			indexOfNew = indexOfCurrent - 1;
		}
		return indexOfNew;
	}

	function openContactDetails() {
		const contactId = Number(this.id);
		updateContactDetails(contactId);
		modal.style.display = "block";
	}

	function hasNext(id) {
		return id < employeesData.length - 1;
	}

	function hasPrevious(id) {
		return id > 0;
	}

	function updateContactDetails(id) {
		employeesData.forEach(employee => employee.detailsDisplayed = false);
		markAsDetailsDisplayed(id);
		contactDetails.innerHTML = makeDetailsHTML(employeesData[id]);
		closeSpan = document.querySelector(".close");
		closeSpan.onclick = closeContactDetails;
		previousButton = document.querySelector("#previous");
		nextButton = document.querySelector("#next");
		listenToButtons();
	}

	function listenToButtons() {
		const currentlyDisplayed = employeesData.find(isDisplayed);
		if (hasPrevious(currentlyDisplayed.id)) {
			previousButton.addEventListener('click', () => {
				updateContactDetails(getAdjacentContact('previous'));
			});
		}
		if (hasNext(currentlyDisplayed.id)) {
			nextButton.addEventListener('click', () => {
				updateContactDetails(getAdjacentContact('next'));
			});
		}
	}

	function closeContactDetails() {
		modal.style.display = "none";
		employeesData.forEach(employee => employee.detailsDisplayed = false);
	}

	fetchData('https://randomuser.me/api/?results=12&nat=us,ie,gb,ca')
		.then(data => persistEmployees(data.results))
		.then(results => makeEmployeesHTML(results))
		.then(html => updateEmployeesHtml(html))

	// Get the modal
	let modal = document.getElementById('details-modal');

	// Get the contact details div
	let contactDetails = document.querySelector('.contact-details');
	
	// Get the button that opens the modal
	let contacts = null; // Gets updated with contacts after data is fetched and DOM updated
	
	// Get the <span> element that closes the modal
	let closeSpan;

	// Get the Prev and Next buttons
	let previousButton;
	let nextButton;
	
	// When the user clicks on the contact, open the modal 
	// Moving this to the end of the promise chain
	
	// When the user clicks on <span> (x), close the modal
	// Moving this into the JS block that generates this HTML
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
			if (event.target == modal) {
					closeContactDetails();
			}
	}	

})();

