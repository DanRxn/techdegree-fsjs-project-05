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
			<div class="contact" onclick="document.getElementById('modal-${i}').style.display='block'">
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

	function makeEmployeesHTML(results) {
		return results.map(makeContactHTML)
			.join('')
	}

	function persistEmployees(results) {
		employeesData = results;
		return results;
	}

	fetchData('https://randomuser.me/api/?results=12&nat=us,ie,gb,ca')
		.then(data => persistEmployees(data.results))
		.then(results => makeEmployeesHTML(results))
		.then(html => employeesDiv.innerHTML = html)

	// Get the modal
	var modal = document.getElementById('details-modal');
	
	// Get the button that opens the modal
	var contact = document.querySelector('.contact');
	
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// When the user clicks on the contact, open the modal 
	// contact.onclick = function() {
	// 		modal.style.display = "block";
	// }
	
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
			modal.style.display = "none";
	}
	
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
			if (event.target == modal) {
					modal.style.display = "none";
			}
	}	

})();

