import axios from 'axios';

//const baseURL = 'http://localhost:3000/article';
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://liverpooltest-2.herokuapp.com";

// Save query
export const saveQuery = (query) => {
	axios
		.post(`${baseURL}/`, {query: query})
		.then(res => {
			
		})
		.catch(err => {
			console.log('Error Storing Query =====> ', err.response);
		});
};