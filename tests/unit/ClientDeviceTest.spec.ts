import ClientDevice from "@/lib/client/ClientDevice";
import ByteBuffer from "@/lib/network/ByteBuffer";
import RSAUtil from "@/lib/network/security/RSAUtil";
import CryptoJS from "crypto-js";
import NodeRSA from 'node-rsa';

jest.setTimeout(30000);

test("client connect", async () => {
    var device = new ClientDevice("ws://192.168.0.2:7000");

    await new Promise((r) => setTimeout(r, 1000));

    expect(device.isEncrypted()).toBe(true);
})