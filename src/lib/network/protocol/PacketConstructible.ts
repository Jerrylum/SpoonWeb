import Packet from "./Packet";

export default interface PacketConstructible {
    new(): Packet;
}