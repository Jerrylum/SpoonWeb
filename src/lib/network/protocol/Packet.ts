export default interface EncryptionManager {
    read(data: DataView): void
    write(data: DataView): void
}