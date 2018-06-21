
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

fetchData('https://randomuser.me/api/?results=12')
	.then(data => console.log(data));


