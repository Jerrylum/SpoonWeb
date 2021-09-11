import NodeRSA from 'node-rsa';

export default class RSAUtil {

    public static RSA_ALGORITHM: String = "RSA";

    public static createKeys(keySize = 2048) {
        return new NodeRSA({b: keySize});
    }
}