import { mat4, vec4 } from 'gl-matrix';
import { ProgramInfo } from '../canvas/draw-scene';
import { initBuffers } from '../canvas/init-buffers';
import { initShaderProgram } from '../canvas/init-shader-program';
import { ComponentType } from './ecs/component-type.enum';
import { EcsRegistry } from './ecs/ecs-registry';
import { ColorComponent } from './ecs/color.component';
import { TransformComponent } from './ecs/transform.component';
import { AbstractScene } from './scenes/abstract-scene';

export class SceneRenderer {

    private gl: WebGL2RenderingContext;

    // TODO: Refactor elsewhere (material? mesh?)
    private squareBuffers: { position: WebGLBuffer; }
    // TODO: Refactor to material/mesh
    private programInfo: ProgramInfo;

    public constructor(private registry: EcsRegistry, canvasEl: HTMLCanvasElement, public clearColor: vec4) {
        const ctx = canvasEl.getContext('webgl2');
        if (!ctx) { throw new Error(`Failed to initialize webgl2 context`); }
        this.gl = ctx;

        const vsSource = `
            attribute vec4 aVertexPosition;

            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            uniform vec4 uColor;
            varying vec4 fragColor;

            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                fragColor = uColor;
            }`;

        const fsSource = `
            precision mediump float;
            varying vec4 fragColor;

            void main(void) {
                // gl_FragColor = vec4(0.43, 0.02, 0.99, 0.1);
                gl_FragColor = fragColor;
            }`;

        const shaderProgram = initShaderProgram(this.gl, vsSource, fsSource);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                color: this.gl.getUniformLocation(shaderProgram, 'uColor'),
            },
        };
        this.squareBuffers = initBuffers(this.gl);
    }

    public drawScene(scene: AbstractScene) {
        // TODO: Do on demand instead of per render
        this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);

        // Clear the screen
        const [r, g, b, a] = Array.from(this.clearColor);
        this.gl.clearColor(r, g, b, a);
        // this.gl.clearColor(0, 0, 64, 1);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);  // Near things obscure far things
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);

        // console.log(this.registry.entities.length);
        // TODO: Refactor to materialized view
        for (const entity of this.registry.entities) {
            
            const transform = entity.components.find(c => c.type === ComponentType.TRANSFORM) as TransformComponent;
            const color = entity.components.find(c => c.type === ComponentType.COLOR) as ColorComponent;

            if (!transform || !color) continue;

            // Set the drawing position to the "identity" point, which is the center of the scene.
            const modelViewMatrix = mat4.create();

            // Now move the drawing position a bit to where we want to start drawing the square.
            mat4.translate(
                modelViewMatrix,    // destination matrix
                modelViewMatrix,    // matrix to translate
                transform.position,
            );

            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            {
                const numComponents = 2;  // pull out 2 values per iteration
                const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
                const normalize = false;  // don't normalize
                const stride = 0;         // how many bytes to get from one set of values to the next
                // 0 = use type and numComponents above
                const offset = 0;         // how many bytes inside the buffer to start from
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareBuffers.position);
                this.gl.vertexAttribPointer(
                    this.programInfo.attribLocations.vertexPosition,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset,
                );
                this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
            }

            // Tell WebGL to use our program when drawing
            this.gl.useProgram(this.programInfo.program);

            // Set the shader uniforms
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.projectionMatrix,
                false,
                scene.camera,
            );
            this.gl.uniformMatrix4fv(
                this.programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix,
            );
            this.gl.uniform4fv(
                this.programInfo.uniformLocations.color!,
                color.color,
            );
            {
                const offset = 0;
                const vertexCount = 4;
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
            }
        }
    }

    public get canvasSize() {
        return {
            w: this.gl.canvas.clientWidth,
            h: this.gl.canvas.clientHeight,
        };
    }

}