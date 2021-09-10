import rs from 'jsrsasign';

export default class RSAUtil {

    public static RSA_ALGORITHM: String = "RSA";

    public static createKeys(keySize = 2048) {
        // actually the obj included both public and private key
        return rs.KEYUTIL.generateKeypair("RSA", keySize).prvKeyObj;
    }
}