import { Shader } from './shader';
import { ShaderUniform } from './shader-uniform';
import { Texture } from './texture';
import { VertexAttribute } from './vertex-attribute';

export class Material {
    public shaderProgram: WebGLProgram | null = null;
    public vertexAttributes: VertexAttribute[] = [];
    public uniforms: ShaderUniform[] = [];
    public textures: Texture[] = [];

    public constructor(
        private gl: WebGL2RenderingContext,
        public vertexShaderSrc: string,
        public fragmentShaderSrc: string,
        textureUrls: string[] = [],
    ) {
        let vertexShader: Shader | null = null;
        let fragmentShader: Shader | null = null;
        let shaderProgram: WebGLProgram | null = null;
        try {
            // Load the shaders
            vertexShader = new Shader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
            fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

            // Create the shader program
            shaderProgram = gl.createProgram()!;
            gl.attachShader(shaderProgram, vertexShader.shader!);
            gl.attachShader(shaderProgram, fragmentShader.shader!);
            gl.linkProgram(shaderProgram);

            // Throw on link failure
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw new Error(`Unable to link the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            }

            // Document the attributes of the program for dynamic binding
            const numAttribs = this.gl.getProgramParameter(shaderProgram, this.gl.ACTIVE_ATTRIBUTES);
            let offsetAcc = 0;
            for (let i = 0; i < numAttribs; ++i) {
                const attributeInfo = this.gl.getActiveAttrib(shaderProgram, i);
                if (!attributeInfo) throw new Error('An error occurred fetching attribute details');
                const { name } = attributeInfo;
                const index = this.gl.getAttribLocation(shaderProgram, attributeInfo.name);
                const type = this.gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_TYPE);
                const normalized = gl.getVertexAttrib(index, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
                const glslTypeRegex = new RegExp(`(?:in\\s+)\\w+(?:\\s+${name}\\s*;)`);
                const glslTypeMatch = vertexShaderSrc.match(glslTypeRegex);
                if (!glslTypeMatch) throw new Error('Failed to parse attribute type from shader src');
                const glslType = glslTypeMatch[0];
                const size = this.getElSizeForGlslType(glslType);
                const count = this.getElCountForGlslType(glslType);
                const offset = offsetAcc;
                offsetAcc += count * size;
                const vertexAttribute = new VertexAttribute(name, count, type, index, normalized, 0, offset);
                this.vertexAttributes.push(vertexAttribute);
            }
            const stride = offsetAcc;
            this.vertexAttributes.forEach((va) => { const attrib = va; attrib.stride = stride; });

            // Document the uniforms of the program for dynamic binding
            const numUniforms = this.gl.getProgramParameter(shaderProgram, this.gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < numUniforms; ++i) {
                const uniformInfo = this.gl.getActiveUniform(shaderProgram, i);
                if (!uniformInfo) throw new Error('An error occurred fetching uniform details');
                const { name, size, type } = uniformInfo;
                const index = this.gl.getUniformLocation(shaderProgram, uniformInfo.name)!;
                const uniform = new ShaderUniform(this.gl, name, size, type, index);
                this.uniforms.push(uniform);
            }
        } catch (e) {
            if (shaderProgram) gl.deleteProgram(shaderProgram);
            throw e;
        } finally {
            if (vertexShader) gl.deleteShader(vertexShader.shader);
            if (fragmentShader) gl.deleteShader(fragmentShader.shader);
        }
        textureUrls.forEach((url) => this.textures.push(new Texture(gl, url)));
        this.shaderProgram = shaderProgram;
    }

    private getElCountForGlslType(glslType: string): number {
        const typeMatch = glslType.match(/(vec|mat|bool|int|float|double)(\d)?(?:x)?(\d)?/);
        if (!typeMatch) throw new Error(`Unable to parse GLSL type '${glslType}'`);
        const [subtype, n1, n2] = typeMatch.slice(1, 4);
        if (subtype === 'vec') return parseInt(n1, 10);
        if (subtype === 'mat') return parseInt(n1, 10) * (parseInt(n2, 10) || parseInt(n1, 10));
        return 1;
    }

    private getElSizeForGlslType(glslType: string): number {
        if (glslType.match(/(bvec|bool)/)) return 1;
        if (glslType.match(/(dvec|double)/)) return 8;
        return 4;
    }

    public destroy() {
        if (this.shaderProgram) this.gl.deleteProgram(this.shaderProgram);
    }

    private static defaultMaterial: Material | null;

    public static default(gl: WebGL2RenderingContext): Material {
        if (!this.defaultMaterial) {
            const vertexShaderSrc = `#version 300 es
                precision highp float;
                
                in vec3 aVertexPosition;
                in vec2 aTextureCoords;
                
                uniform mat4 uProjectionMatrix;
                uniform vec3 uTransformPosition;
                uniform vec3 uTransformScale;
                
                out vec2 vTextureCoords;
                
                void main() {
                    // Translate from origin by world coords
                    mat4 modelViewMatrix = mat4(
                        vec4(1.0, 0.0, 0.0, 0.0),
                        vec4(0.0, 1.0, 0.0, 0.0),
                        vec4(0.0, 0.0, 1.0, 0.0),
                        vec4(uTransformPosition, 1.0)
                    );

                    // Scale the local vertices
                    vec4 vertexPosition = vec4(aVertexPosition * uTransformScale, 1.0);

                    // Multiple for Model View Projection
                    gl_Position = uProjectionMatrix * modelViewMatrix * vertexPosition;
                    vTextureCoords = aTextureCoords;
                }
            `;
            const fragmentShaderSrc = `#version 300 es
                precision highp float;
                
                in vec2 vTextureCoords;
                out vec4 FragColor;

                void main(void) {
                    FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                }
            `;
            this.defaultMaterial = new Material(gl, vertexShaderSrc, fragmentShaderSrc);
        }
        return this.defaultMaterial;
    }
}
