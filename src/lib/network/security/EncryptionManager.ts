import ByteBuffer from "../ByteBuffer";
import NodeRSA from 'node-rsa';
import { AES, AESProps } from "jscrypto/AES";
import { CipherParams } from "jscrypto/CipherParams";
import { Word32Array } from "jscrypto";

export default class EncryptionManager {
    secretAES?: Partial<AESProps>;
    keyRSA?: NodeRSA;
    
    public encode(buf: Uint8Array): ByteBuffer {
        if (this.secretAES != null) {
            const words = ByteBuffer.toWordArray(ByteBuffer.from(buf).forward());
            const result1 = AES.encrypt(words, this.secretAES.key as Word32Array, this.secretAES);

            if (result1.cipherText == undefined) throw new Error("encrypt failed");            

            return ByteBuffer.from(result1.cipherText);
        } else if (this.keyRSA != null) {
            const result2 = this.keyRSA.encrypt(Buffer.from(buf));
            return ByteBuffer.from(result2);
        } else {
            return ByteBuffer.from(buf);
        }
    }

    public decode(buf: Uint8Array): ByteBuffer {
        if (this.secretAES != null) {
            const encryptedData = new CipherParams({
                cipherText: ByteBuffer.toWordArray(ByteBuffer.from(buf).forward())
            });
            const result1 = AES.decrypt(encryptedData, this.secretAES.key as Word32Array, this.secretAES);
            return ByteBuffer.from(result1);
        } else if (this.keyRSA != null) {
            const result2 = this.keyRSA.decrypt(Buffer.from(buf));
            return ByteBuffer.from(result2);
        } else {
            return ByteBuffer.from(buf);
        }
    }
}