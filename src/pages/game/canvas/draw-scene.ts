import { vec4, mat4 } from 'gl-matrix';

export interface ProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        vertexPosition: ReturnType<WebGLRenderingContextBase['getAttribLocation']>,
    },
    uniformLocations: {
        projectionMatrix: ReturnType<WebGLRenderingContextBase['getUniformLocation']>,
        modelViewMatrix: ReturnType<WebGLRenderingContextBase['getUniformLocation']>,
        color?: ReturnType<WebGLRenderingContextBase['getUniformLocation']>,
    },
}

export const drawScene = (
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: { position: WebGLBuffer },
    bgColor: vec4,
) => {
    // Clear the canvas
    const [r, g, b, a] = Array.from(bgColor);
    gl.clearColor(r, g, b, a);
    // gl.clearColor(0, 0, 64, 1);
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    // const fieldOfView = 120 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const clip = 25.0;

    // glMatrix always has the first argument as the destination to receive the result.
    const projectionMatrix = mat4.create();
    // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    mat4.ortho(projectionMatrix, -clip, clip, -clip / aspect, clip / aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to start drawing the square.
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0], // amount to translate
    );

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
};
