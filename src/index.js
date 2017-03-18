import authentication from './authentication';
import listPosts from './components/listPosts';

const app = {};

app.init = function() {
	listPosts.init();
	authentication.init();
};
app.init();
