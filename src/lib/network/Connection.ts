import EncryptionManager from "./security/EncryptionManager";
import EventListenerManager from "../event/EventListenerManager";
import Packet from "./protocol/Packet";
import PacketEncoder from "./PacketEncoder";

export default abstract class Connection extends EventListenerManager {

    readonly websocket: WebSocket;
    readonly encryption: EncryptionManager;
    public receivedPackets = 0;
    public sentPackets = 1;

    public constructor(websocket: WebSocket) {
        super();
        this.websocket = websocket;
        this.encryption = new EncryptionManager();
    }

    public isConnected(): boolean {
        return this.websocket.readyState === WebSocket.CLOSED;
    }

    public sendPacket(packet: Packet) {
        try {
            this.websocket.send(PacketEncoder.encode(packet, this));
        } catch (error) {
            console.log(error);            
        }
    }
}