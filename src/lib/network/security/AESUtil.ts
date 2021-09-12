import CryptoJS from "crypto-js";

class AESUtil {
    public static createCipherSecret(): AESUtil.CipherSecret {
        return {
            iv: CryptoJS.lib.WordArray.random(128 / 8),
            key: CryptoJS.lib.WordArray.random(32),
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.NoPadding
        };
    }
}

namespace AESUtil {
    
    export interface CipherSecret {
        iv: CryptoJS.lib.WordArray;
        key: CryptoJS.lib.WordArray;
        [x: string]: any;
    }
}

export default AESUtil;