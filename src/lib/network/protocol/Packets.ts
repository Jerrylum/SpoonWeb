import ByteBuffer from "../ByteBuffer";
import { Word32Array } from "jscrypto/Word32Array";
import Packet from "./Packet";
import NodeRSA from 'node-rsa';

namespace packets {

    export class SendTextPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.general.SendTextPacket"

        constructor(public message = "") { }

        getClassName() { return SendTextPacket.className; }

        read(buf: ByteBuffer) {
            this.message = buf.getUtf();
        }
        
        write(buf: ByteBuffer) {
            buf.putUtf(this.message);
        }
    }

    export class SetChannelPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.general.SetChannelPacket"

        constructor(public channel = "") { }

        getClassName() { return SetChannelPacket.className; }

        read(buf: ByteBuffer) {
            this.channel = buf.getUtf();
        }
        
        write(buf: ByteBuffer) {
            buf.putUtf(this.channel);
        }
    }

    export class EncryptionBeginPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.handshake.EncryptionBeginPacket"

        constructor(public clientAESKey?: Word32Array, public clientIv?: Word32Array) { }

        getClassName() { return EncryptionBeginPacket.className; }

        read(buf: ByteBuffer) {
            const data1len = buf.getInt();

            this.clientAESKey = ByteBuffer.toWordArray(new ByteBuffer(buf.get(data1len)));
            this.clientIv = ByteBuffer.toWordArray(new ByteBuffer(buf.get(16)));
        }

        write(buf: ByteBuffer) {
            if (this.clientAESKey == null || this.clientIv == null) return;

            const data1 = ByteBuffer.fromWordArray(this.clientAESKey).rawData();
            const data2 = ByteBuffer.fromWordArray(this.clientIv).rawData();

            buf.putInt(data1.length).put(data1);
            buf.put(data2);
        }
    }

    export class RequireEncryptionPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.handshake.RequireEncryptionPacket"

        constructor(public serverPublicKey?: NodeRSA) { }

        getClassName() { return RequireEncryptionPacket.className; }

        read(buf: ByteBuffer) {
            this.serverPublicKey = buf.getX509RSAPublicKey();
        }

        write(buf: ByteBuffer) {
            if (this.serverPublicKey == null) return;

            buf.putRSAPublicKey(this.serverPublicKey);
        }
    }

    export class ReceivedPacket implements Packet {
        static className = "com.jerryio.spoon.kernal.network.protocol.reply.ReceivedPacket"

        constructor(public receivedPacketId = 0) { }

        getClassName() { return ReceivedPacket.className; }

        read(buf: ByteBuffer) {
            this.receivedPacketId = buf.getInt();
        }
        
        write(buf: ByteBuffer) {
            buf.putInt(this.receivedPacketId);
        }
    }
}

export default packets;