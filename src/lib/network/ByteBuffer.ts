import CryptoJS from "crypto-js";
var util = require('util');

export default class ByteBuffer {
    // private buffer: ArrayBuffer;
    private data: Uint8Array;
    private position: number = 0;

    constructor(arg?: ArrayBuffer | number) {
        var buf: ArrayBuffer;
        if (arg instanceof ArrayBuffer) 
            buf = arg;
        else
            buf = new ArrayBuffer(arg ?? 1024);
        this.data = new Uint8Array(buf);
    }

    public static malloc(size: number) {
        return new DataView(new ArrayBuffer(size));
    }

    public static toWordArray(buf: ByteBuffer): CryptoJS.lib.WordArray {
        buf.put(new Uint8Array([0,0,0,0]), 4 - buf.index() % 4); // padding
        return CryptoJS.lib.WordArray.create(Array.from(new Int32Array(buf.compactData().buffer)), buf.index());
    }

    public static toByteBuffer(array: CryptoJS.lib.WordArray): ByteBuffer {
        return new ByteBuffer(new Int32Array(array.words).buffer.slice(0, array.sigBytes));
    }

    private expand(payloadSize: number) {
        if (this.remaining() < payloadSize) {
            var newData = new Uint8Array(new ArrayBuffer(Math.max(this.capacity() * 2, this.position + payloadSize)));
            newData.set(this.data, 0);
            this.data = newData;
        }
    }

    public get(len: number): Uint8Array {
        var rtn = this.getAbsolute(this.position, len);
        this.position += len;
        return rtn;
    }

    public getAbsolute(absIndex: number, len: number): Uint8Array {
        if (absIndex + len > this.capacity()) throw new Error("underflow");

        return this.data.slice(absIndex, absIndex + len);
    }

    public getByte(): number {
        return new DataView(this.get(1).buffer).getUint8(0);
    }

    public getByteAbsolute(absIndex: number): number {
        return new DataView(this.getAbsolute(absIndex, 1).buffer).getUint8(0);
    }

    public getInt(): number {
        return new DataView(this.get(4).buffer).getInt32(0);
    }

    public getUtf(maxStringLength = 32767) {
        var actualByteSize = this.getInt();

        if (actualByteSize > maxStringLength * 4)
            throw new Error("The received encoded string buffer length is longer than maximum allowed");
        if (actualByteSize < 0)
            throw new Error("The received encoded string buffer length is less than zero! Weird string!");

        return new util.TextDecoder().decode(this.get(actualByteSize));
    }

    public put(buf: DataView | ArrayBuffer | Uint8Array, len?: number) {
        var target: Uint8Array;
        if (buf instanceof DataView)
            target = new Uint8Array(buf.buffer);
        else if (buf instanceof ArrayBuffer)
            target = new Uint8Array(buf);
        else
            target = buf;

        var length = len ?? target.byteLength;

        this.expand(length);

        this.data.set(target.slice(0, length), this.position);
        this.position += length;
        return this;
    }

    public putByte(byte: number) {
        this.expand(1);

        this.data[this.position] = byte;
        this.position ++;
        return this;
    }

    public putByteAbsolute(absIndex: number, byte: number) {
        this.data[absIndex] = byte;
        return this;
    }

    public putInt(num: number) {
        var buf = ByteBuffer.malloc(4);
        buf.setInt32(0, num);
        return this.put(buf);
    }

    public putUtf(str: string, maxByteSize = 32767*4) {
        var bytes = new util.TextEncoder().encode(str);
        if (bytes.length > maxByteSize)
            throw new Error("string too big");
        return this.putInt(bytes.length).put(bytes);
    }

    public capacity() {
        return this.data.length;
    }

    public index() {
        return this.position;
    }

    public reset() {
        this.data = new Uint8Array(new ArrayBuffer(this.capacity()));
        return this.rewind();
    }

    public remaining() {
        return this.capacity() - this.position;
    }

    public rewind() {
        this.position = 0;
        return this;
    }

    public rawData() {
        return this.data;
    }

    public compactData() {
        return this.data.slice(0, this.position);
    }
}