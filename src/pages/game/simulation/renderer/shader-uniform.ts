type UniformBindFn = (value: any) => void;

export class ShaderUniform {
    private bindFn: UniformBindFn;

    public constructor(
        gl: WebGL2RenderingContext,
        public name: string,
        public size: number,
        public type: GLuint,
        public index: WebGLUniformLocation,
    ) {
        switch (this.type) {
            // Scalar uniform types
            case gl.FLOAT: { this.bindFn = gl.uniform1f.bind(gl, this.index); break; }
            case gl.FLOAT_VEC2: { this.bindFn = gl.uniform2fv.bind(gl, this.index); break; }
            case gl.FLOAT_VEC3: { this.bindFn = gl.uniform3fv.bind(gl, this.index); break; }
            case gl.FLOAT_VEC4: { this.bindFn = gl.uniform4fv.bind(gl, this.index); break; }
            case gl.INT: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.INT_VEC2: { this.bindFn = gl.uniform2iv.bind(gl, this.index); break; }
            case gl.INT_VEC3: { this.bindFn = gl.uniform3iv.bind(gl, this.index); break; }
            case gl.INT_VEC4: { this.bindFn = gl.uniform4iv.bind(gl, this.index); break; }
            case gl.BOOL: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.BOOL_VEC2: { this.bindFn = gl.uniform2iv.bind(gl, this.index); break; }
            case gl.BOOL_VEC3: { this.bindFn = gl.uniform3iv.bind(gl, this.index); break; }
            case gl.BOOL_VEC4: { this.bindFn = gl.uniform4iv.bind(gl, this.index); break; }
            case gl.FLOAT_MAT2: { this.bindFn = gl.uniformMatrix2fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT3: { this.bindFn = gl.uniformMatrix3fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT4: { this.bindFn = gl.uniformMatrix4fv.bind(gl, this.index, false); break; }
            case gl.UNSIGNED_INT: { this.bindFn = gl.uniform1ui.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_VEC2: { this.bindFn = gl.uniform2uiv.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_VEC3: { this.bindFn = gl.uniform3uiv.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_VEC4: { this.bindFn = gl.uniform4uiv.bind(gl, this.index); break; }
            case gl.FLOAT_MAT2x3: { this.bindFn = gl.uniformMatrix2x3fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT2x4: { this.bindFn = gl.uniformMatrix2x4fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT3x2: { this.bindFn = gl.uniformMatrix3x2fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT3x4: { this.bindFn = gl.uniformMatrix3x4fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT4x2: { this.bindFn = gl.uniformMatrix4x2fv.bind(gl, this.index, false); break; }
            case gl.FLOAT_MAT4x3: { this.bindFn = gl.uniformMatrix4x3fv.bind(gl, this.index, false); break; }
            // Sampler uniform types
            case gl.SAMPLER_2D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.SAMPLER_CUBE: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.SAMPLER_3D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.SAMPLER_2D_SHADOW: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.SAMPLER_2D_ARRAY: { this.bindFn = gl.uniform1iv.bind(gl, this.index); break; }
            case gl.SAMPLER_2D_ARRAY_SHADOW: { this.bindFn = gl.uniform1iv.bind(gl, this.index); break; }
            case gl.SAMPLER_CUBE_SHADOW: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.INT_SAMPLER_2D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.INT_SAMPLER_3D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.INT_SAMPLER_CUBE: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.INT_SAMPLER_2D_ARRAY: { this.bindFn = gl.uniform1iv.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_SAMPLER_2D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_SAMPLER_3D: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_SAMPLER_CUBE: { this.bindFn = gl.uniform1i.bind(gl, this.index); break; }
            case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY: { this.bindFn = gl.uniform1iv.bind(gl, this.index); break; }
            default: this.bindFn = () => {};
        }
    }

    public bindValue(value: unknown) {
        // try {
        this.bindFn.call(this, value);
        // } catch (e) {
        //     throw new Error(`failed to bind uniform ${this.name}. Error: ${e}`);
        // }
    }
}
