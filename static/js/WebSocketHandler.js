class WebSocketHandler {

	constructor() {
		this.socket = new WebSocket('ws://' + window.location.hostname + ':3000');

		this.socket.onopen = () => {
			console.log('WebSocket connection opened');
		};

		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			console.log('WebSocket message received', data);

			if (data.type === 'banned') return this.handleBanned(data);http://bl.ocks.org/abernier/3070589
			if (data.type === 'queue')  return this.handleQueue(data);
		};

		this.socket.onclose = () => {
			console.log('WebSocket closed');
		};

		window.onbeforeunload = function() {
			this.socket.close();
		};
	}

	handleBanned(data) {
		if (data.banned) {
			main.clippyAgent.speak('You have been banned!');
			main.clippyAgent.play('EmptyTrash');
		}
	}

	handleQueue(data) {

	}
}