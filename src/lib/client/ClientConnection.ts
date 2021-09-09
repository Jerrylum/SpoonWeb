import Connection from "../network/Connection";

export default class ClientConnection extends Connection {
    constructor(serverUri:string) {
        super(new WebSocket(serverUri));
    }
}