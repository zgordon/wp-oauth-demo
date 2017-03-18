import config from '../config';

const listPosts = {};

listPosts.init = function() {

	fetch( config.apiRoot + 'wp/v2/posts/?per_page=5' )
		.then( response => {
			response.json().then(function(posts) {
				listPosts.clearPosts();
				listPosts.render( posts );
			});
		})
		.catch(function(err) {
			console.log('Error: ', err);
		});

};

listPosts.render = function( posts ) {
	for ( let post of posts ) {
		listPosts.renderPost( post );
	}
};

listPosts.renderPost = function( post ) {

  const articleEl = document.createElement( 'article' ),
			titleEl = listPosts.getTitleMarkup( post ),
			contentEl = listPosts.getContentMarkup( post );

	articleEl.classList.add('post');
	articleEl.appendChild( titleEl );
	articleEl.appendChild( contentEl );
	config.articleContainer.appendChild(articleEl);

};

listPosts.getTitleMarkup = function( post ) {

	let titleEl = document.createElement( 'h2' ),
			titleLinkEl = document.createElement( 'a' ),
			title = document.createTextNode( post.title.rendered );

	titleEl.classList.add('entry-title');
	titleLinkEl.appendChild( title );
	titleLinkEl.href = post.link;
	titleLinkEl.target = '_blank';
	titleEl.appendChild( titleLinkEl );

	return titleEl;

};

listPosts.getContentMarkup = function( post ) {
	const contentEl = document.createElement( 'div' ),
			content = document.createTextNode('');

	contentEl.classList.add('entry-content');
	contentEl.appendChild( content );
	contentEl.innerHTML = post.content.rendered;

	return contentEl;

};

listPosts.clearPosts = function() {
		config.articleContainer.innerHTML = '';
};

listPosts.clearForm = function() {
	config.title.value = '';
	tinymce.get('content-editor').setContent('');
};

export default listPosts;
