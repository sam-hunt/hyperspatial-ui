import { initShaderProgram } from './init-shader-program';
import { drawScene } from './draw-scene';
import { initBuffers } from './init-buffers';
import { vec4 } from 'gl-matrix';

export const renderWebglSquare = (canvasEl: HTMLCanvasElement, bgColor: vec4) => {
    const gl = canvasEl?.getContext('webgl');
    if (!gl) return;

    const vsSource = `
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }`;

    const fsSource = `
        void main(void) {
            gl_FragColor = vec4(0.43, 0.02, 0.99, 0.1);   
        }`;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    const buffers = initBuffers(gl);

    gl.viewport(0, 0, canvasEl!.width, canvasEl!.height);
    drawScene(gl,programInfo, buffers, bgColor);
};
