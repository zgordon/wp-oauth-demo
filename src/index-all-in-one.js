import api from 'wordpress-rest-api-oauth-1';
import config from './config';


const loginForm = document.querySelector('form.login'),
			logoutForm = document.querySelector('form.logout'),
			articleContainer = document.getElementById('primary'),
			addForm = document.querySelector('form.add-post'),
			title = addForm.querySelector('.title-editor'),
			apiRoot = 'http://api-test.dev/wp-json',
			apiHandler = new api({
			  url: 'http://api-test.dev/',
				callbackURL: 'http://localhost:9000/',
			  credentials: {
			      client: {
			          public: '9worJuBgBmbg',
			          secret: 'Knksd2nUcFU0B6jRt9T2BXxmAokfBQ26i5Pw9OQFkwSQ7TAl',
			      }
			  }
			});

function init() {
	getPosts();
	// checkLoginStatus();
}
init();

function checkLoginStatus() {
		if( localStorage.getItem('tokenCredentials') ) {
			loginForm.style.display = 'none';
			logoutForm.style.display = 'block';
			// TinyMCE
			addForm.style.display = 'block';
			tinymce.init({
			  selector: '#content-editor',
				content_css: '/dist/style.css',
				content_style: 'body {background: #fff !important; padding: 5px 10px}',
				plugins: 'link code',
				statusbar: false,
				menubar: false,
				toolbar: 'formatselect bold italic | link blockquote | code '
			});
		} else {
			loginForm.style.display = 'block';
			addForm.style.display = 'none';
			logoutForm.style.display = 'none';
		}
}

// OAuth Code
//
// if ( apiHandler.hasCredentials() ) {
// 	onLoggedIn()
// } else if ( apiHandler.hasRequestToken() ) {
// 	onLogin();
// }

function onConnect(url) {
	apiHandler.restoreCredentials();
	if ( apiHandler.hasCredentials() ) {
		onLoggedIn()
	} else if ( apiHandler.hasRequestToken() ) {
		onLogin()
	}
}

function onLogout() {
	apiHandler.removeCredentials();
	checkLoginStatus();
	loginForm.style.display = 'block';
}

function onLogin() {
	apiHandler.authorize().then( response => {
		onLoggedIn();
	});
}

function onLoggedIn() {
	apiHandler.saveCredentials();
	apiHandler.get('/wp/v2/users/me', {_envelope: true, context: 'edit'})
		.then(data => data.body)
		.then(user => console.log( user ));
}

// End OAuth Code

// Get Posts

function loadPosts( posts ) {
	for ( let post of posts ) {
		loadPost( post );
	}
}

function loadPost( post ) {
  let articleEl = document.createElement( 'article' ),
			titleEl = document.createElement( 'h2' ),
			titleLinkEl = document.createElement( 'a' ),
			title = document.createTextNode( post.title.rendered ),
			contentEl = document.createElement( 'div' ),
			content = document.createTextNode(''),
			footerEl = document.createElement( 'footer' ),
			footer = document.createTextNode(''),
			date = new Date(post.date),
			dateStr,
			categories = '';

	articleEl.classList.add('post');
	titleEl.classList.add('entry-title');
	contentEl.classList.add('entry-content');
	footerEl.classList.add('entry-footer');

	titleLinkEl.appendChild( title );
	titleLinkEl.href = post.link;
	titleLinkEl.target = '_blank';
	titleEl.appendChild( titleLinkEl );
	contentEl.appendChild( content );
	footerEl.appendChild( footer );
	articleEl.appendChild( titleEl );
	articleEl.appendChild( contentEl );
	articleEl.appendChild( footerEl );

	dateStr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();

	contentEl.innerHTML = post.content.rendered;
	// for ( let term of post._embedded['wp:term'][0] ) {
	// 	categories += term.name + ' ';
	// }
	// footerEl.innerHTML = post._embedded.author[0].name + ' | ' + dateStr + ' | ' + categories;

	articleContainer.appendChild(articleEl);
}

function clearForm() {
	title.value = '';
	tinymce.get('content-editor').setContent('');
}
function getPosts() {

	apiHandler.get( '/wp/v2/posts/', { per_page: 5} )
		.then( posts => {
				articleContainer.innerHTML = '';
				loadPosts(posts);
		});
}



// Event Listeners

loginForm.addEventListener( 'submit', function(event) {
	event.preventDefault();
	onLogin();
}, false );


logoutForm.addEventListener( 'submit', function(event) {
	event.preventDefault();
	onLogout();
}, false );


addForm.addEventListener( 'submit', function( event ) {
	const post = {
			'title': title.value,
			'content': tinyMCE.activeEditor.getContent(),
			'status': 'publish'
		};

	event.preventDefault();

	apiHandler.restoreCredentials().post( '/wp/v2/posts', post )
		.then( post => {
			clearForm();
			getPosts();
		});

}, false );
