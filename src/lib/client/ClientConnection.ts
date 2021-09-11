import Connection from "../network/Connection";
import PacketEncoder from "../network/PacketEncoder";

export default class ClientConnection extends Connection {
    constructor(serverUri:string) {
        super(new WebSocket(serverUri));

        this.websocket.binaryType = "arraybuffer";

        this.websocket.onopen = (ev: Event) => {
            console.log("g");
        }

        this.websocket.onmessage = (ev: MessageEvent) => {
            var buffer = ev.data;

            if (!(buffer instanceof ArrayBuffer)) return;

            try {
                var packet = PacketEncoder.decode(new Uint8Array(buffer), this);
                this.fireEvent(packet);
            } catch (error) {
                console.log(error);
            }
        }

        this.websocket.onclose = (ev: CloseEvent) => {

        }

        this.websocket.onerror = (ev: Event) => {

        }
    }
}