import Connection from "./Connection";
import Packet from "./protocol/Packet";

export default abstract class PacketEncoder {
    public static encode(packet: Packet, connection: Connection): DataView {
        var a = new ArrayBuffer(12);
        return new DataView(a); // TODO
    }

    public static decode(data: DataView, connection: Connection): Packet | null {
        return null; // TODO
    }
}