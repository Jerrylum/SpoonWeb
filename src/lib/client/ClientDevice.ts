import ClientConnection from "./ClientConnection";

export default class ClientDevice {

    private connection: ClientConnection;
    private _channel: string;
    private _lastMessagePacketId: number;

    constructor(serverUri: string) {
        this.connection = new ClientConnection(serverUri);
        // this.connection.addEventListener(listener);

        this._channel = "";
        this._lastMessagePacketId = 0;
    }

    get channel() {
        return this._channel;
    }

    set Channel(newChannel: string) {
        // this.connection.sendPacket(new SetChannelPacket(newChannel)); // TODO
        this._channel = newChannel;
    }

    get lastMessagePacketId() {
        return this._lastMessagePacketId;
    }
}