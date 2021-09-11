import ByteBuffer from "../ByteBuffer";

export default interface Packet {
    getClassName(): string
    read(buf: ByteBuffer): void
    write(buf: ByteBuffer): void
}