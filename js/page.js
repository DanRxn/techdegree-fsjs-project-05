
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
console.log('this worked so far... [line 16]');

fetchData('https://randomuser.me/api/?results=12&nat=US')
	.then(data => console.log(data));


// Get the modal
var modal = document.getElementById('details-modal');

// Get the button that opens the modal
var contact = document.querySelector('.contact');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the contact, open the modal 
contact.onclick = function() {
    modal.style.display = "block";
}

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