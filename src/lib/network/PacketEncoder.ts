import ByteBuffer from "./ByteBuffer";
import Connection from "./Connection";
import Packet from "./protocol/Packet";
import PacketConstructible from "./protocol/PacketConstructible";
import packets from "./protocol/Packets";

export default abstract class PacketEncoder {
    public static encode(packet: Packet, connection: Connection) {
        const gen1 = new ByteBuffer(1024 * 512);
        gen1.putInt(connection.sentPackets++).putUtf(packet.getClassName());
        packet.write(gen1);

        const gen2 = connection.encryption.encode(gen1.compactData()).rawData();
        const gen2Length = gen2.byteLength;

        const gen3 = new ByteBuffer(gen2Length + 4);
        gen3.putInt(gen2Length).put(gen2);

        return gen3.compactData();
    }

    public static decode(data: Uint8Array, connection: Connection): Packet {
        const gen3 = ByteBuffer.from(data);
        const gen3Length = gen3.getInt();
        if (gen3Length > 1024 * 1024)
            throw new Error("Packet too big! (" + gen3Length + ")");
        if (gen3Length < 0)
            throw new Error("Packet less than 0!");
        const gen3Content = gen3.get(gen3Length);

        const gen2 = connection.encryption.decode(gen3Content);

        const id = gen2.getInt();
        if (connection.receivedPackets >= id)
            throw new Error("Repeated or older packet! (" + id + ")");
        connection.receivedPackets = id;
        const clazzName = gen2.getUtf(256);

        let result: PacketConstructible | null = null;
        const loop = (ns: Record<string, any>, path?: string) => {
            Object.keys(ns).forEach((key) => {
                if (result) return;

                const value = ns[key];
                const currentPath = path ? `${path}.${key}` : key;
                if (typeof value === 'object')
                    loop(value, currentPath);
                if (typeof value === 'function' && value.className === clazzName)
                    result = value;
            })
        };
        loop(packets);

        if (result == null)
            throw new Error("Unknown class (" + clazzName + ")");

        const packetFunction: PacketConstructible = result;
        const packet = new packetFunction();
        packet.read(gen2);

        return packet;
    }
}