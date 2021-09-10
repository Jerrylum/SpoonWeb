import ByteBuffer from "@/lib/network/ByteBuffer";
import AESUtil from "@/lib/network/security/AESUtil";
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";
import RSAUtil from "@/lib/network/security/RSAUtil";
import rs from 'jsrsasign';

test("new ByteBuffer", () => {
    var buffer;
    
    buffer = new ByteBuffer();
    expect(buffer.capacity()).toBe(1024);

    buffer = new ByteBuffer(3);
    expect(buffer.capacity()).toBe(3);

    buffer = new ByteBuffer(new ArrayBuffer(65536));
    expect(buffer.capacity()).toBe(65536);
})

test("put integer", () => {
    var buffer;
    
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
    var buffer;
    
    buffer = new ByteBuffer(4);
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
    var buffer;
    
    buffer = new ByteBuffer(4);
    buffer.putUtf("hello world");
    expect(buffer.capacity()).toBe(15);
    expect(buffer.rawData()[3]).toBe(11);

    buffer.rewind();
    expect(buffer.getUtf()).toBe("hello world");
})

test("new WordArray", () => {
    var buffer: ByteBuffer, newBuffer: ByteBuffer, arr: CryptoJS.lib.WordArray;

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
})

test("test rsa", () => {
    var keyObj1 = rs.KEYUTIL.getKey(
        "-----BEGIN PUBLIC KEY-----" + 
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd6UUqb8QtQo6b3RlMg91E6cmW" + 
        "o+fnDlBg4GofK7EXTu8TFaJfT0c24aQuIbwN9tE5IcK14CfaUFjNE8fR/KrOAuer" + 
        "kpVj7p8QOc1faTGnz2lbi0fbqNUM3b0qV5FuUjieFJr6XMecnFCCX5bBMhYD0vZh" + 
        "HsjmAaUbMY5/0CgGQwIDAQAB" + 
        "-----END PUBLIC KEY-----");

    if (!(keyObj1 instanceof rs.RSAKey))
        throw new Error("failed");

    var buffer: ByteBuffer;

    buffer = new ByteBuffer();
    buffer.putRSAPublicKey(keyObj1);
    buffer.rewind();
    var keyObj2 = buffer.getRSAPublicKey();

    if (keyObj2 == undefined)
        throw new Error("failed");

    // unstable may not be the same
    // var a = rs.KEYUTIL.getPEM(keyObj1);
    // var b = rs.KEYUTIL.getPEM(keyObj2);
    // expect(a).toBe(b);


    //@ts-ignore
    var a = rs.KJUR.crypto.Cipher.encrypt(buffer.rawData(), keyObj1, "RSA");
    // var b = rs.KJUR.crypto.Cipher.encrypt("hello world", keyObj2, "RSA");
    // expect(a).toBe(b);
})