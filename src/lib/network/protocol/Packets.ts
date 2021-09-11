import ByteBuffer from "../ByteBuffer";
import Packet from "./Packet";

namespace spoon.network.protocol {
    export class ReceivedPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.reply.ReceivedPacket"

        constructor(public receivedPacketId = 0) { }

        getClassName() { return ReceivedPacket.className; }

        read(buf: ByteBuffer): void {
            this.receivedPacketId = buf.getInt();
        }
        
        write(buf: ByteBuffer): void {
            buf.putInt(this.receivedPacketId);
        }
    }

    export class SetChannelPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.general.SetPacketPacket"

        constructor(public channel = "") { }

        getClassName() { return SetChannelPacket.className; }

        read(buf: ByteBuffer): void {
            this.channel = buf.getUtf();
        }
        
        write(buf: ByteBuffer): void {
            buf.putUtf(this.channel);
        }
    }
};

export default spoon;