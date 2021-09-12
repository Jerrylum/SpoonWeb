import ClientConnection from "./ClientConnection";
import packets from "../network/protocol/Packets";
import AESUtil from "../network/security/AESUtil";

export default class ClientDevice {

    private _connection: ClientConnection;
    private _channel: string;
    private _lastMessagePacketId: number;

    constructor(serverUri: string) {
        this._connection = new ClientConnection(serverUri);
        this._channel = "";
        this._lastMessagePacketId = 0;

        this.connection.addEventListener('RequireEncryptionPacket', (ev: Event) => {
            if (this.isEncrypted()) return;

            const packet: packets.RequireEncryptionPacket = (ev as CustomEvent).detail;

            this.connection.encryption.keyRSA = packet.serverPublicKey;

            const secret = AESUtil.createCipherSecret();

            this.connection.sendPacket(new packets.EncryptionBeginPacket(secret.key, secret.iv));

            this.connection.encryption.secretAES = secret;
        });
    }

    get connection() {
        return this._connection;
    }

    get channel() {
        return this._channel;
    }

    set Channel(newChannel: string) {
        this.connection.sendPacket(new packets.SetChannelPacket(newChannel)); // TODO
        this._channel = newChannel;
    }

    get lastMessagePacketId() {
        return this._lastMessagePacketId;
    }

    public isEncrypted() {
        return this.connection.encryption.secretAES != null;
    }
}