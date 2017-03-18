const config = {
	loginForm: document.querySelector('.login'),
	logoutForm: document.querySelector('.logout'),
	addForm: document.querySelector('form.add-post'),
	title: document.querySelector('.title-editor'),
	content: document.querySelector('#content-editor'),
	articleContainer: document.querySelector('main#main'),
	message: document.querySelector('#message'),
	successMessage: 'Post saved!',
	apiRoot: 'https://api-demo.dev/wp-json/',
	tinymceConfig: {
	  selector: '#content-editor',
		content_style: 'body {background: #fff !important; padding: 5px 10px}',
		plugins: 'link code',
		statusbar: false,
		menubar: false,
		toolbar: 'formatselect bold italic | link blockquote | code '
	}
};

export default config;
