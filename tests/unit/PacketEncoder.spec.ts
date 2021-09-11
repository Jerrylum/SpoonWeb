import ByteBuffer from "@/lib/network/ByteBuffer";
import Connection from "@/lib/network/Connection";
import PacketEncoder from "@/lib/network/PacketEncoder";
import spoon from "@/lib/network/protocol/Packets";
import AESUtil from "@/lib/network/security/AESUtil";
import RSAUtil from "@/lib/network/security/RSAUtil";
import { RSAKey } from "jsrsasign";

class MockConnection extends Connection {}

test("encode decode raw packet", () => {
    // @ts-ignore
    var conn = new MockConnection(null);

    var expected = new spoon.network.protocol.SetChannelPacket("hello world");
    var buffer = PacketEncoder.encode(expected, conn);

    var actual = PacketEncoder.decode(buffer, conn) as spoon.network.protocol.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("encode decode aes encrypted packet", () => {
    // @ts-ignore
    var conn = new MockConnection(null);

    conn.encryption.secretAES = AESUtil.createCipherSecret();

    var expected = new spoon.network.protocol.SetChannelPacket("hello world");
    var buffer = PacketEncoder.encode(expected, conn);

    var actual = PacketEncoder.decode(buffer, conn) as spoon.network.protocol.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("encode decode rsa encrypted packet", () => {
    // @ts-ignore
    var conn = new MockConnection(null);

    conn.encryption.keyRSA = RSAUtil.createKeys();

    var expected = new spoon.network.protocol.SetChannelPacket("hello world");
    var buffer = PacketEncoder.encode(expected, conn);

    var actual = PacketEncoder.decode(buffer, conn) as spoon.network.protocol.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("repeated id packet", () => {
    const t = () => {
        // @ts-ignore
        var conn = new MockConnection(null);

        conn.sentPackets = conn.receivedPackets;

        var expected = new spoon.network.protocol.SetChannelPacket("hello world");
        var buffer = PacketEncoder.encode(expected, conn);

        var actual = PacketEncoder.decode(buffer, conn) as spoon.network.protocol.SetChannelPacket;
        expect(expected.channel).toBe(actual.channel);
    };
    expect(t).toThrow("Repeated or older packet! (0)");
})