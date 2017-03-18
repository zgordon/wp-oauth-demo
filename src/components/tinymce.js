export default function tinymceInit() {
	tinymce.init({
	  selector: '#content-editor',
		content_style: 'body {background: #fff !important; padding: 5px 10px}',
		plugins: 'link code',
		statusbar: false,
		menubar: false,
		toolbar: 'formatselect bold italic | link blockquote | code '
	});
}
