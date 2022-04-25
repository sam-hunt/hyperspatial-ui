import initShaderProgram from './init-shader-program';

const renderWebglTexture = (canvasEl: HTMLCanvasElement) => {
    const gl = canvasEl?.getContext('webgl');
    if (!gl) return;

    // Clear the canvas
    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    const mVertices = [
        -0.15, -0.15, 0.15,
        0.15, -0.15, 0.15,
        0.15, 0.15, 0.15,
        -0.15, 0.15, 0.15,
    ];
    const mIndices = [
        0, 1, 2,
        2, 3, 0,
    ]

    // Prepare Vertex Buffer Object
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVertices), gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Prepare Index Buffer Object
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mIndices), gl.STATIC_DRAW);
    
    const shaderProgram = initShaderProgram(gl, `
        attribute vec2 position;
        void main(void) {
            gl_Position = vec4(position, 0.0, 1.0);
        }`, `
        void main(void) {
            gl_FragColor = vec4(0.43, 0.02, 0.99, 0.1);   
        }`,
    );
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    const positionAttrib = gl.getAttribLocation(shaderProgram, 'position'); // Get the attribute location
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);  // point an attribute to the currently bound VBO
    gl.enableVertexAttribArray(positionAttrib);  // Enable the attribute

    gl.viewport(0, 0, canvasEl!.width, canvasEl!.height);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

export default renderWebglTexture;