import ByteBuffer from "../ByteBuffer";
import CryptoJS from "crypto-js";
import NodeRSA from 'node-rsa';
import AESUtil from "./AESUtil";

export default class EncryptionManager {
    secretAES?: AESUtil.CipherSecret;
    keyRSA?: NodeRSA;
    
    public encode(buf: Uint8Array): ByteBuffer {
        if (this.secretAES != null) {
            var words = ByteBuffer.toWordArray(new ByteBuffer(buf.buffer).forward());
            var result1 = CryptoJS.AES.encrypt(words, this.secretAES.key, this.secretAES);

            return ByteBuffer.toByteBuffer(result1.ciphertext);
        } else if (this.keyRSA != null) {
            var result2 = new Uint8Array(this.keyRSA.encrypt(Buffer.from(buf)));
            return new ByteBuffer(result2.buffer);
        } else {
            return new ByteBuffer(buf.buffer);
        }
    }

    public decode(buf: Uint8Array): ByteBuffer {
        if (this.secretAES != null) {
            var encryptedData = CryptoJS.lib.CipherParams.create({
                ciphertext: ByteBuffer.toWordArray(new ByteBuffer(buf.buffer).forward())
            });
            var result1 = CryptoJS.AES.decrypt(encryptedData, this.secretAES.key, this.secretAES);
            return ByteBuffer.toByteBuffer(result1);
        } else if (this.keyRSA != null) {
            var result2 = new Uint8Array(this.keyRSA.decrypt(Buffer.from(buf)));
            return new ByteBuffer(result2.buffer);
        } else {
            return new ByteBuffer(buf.buffer);
        }
    }
}