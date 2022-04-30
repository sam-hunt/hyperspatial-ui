/**
 * Creates a shader of the given type, uploads the source and compiles it.
 * 
 * @param type gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
 * @param source GLSL source code
 */
const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);

    if (!shader) {
        if (gl.getError() === gl.INVALID_ENUM) throw new Error(`Invalid shader type enum`);
        else throw new Error(`Failed to create shader`);
    }
    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
};

export const initShaderProgram = (gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string) => {
    // Load the shaders
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)!;
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)!;

    // Create the shader program
    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Cleanup on link failure
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteProgram(shaderProgram);
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }
    return shaderProgram;
};
