export class Shader {
    public shader: WebGLShader | null = null;

    /**
     * Create and compile a webgl2 shader
     * @throws if creation or compilation fails
     * @param type gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
     * @param source GLSL source code
     */
    public constructor(
        gl: WebGL2RenderingContext,
        type: number,
        source: string,
    ) {
        const shader = gl.createShader(type);

        if (!shader) {
            if (gl.getError() === gl.INVALID_ENUM) throw new Error(`Invalid shader type enum (${type})`);
            else throw new Error('Failed to create shader');
        }
        // Send the source to the shader object
        gl.shaderSource(shader, source);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`An error occurred compiling the shader: ${gl.getShaderInfoLog(shader)}\n\nSource:\n${source}`);
        }
        this.shader = shader;
    }
}
