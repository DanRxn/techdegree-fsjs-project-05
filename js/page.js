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
	
	function makeContactHTML(contactObject, i) {
		let html =  `
			<div id="${i}" class="contact">
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

	function makeDetailsHTML(contactObject, i) {
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
				<p class="address">${location.street} ${location.city}, ${location.state} ${location.city} ${location.postalcode}</p>
				<p>Birthday: ${birthdate.toLocaleDateString("en-US")}</p>
			</div>
		`;
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

	function addEmployeeAttributes(contactObject) {
		contactObject.filteredFor = true;
		contactObject.detailsDisplayed = false;
		return contactObject;
	}

	function persistEmployees(results) {
		employeesData = results.map(addEmployeeAttributes);
		return employeesData;
	}

	function updateEmployeesHtml(html) {
		employeesDiv.innerHTML = html
		contacts = document.querySelectorAll('.contact');
		addEventListenerList(contacts, 'click', openContactDetails);
	}

	function markAsDetailsDisplayed(id) {
		employeesData.forEach(employee => employee.detailsDisplayed = false);
		employeesData[id].detailsDisplayed = true;
	}

	function addEventListenerList(list, event, fn) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener(event, fn);
    }
	}

	function openContactDetails() {
		contactDetails.innerHTML = makeDetailsHTML(employeesData[this.id], this.id)
		markAsDetailsDisplayed(this.id);
		modal.style.display = "block";
		span = document.getElementsByClassName("close");
		addEventListenerList(span, 'click', closeContactDetails);
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
	let span = document.getElementsByClassName("close");
	
	// When the user clicks on the contact, open the modal 
	// Moving this to the end of the promise chain
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
			closeContactDetails();
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
			if (event.target == modal) {
					closeContactDetails();
			}
	}	

})();

