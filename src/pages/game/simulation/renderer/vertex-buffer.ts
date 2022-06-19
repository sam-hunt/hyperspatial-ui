export class VertexBuffer {
    public buffer: WebGLBuffer;

    public constructor(
        gl: WebGL2RenderingContext,
        data: number[],
    ) {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Webgl failed to create buffer');
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }

    private static planeBuffer: VertexBuffer | null;

    public static plane(gl: WebGL2RenderingContext): VertexBuffer {
        if (!this.planeBuffer) {
            this.planeBuffer = new VertexBuffer(gl, [
                // vertex pos -- tex coords
                // x    y    z    u    v
                1.0, 1.0, 0.0, 1.0, 0.0,
                -1.0, 1.0, 0.0, 0.0, 0.0,
                1.0, -1.0, 0.0, 1.0, 1.0,
                -1.0, -1.0, 0.0, 0.0, 1.0,
            ]);
        }
        return this.planeBuffer;
    }
}
