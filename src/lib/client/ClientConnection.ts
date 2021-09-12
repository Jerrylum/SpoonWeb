import Connection from "../network/Connection";
import PacketEncoder from "../network/PacketEncoder";

export default class ClientConnection extends Connection {
    constructor(serverUri:string) {
        super(new WebSocket(serverUri));

        this.websocket.binaryType = "arraybuffer";

        this.websocket.onopen = (ev: Event) => {
            try {
                this.fireEvent(ev, "ConnectionOpenEvent");
            } catch (error) {
                console.log(error);
            }
        }

        this.websocket.onmessage = (ev: MessageEvent) => {
            const buffer = ev.data;

            if (!(buffer instanceof ArrayBuffer)) return;

            try {
                const packet = PacketEncoder.decode(new Uint8Array(buffer), this);
                this.fireEvent(packet);
            } catch (error) {
                console.log(error);
            }
        }

        this.websocket.onclose = (ev: CloseEvent) => {
            try {
                this.fireEvent(ev, "ConnectionCloseEvent");
            } catch (error) {
                console.log(error);
            }
        }

        this.websocket.onerror = (ev: Event) => {
            try {
                this.fireEvent(ev, "ClientErrorEvent");
            } catch (error) {
                console.log(error);
            }
        }
    }
}