import { Word32Array } from "jscrypto/Word32Array";
import { AESProps } from "jscrypto/AES";
import { CFB } from "jscrypto/mode/CFB";
import { NoPadding } from "jscrypto/pad/NoPadding";

class AESUtil {
    public static createCipherSecret(): Partial<AESProps> {
        return {
            iv: Word32Array.random(128 / 8),
            key: Word32Array.random(32),
            mode: CFB,
            padding: NoPadding
        };
    }
}

export default AESUtil;