import 'whatwg-fetch';
import Cookies from 'js-cookie';
import config from '../config';
import api from 'wordpress-rest-api-oauth-1';
import listPosts from './listPosts';
import message from './message';


let authentication = {},
		apiHandler = new api({
			  url: config.apiRoot,
			  credentials: {
			      client: {
			          public: '9worJuBgBmbg',
			          secret: 'Knksd2nUcFU0B6jRt9T2BXxmAokfBQ26i5Pw9OQFkwSQ7TAl',
			      }
			  },
				callbackURL: 'https://localhost:9000/'
			});

authentication.init = function() {

	apiHandler.restoreCredentials();
	authentication.checkLoginStatus();

	if ( apiHandler.hasCredentials() ) {
		authentication.LoggedIn();
	} else if ( apiHandler.hasRequestToken() ) {
		apiHandler.authorize().then( () => {
			apiHandler.saveCredentials();
			authentication.onLoggedIn();
		});
	}

};

apiHandler.hasCredentials = function() {

	if( apiHandler.config.credentials &&
		apiHandler.config.credentials.client &&
		apiHandler.config.credentials.client.public &&
		apiHandler.config.credentials.client.secret &&
		apiHandler.config.credentials.token &&
		apiHandler.config.credentials.token.public &&
		apiHandler.config.credentials.token.secret ) {
	 return true;
 } else {
		return false;
 }

};

apiHandler.hasRequestToken = function() {
	return localStorage.getItem( 'requestTokenCredentials' );
};


authentication.checkLoginStatus = function() {
		if( localStorage.getItem('tokenCredentials') ) {
			config.loginForm.style.display = 'none';
			config.logoutForm.style.display = 'block';
			config.addForm.style.display = 'block';
			tinymce.init( config.tinymceConfig );
		} else {
			config.loginForm.style.display = 'block';
			config.addForm.style.display = 'none';
			config.logoutForm.style.display = 'none';
		}
};

authentication.LoggedIn = function() {
	apiHandler.get('/wp/v2/users/me', {_envelope: true, context: 'edit'})
		.then(response => response.body)
		.then(user => console.log( user ));

	config.loginForm.style.display = 'none';
	config.logoutForm.style.display = 'block';
	config.addForm.style.display = 'block';
	tinymce.init( config.tinymceConfig );

};


authentication.onLogin = function( event ) {
	event.preventDefault();
	apiHandler.authorize();
};

authentication.onLogout = function( event ) {
	event.preventDefault();
	apiHandler.removeCredentials();
	authentication.checkLoginStatus();
	// authentication.init();
	// config.loginForm.classList.add('hidden');

};

// Event Listeners
config.loginForm.addEventListener( 'submit', authentication.onLogin, false );
config.logoutForm.addEventListener( 'submit', authentication.onLogout, false );

config.addForm.addEventListener( 'submit', function( event ) {
	let post = {
			'title': config.title.value,
			'content': config.content.value,
			'status': 'publish'
		};

	event.preventDefault();

	apiHandler.post( '/wp/v2/posts', post )
	.then( post => {
			console.log( post );
	});

}, false );

export default authentication;
