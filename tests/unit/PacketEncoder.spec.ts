import Connection from "@/lib/network/Connection";
import PacketEncoder from "@/lib/network/PacketEncoder";
import packets from "@/lib/network/protocol/Packets";
import AESUtil from "@/lib/network/security/AESUtil";
import RSAUtil from "@/lib/network/security/RSAUtil";

class MockConnection extends Connection {}

test("encode decode raw packet", () => {
    // @ts-ignore
    const conn = new MockConnection(null);

    const expected = new packets.SetChannelPacket("hello world");
    const buffer = PacketEncoder.encode(expected, conn);

    const actual = PacketEncoder.decode(buffer, conn) as packets.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("encode decode aes encrypted packet", () => {
    // @ts-ignore
    const conn = new MockConnection(null);

    conn.encryption.secretAES = AESUtil.createCipherSecret();

    const expected = new packets.SetChannelPacket("hello world");
    const buffer = PacketEncoder.encode(expected, conn);

    const actual = PacketEncoder.decode(buffer, conn) as packets.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("encode decode rsa encrypted packet", () => {
    // @ts-ignore
    const conn = new MockConnection(null);

    conn.encryption.keyRSA = RSAUtil.createKeys();

    const expected = new packets.SetChannelPacket("hello world");
    const buffer = PacketEncoder.encode(expected, conn);

    const actual = PacketEncoder.decode(buffer, conn) as packets.SetChannelPacket;

    expect(expected.channel).toBe(actual.channel);
})

test("repeated id packet", () => {
    const t = () => {
        // @ts-ignore
        const conn = new MockConnection(null);

        conn.sentPackets = conn.receivedPackets;

        const expected = new packets.SetChannelPacket("hello world");
        const buffer = PacketEncoder.encode(expected, conn);

        const actual = PacketEncoder.decode(buffer, conn) as packets.SetChannelPacket;
        expect(expected.channel).toBe(actual.channel);
    };
    expect(t).toThrow("Repeated or older packet! (0)");
})