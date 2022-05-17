export class VertexAttribute {
    public constructor(
        public name: string,
        public size: number,
        public type: number,
        public index: number,
        public normalized: boolean,
        public stride: number,
        public offset: number,
    ) {}

    public bind(gl: WebGL2RenderingContext, buffer: WebGLBuffer): void {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(this.index, this.size, this.type, this.normalized, this.stride, this.offset);
        gl.enableVertexAttribArray(this.index);
    }
}
