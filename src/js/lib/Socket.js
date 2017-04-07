import EventEmitter from 'events';

function ignore() {}

class Socket extends EventEmitter {
    constructor(ws_url) {
        super();

        this.ws_url = ws_url;

        this.is_connected = false;
        this.is_connecting = false;
        // this.hidden = page_visibility.supports_visibility() && !page_visibility.is_visible();

        this.connect();

        // Disconnect ws when page is hidden to save resources.
        // If browser doesn't support page visibility API this will never fire.
        // page_visibility.on('hidden', this._on_hidden.bind(this));
        // page_visibility.on('visible', this._on_visible.bind(this));
    }

    connect() {
        if (this.hidden || this.is_connecting) {
            return;
        }

        this.is_connecting = true;
        this._connect_ws();
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    _on_hidden() {
        this.hidden = true;
        this.disconnect();
    }

    _on_visible() {
        this.hidden = false;
        this.connect();
    }

    _connect_ws() {
        this.socket = new WebSocket(this.ws_url);

        this.socket.onopen = () => {
            this.socket.onopen = ignore;
            this.is_connected = true;
            this.is_connecting = false;
            this._connected_ws();
            this.emit('online');
        };
        this.socket.onerror = () => {
            this.is_connected = false;
            this.is_connecting = false;
            this.socket.onopen = ignore;
            this.socket.onerror = ignore;
            this.socket.onmessage = ignore;

            setTimeout(() => {
                this.connect();
            }, 5000);
        };
    }

    _connected_ws() {
        this.socket.onmessage = ev => {
            const { data } = ev;
            const msg = JSON.parse(data.toString());
            this.emit('msg', msg);
        };

        this.socket.onclose = () => {
            this.socket.onmessage = ignore;
            this.is_connected = false;
            this.emit('offline');
            this.connect();
        };
    }
}

export default Socket;