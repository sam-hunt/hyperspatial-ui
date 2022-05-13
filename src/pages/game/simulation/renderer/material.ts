export class Material {
    public shaderProgram: WebGLProgram | null = null;
    // public textures: Texture[] = [];

    public attributes: (WebGLActiveInfo & { location: number })[] = [];
    public uniforms: (WebGLActiveInfo & { location: WebGLUniformLocation })[] = [];

    public constructor(
        private gl: WebGL2RenderingContext,
        public vertexShaderSrc: string,
        public fragmentShaderSrc: string,
    ) {}

    public init() {
        this.shaderProgram = this.loadShaderProgram(this.gl, this.vertexShaderSrc, this.fragmentShaderSrc);
        return this;
    }

    public destroy() {
        if (this.shaderProgram) this.gl.deleteProgram(this.shaderProgram);
    }

    private loadShaderProgram(gl: WebGLRenderingContext, vertexShaderSrc: string, fragmentShaderSrc: string): WebGLProgram {
        let vertexShader: WebGLShader | null = null;
        let fragmentShader: WebGLShader | null = null;
        let shaderProgram: WebGLProgram | null = null;
        try {
            // Load the shaders
            vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
            fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

            // Create the shader program
            shaderProgram = gl.createProgram()!;
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            // Throw on link failure
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw new Error(`Unable to link the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            }

            // Document the attributes of the program for dynamic binding
            const numAttribs = this.gl.getProgramParameter(shaderProgram, this.gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < numAttribs; ++i) {
                const attributeInfo = this.gl.getActiveAttrib(shaderProgram, i);
                if (!attributeInfo) throw new Error('An error occurred fetching attribute details');
                const { name, size, type } = attributeInfo;
                const location = this.gl.getAttribLocation(shaderProgram, attributeInfo.name);
                this.attributes.push({ name, size, type, location });
            }

            // Document the uniforms of the program for dynamic binding
            const numUniforms = this.gl.getProgramParameter(shaderProgram, this.gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < numUniforms; ++i) {
                const uniformInfo = this.gl.getActiveUniform(shaderProgram, i);
                if (!uniformInfo) throw new Error('An error occurred fetching uniform details');
                const { name, size, type } = uniformInfo;
                const location = this.gl.getUniformLocation(shaderProgram, uniformInfo.name)!;
                this.uniforms.push({ name, size, type, location });
            }
        } catch (e) {
            if (shaderProgram) gl.deleteProgram(shaderProgram);
            throw e;
        } finally {
            if (vertexShader) gl.deleteShader(vertexShader);
            if (fragmentShader) gl.deleteShader(fragmentShader);
        }
        return shaderProgram!;
    }

    /**
     * Creates a shader of the given type, uploads the source and compiles it.
     *
     * @param type gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
     * @param source GLSL source code
     */
    private loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type);

        if (!shader) {
            if (gl.getError() === gl.INVALID_ENUM) throw new Error('Invalid shader type enum');
            else throw new Error('Failed to create shader');
        }
        // Send the source to the shader object
        gl.shaderSource(shader, source);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        }
        return shader!;
    }
}
