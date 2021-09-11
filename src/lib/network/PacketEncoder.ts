import ByteBuffer from "./ByteBuffer";
import Connection from "./Connection";
import Packet from "./protocol/Packet";
import PacketConstructible from "./protocol/PacketConstructible";
// import * as r from "./protocol/Packets";
import spoon from "./protocol/Packets";

export default abstract class PacketEncoder {
    public static encode(packet: Packet, connection: Connection) {
        var gen1 = new ByteBuffer(1024 * 512);
        gen1.putInt(connection.sentPackets++).putUtf(packet.getClassName());
        packet.write(gen1);

        var gen2 = connection.encryption.encode(gen1.compactData()).rawData();
        var gen2Length = gen2.byteLength;

        var gen3 = new ByteBuffer(gen2Length + 4);
        gen3.putInt(gen2Length).put(gen2);

        return gen3.compactData();
    }

    public static decode(data: Uint8Array, connection: Connection): Packet {
        var gen3 = new ByteBuffer(data.buffer);
        var gen3Length = gen3.getInt();
        if (gen3Length > 1024 * 1024)
            throw new Error("Packet too big! (" + gen3Length + ")");
        if (gen3Length < 0)
            throw new Error("Packet less than 0!");
        var gen3Content = gen3.get(gen3Length);

        var gen2 = connection.encryption.decode(gen3Content);

        var id = gen2.getInt();
        if (connection.receivedPackets >= id)
            throw new Error("Repeated or older packet! (" + id + ")");
        connection.receivedPackets = id;
        var clazzName = gen2.getUtf(256);

        var result: PacketConstructible | null = null;
        var loop = (ns: object, path?: string) => {
            Object.keys(ns).forEach((key) => {
                if (result) return;

                // @ts-ignore
                const value = ns[key];
                const currentPath = path ? `${path}.${key}` : key;
                if (typeof value === 'object')
                    loop(value, currentPath);
                if (typeof value === 'function' && value.className === clazzName)
                    result = value;
            })
        };
        loop(spoon.network.protocol);

        if (result == null)
            throw new Error("Unknown class (" + clazzName + ")");

        var packetFunction: PacketConstructible = result;
        var packet = new packetFunction();
        packet.read(gen2);

        return packet;
    }
}