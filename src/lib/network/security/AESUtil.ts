import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js";

export default class AESUtil {
    public static test() {
        var wa = CryptoJS.lib.WordArray.create([]);

        sha256("hi");
    }
}