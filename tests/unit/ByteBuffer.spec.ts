import ByteBuffer from "@/lib/network/ByteBuffer";
import RSAUtil from "@/lib/network/security/RSAUtil";
import CryptoJS from "crypto-js";
import NodeRSA from 'node-rsa';

test("new ByteBuffer", () => {
    let buffer;

    buffer = new ByteBuffer();
    expect(buffer.capacity()).toBe(1024);

    buffer = new ByteBuffer(3);
    expect(buffer.capacity()).toBe(3);

    buffer = new ByteBuffer(new ArrayBuffer(65536));
    expect(buffer.capacity()).toBe(65536);
})

test("put integer", () => {
    let buffer;

    buffer = new ByteBuffer(4);
    buffer.putInt(48);
    expect(buffer.capacity()).toBe(4);

    buffer = new ByteBuffer(1);
    buffer.putInt(10000);
    expect(buffer.capacity()).toBe(4);

    buffer = new ByteBuffer(4);
    buffer.putInt(300);
    expect(buffer.rawData()[3]).toBe(44); // 256 + 44 0b100101100

    buffer.rewind();
    expect(buffer.getInt()).toBe(300);
})

test("put byte", () => {
    const buffer = new ByteBuffer(4);
    buffer.putByte(48);
    expect(buffer.capacity()).toBe(4);
    expect(buffer.rawData()[0]).toBe(48);

    buffer.putByteAbsolute(0, 201);
    expect(buffer.rawData()[0]).toBe(201);

    buffer.putByteAbsolute(1, 97);
    expect(buffer.rawData()[1]).toBe(97);

    buffer.rewind();
    expect(buffer.getByte()).toBe(201);
    expect(buffer.getByte()).toBe(97);
    expect(buffer.getByteAbsolute(1)).toBe(97);

    buffer.reset();
    expect(buffer.getByte()).toBe(0);
})

test("put string", () => {
    const buffer = new ByteBuffer(4);
    buffer.putUtf("hello world");
    expect(buffer.capacity()).toBe(15);
    expect(buffer.rawData()[3]).toBe(11);

    buffer.rewind();
    expect(buffer.getUtf()).toBe("hello world");
})

test("new WordArray", () => {
    let buffer: ByteBuffer, newBuffer: ByteBuffer, arr: CryptoJS.lib.WordArray;

    buffer = new ByteBuffer(4);
    buffer.putInt(3000);
    arr = ByteBuffer.toWordArray(buffer);
    newBuffer = ByteBuffer.toByteBuffer(arr);
    expect(newBuffer.getInt()).toBe(3000);

    buffer = new ByteBuffer(4);
    buffer.putUtf("hello world");
    arr = ByteBuffer.toWordArray(buffer);
    newBuffer = ByteBuffer.toByteBuffer(arr);
    expect(newBuffer.getUtf()).toBe("hello world");

    buffer = new ByteBuffer();
    buffer.putUtf("今晚去邊度食飯？");
    arr = ByteBuffer.toWordArray(buffer);
    newBuffer = ByteBuffer.toByteBuffer(arr);
    expect(newBuffer.getUtf()).toBe("今晚去邊度食飯？");

    buffer = new ByteBuffer();
    buffer.putUtf("今晚去邊度食飯？");
    newBuffer = new ByteBuffer(buffer.compactData());
    expect(newBuffer.getUtf()).toBe("今晚去邊度食飯？");
})

test("test rsa", () => {
    const keyObj1 = new NodeRSA(
        "-----BEGIN PUBLIC KEY-----" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd6UUqb8QtQo6b3RlMg91E6cmW" +
        "o+fnDlBg4GofK7EXTu8TFaJfT0c24aQuIbwN9tE5IcK14CfaUFjNE8fR/KrOAuer" +
        "kpVj7p8QOc1faTGnz2lbi0fbqNUM3b0qV5FuUjieFJr6XMecnFCCX5bBMhYD0vZh" +
        "HsjmAaUbMY5/0CgGQwIDAQAB" +
        "-----END PUBLIC KEY-----"
    );
    // var keyObj1 = RSAUtil.createKeys();
    keyObj1.setOptions({ environment: 'browser' });

    const buffer = new ByteBuffer();
    buffer.putRSAPublicKey(keyObj1);
    buffer.rewind();
    const keyObj2 = buffer.getRSAPublicKey();

    if (keyObj2 == undefined)
        throw new Error("failed");

    // @ts-ignore
    expect(keyObj1.keyPair.n).toBeDefined();
    // @ts-ignore
    expect(keyObj1.keyPair.n).toEqual(keyObj2.keyPair.n);
})

test("test encrypted data", () => {
    const aesDetail = {
        iv: CryptoJS.lib.WordArray.random(128 / 8),
        key: CryptoJS.lib.WordArray.random(32),
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
    };


    const buffer = new ByteBuffer(4);
    buffer.putUtf("hello world");
    const data1 = buffer.compactData();
    const before = ByteBuffer.toWordArray(buffer);


    const encrypted = CryptoJS.AES.encrypt(before, aesDetail.key, aesDetail);
    const encryptedData = CryptoJS.lib.CipherParams.create({
        ciphertext: encrypted.ciphertext
    });


    const decrypted = CryptoJS.AES.decrypt(encryptedData, aesDetail.key, aesDetail);
    const data2 = ByteBuffer.toByteBuffer(decrypted).rawData();

    expect(data1).toEqual(data2);
})

test("read write ascii string", () => {
    const expected = "hello world";

    const buffer = new ByteBuffer().putUtf(expected);

    buffer.rewind();
    const actual = buffer.getUtf();

    expect(expected).toBe(actual);
})

test("read write utf string", () => {
    const expected = "你今晚去邊度食飯？";

    const buffer = new ByteBuffer().putUtf(expected);

    buffer.rewind();
    const actual = buffer.getUtf();

    expect(expected).toBe(actual);
})

test("read write oversize string", () => {
    const t = () => {
        new ByteBuffer().putUtf("hello world", 5);
    };

    expect(t).toThrow();
})

test("read write oversize string", () => {
    const t = () => {
        new ByteBuffer().putUtf("hello world", 5).rewind().getUtf(1);
    };

    expect(t).toThrow();
})

test("read length negative string", () => {
    const t = () => {
        new ByteBuffer().putInt(-1).rewind().getUtf(1);
    };

    expect(t).toThrow();
})

test("read write public key", () => {
    const key = RSAUtil.createKeys();

    const buf = new ByteBuffer().putRSAPublicKey(key);

    const actual = buf.rewind().getRSAPublicKey();

    // @ts-ignore
    expect(key.keyPair.n).toBeDefined();
    // @ts-ignore
    expect(key.keyPair.n).toEqual(actual.keyPair.n);
})

test("read oversize public key", () => {
    const t = () => {
        new ByteBuffer().putInt(513).rewind().getRSAPublicKey();
    };

    expect(t).toThrow();
})


test("read length negative public key", () => {
    const t = () => {
        new ByteBuffer().putInt(-1).rewind().getRSAPublicKey();
    };

    expect(t).toThrow();
})

test("read invalid public key", () => {
    const t = () => {
        new ByteBuffer().putInt(4).putInt(0).rewind().getRSAPublicKey();
    };

    expect(t).toThrow();
})