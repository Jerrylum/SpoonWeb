import NodeRSA from 'node-rsa';

export default class RSAUtil {

    public static RSA_ALGORITHM = "RSA";

    public static createKeys(keySize = 2048): NodeRSA {
        return new NodeRSA({b: keySize});
    }
}