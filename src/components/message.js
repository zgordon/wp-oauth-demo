import config from '../config';

var message = {};

message.flash = function( messageText ) {

	const messageEl = document.createElement( 'p' ),
				messageNode = document.createTextNode( messageText );

	messageEl.appendChild( messageNode );
	config.message.appendChild( messageEl );
	config.message.classList.remove('hidden');
  setTimeout(function(){
    config.message.classList.toggle('hidden');
  }, 2000);

};

export default message;
