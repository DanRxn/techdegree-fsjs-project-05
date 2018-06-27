// Self-executing function to keep code out of page-level scope
(function(){

	// Top-level variables declaration
	// --------------------------------------
	
		// Get HTML elements present on page load (static HTML)
	const filterInput = document.querySelector('input');
	const employeesDiv = document.querySelector('#employees');
	const modal = document.querySelector('#details-modal');
	const contactDetails = document.querySelector('.contact-details');
	
		// Declare top-level scope variables for elements not on page at load time (added w/ JS later)
	let contacts;
	let closeSpan;
	let previousButton;
	let nextButton;

		// Declare variable to hold the page's stateful data model (populated by Fetch response)
	let employeesData = [];


	// Functions to maintain filtering of contacts
	// --------------------------------------
	
		// Get an array of only contacts flagged as filteredFor=true
	function filteredOf(arrayOfContacts) {
		return arrayOfContacts.filter(contact => contact.filteredFor)
	}

		// Filter contacts on page, based on app state (filteredFor=t/f for each contact)
	function filterContacts() {
		updateEmployeesHtml(makeEmployeesHTML(employeesData));
	}

		// Get the index of given contact among only those which are filteredFor=true
	function getFilteredIndexOf(id) {
		return filteredOf(employeesData).indexOf(employeesData[id]);
	} 

		// Check whether the full name of a given employee contains the query in search box
	function checkNameSubstring(employee) {
		const fullName = `${employee.name.first} ${employee.name.last}`
		const query = filterInput.value;
		return fullName.includes(query);
	}
	
		// Check whether the username of a given employee contains the query in search box
	function checkUsernameSubstring(employee) {
		const username = employee.login.username;
		const query = filterInput.value;
		return username.includes(query);
	}	

	 // Update page state to reflect which employees match the current search query
	function updateEmployeeFilter() {
		employeesData.forEach( (employee) => {
			if (checkNameSubstring(employee) || checkUsernameSubstring(employee)) {
				employee.filteredFor = true;
			} else {
				employee.filteredFor = false;
			}
		});
	}

	// Functions to maintain state of Details-displayeed contact
	// --------------------------------------

		// Mark a given employee as currently displayed in Details modal
	function markAsDetailsDisplayed(id) {
		employeesData.forEach(employee => employee.detailsDisplayed = false);
		const employee = employeesData[id];
		employee.detailsDisplayed = true;
	}

		// Test if a given employee object is the one currently displayed
	function isDisplayed(employee) { 
    return employee.detailsDisplayed === true;
	}
	
		// Open the Details modal (callback for click event on a .contact div)
	function openContactDetails() {
		const contactId = Number(this.id);
		updateContactDetails(contactId);
		modal.style.display = "block";
	}

		// Close the Details modal
	function closeContactDetails() {
		modal.style.display = "none";
		employeesData.forEach(employee => employee.detailsDisplayed = false);
	}

	// Functions to manage navigation between contacts in Details modal
	// --------------------------------------

		// Test whether a given employee ID needs a Next button, given current filtering
	function hasNext(id) {
		return getFilteredIndexOf(id) < filteredOf(employeesData).length - 1;
	}

		// Test whether a given employee ID needs a Previous button, given current filtering
	function hasPrevious(id) {
		return getFilteredIndexOf(id) > 0;
	}

		// Get ID for adjacent contact based on specified direction ('next' or 'previous), given current filtering
	function getAdjacentContactId(direction) {
		const currentlyDisplayed = filteredOf(employeesData).find(isDisplayed);
		const filteredIndexOfCurrent = filteredOf(employeesData).indexOf(currentlyDisplayed);
		let filteredIndexOfNew;
		if (direction === 'next') {
			filteredIndexOfNew = filteredIndexOfCurrent + 1;
		} else if (direction === 'previous') {
			filteredIndexOfNew = filteredIndexOfCurrent - 1;
		}
		return filteredOf(employeesData)[filteredIndexOfNew].id;
	}

		// Add event listeners for Previous and/or Next buttons, based on displayed contact and app state
	function listenToButtons() {
		const currentlyDisplayed = employeesData.find(isDisplayed);
		if (hasPrevious(currentlyDisplayed.id)) {
			previousButton.addEventListener('click', () => {
				updateContactDetails(getAdjacentContactId('previous'));
			});
		}
		if (hasNext(currentlyDisplayed.id)) {
			nextButton.addEventListener('click', () => {
				updateContactDetails(getAdjacentContactId('next'));
			});
		}
	}

	// Functions to form HTML required to build and maintain page as app state changes
	// --------------------------------------

		// Make the HTML for a single contact, given the contact/employee object
	function makeContactHTML(contactObject) {
		if (contactObject.filteredFor) {
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
	}

		// Make the employees HTML for page-load, given an array of contact objects
	function makeEmployeesHTML(results) {
		updateEmployeeFilter();
		let html = [];
		results.forEach( (employee, i) => {
			const employeeHtml = makeContactHTML(employee, i);
			if (employee.filteredFor === true) {
				html.push(employeeHtml);
			}
		});
		return html.join('')
	}

		// Make the Details modal HTML, given a contact object
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
				<p class="username">${contactObject.login.username}</p>
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

	// Functions update page's HTML and event listeners, when app state changes
	// --------------------------------------

		// Helper function to enable adding a listener to each element in a nodeList
	function addEventListenerList(list, event, fn) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener(event, fn);
    }
	}

		// Update the HTML for employees with the provided HTML snippet
	function updateEmployeesHtml(html) {
		employeesDiv.innerHTML = html;
		// Then, add event listeners to HTML elements just added
		contacts = document.querySelectorAll('.contact');
		addEventListenerList(contacts, 'click', openContactDetails);
	}

		// Update the HTML for Details modal for the employee ID provided
	function updateContactDetails(id) {
		employeesData.forEach(employee => employee.detailsDisplayed = false);  // Mark all as not displayed
		markAsDetailsDisplayed(id);  // Mark this one as displayed
		contactDetails.innerHTML = makeDetailsHTML(employeesData[id]);  // Update HTML
		// Select elements and add relevent event listeners
		closeSpan = document.querySelector(".close");
		closeSpan.onclick = closeContactDetails;
		previousButton = document.querySelector("#previous");
		nextButton = document.querySelector("#next");
		listenToButtons();
	}

	// Persistent event listeners
	// --------------------------------------

		// When user edits search query, update the displayed contacts
	filterInput.addEventListener('input', () => {
		filterContacts();
	});
	
		// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
			if (event.target == modal) {
					closeContactDetails();
			}
	}	

	// Functions to accomplish API request and handle response
	// --------------------------------------
	
		// Extend an object with additional attributes, given the original object and it's index in an array
	function addEmployeeAttributes(contactObject, i) {
		const extendedObject = contactObject;
		extendedObject.filteredFor = true;
		extendedObject.detailsDisplayed = false;
		extendedObject.id = i;
		return extendedObject;
	}
	
		// Persist API response data (and extra attributes) as an array in memory to maintain app state
	function persistEmployees(results) {
		const data = results.map((result, i) => addEmployeeAttributes(result, i));
		employeesData = data;
		console.log("Persisted employeesData on page load:");
		console.log(employeesData);
		return data;
	}

		// Check status of a Fetch response
	function checkStatus(response) {
		if(response.ok) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(new Error(response.statusText));
		}
	}
	
		// Call Fetch API for a given URL
	function fetchData(url) {
		return fetch(url, {mode: 'cors'})
			.then(checkStatus)
			.then(res => res.json())
			.catch(error => console.log('Looks like there was a problem', error))
	}

		// Fetch emmployees' user data from API and persist state / update page with data from response
	fetchData('https://randomuser.me/api/?results=12&nat=us,ie,gb,ca')
		.then(data => persistEmployees(data.results))
		.then(results => makeEmployeesHTML(results))
		.then(html => updateEmployeesHtml(html))

})();

