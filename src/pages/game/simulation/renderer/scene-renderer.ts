import { mat4, vec4 } from 'gl-matrix';
import { initBuffers } from './init-buffers';
import { ComponentType } from '../ecs/component-type.enum';
import { EcsRegistry } from '../ecs/ecs-registry';
import { TransformComponent } from '../ecs/transform.component';
import { Scene } from '../scenes/scene';
import { Material } from './material';
import { RendererComponent } from '../ecs/renderer.component';

export class SceneRenderer {
    private gl: WebGL2RenderingContext;
    private clearColor: vec4 = [0.0, 0.0, 0.0, 0.0];
    private squareBuffers: { position: WebGLBuffer; };
    private defaultMaterial: Material | null = null;
    private materials: Map<string, Material> = new Map();

    public constructor(
        private registry: EcsRegistry,
        private canvasEl: HTMLCanvasElement,
    ) {
        const ctx = this.canvasEl.getContext('webgl2');
        if (!ctx) { throw new Error('Failed to initialize webgl2 context'); }
        this.gl = ctx;

        this.defaultMaterial = new Material(
            this.gl,
            `attribute vec3 aVertexPosition; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
            void main() { gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0); }`,
            'precision highp float; uniform vec4 uColor; void main(void) { gl_FragColor = uColor; }',
        ).init();
        this.squareBuffers = initBuffers(this.gl);

        this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        this.gl.canvas.addEventListener('resize', () => {
            this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        });
    }

    public setClearColor(clearColor: vec4) {
        this.clearColor = clearColor;
    }

    public async loadMaterial(name: string) {
        if (this.materials.has(name)) return;
        const [vertFetch, fragFetch] = await Promise.all([
            fetch(`/shaders/${name}.vert.glsl`),
            fetch(`/shaders/${name}.frag.glsl`),
        ]);
        const [vertText, fragText] = await Promise.all([vertFetch, fragFetch].map(async (res) => res.text()));
        // 404s get redirected to the index by react-router so start with <!DOCTYPE html>
        // TODO something more elegant
        const vertSrc = !vertText.startsWith('<!DOCTYPE html>') ? vertText : this.defaultMaterial!.vertexShaderSrc;
        const fragSrc = !fragText.startsWith('<!DOCTYPE html>') ? fragText : this.defaultMaterial!.fragmentShaderSrc;
        const material = new Material(this.gl, vertSrc, fragSrc).init();
        this.materials.set(name, material);
    }

    private clear() {
        // Clear the screen
        const [r, g, b, a] = Array.from(this.clearColor);
        this.gl.clearColor(r, g, b, a);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }

    public drawScene(scene: Scene) {
        this.clear();

        // TODO: Refactor to materialized view
        this.registry.entities.forEach((entity) => {
            const transform = entity.components.find((c) => c.type === ComponentType.TRANSFORM) as TransformComponent;
            const renderOptions = entity.components.find((c) => c.type === ComponentType.RENDER2D) as RendererComponent;

            if (!transform || !renderOptions) return;

            const material = this.materials.get(renderOptions.material) || this.defaultMaterial!;

            const modelViewMatrix = mat4.create();
            mat4.translate(modelViewMatrix, modelViewMatrix, transform.position);

            // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
            material.attributes.forEach((vertexAttribute) => vertexAttribute.bind(this.gl, this.squareBuffers.position));

            // Tell WebGL to use our program when drawing
            this.gl.useProgram(material.shaderProgram);

            // Set the shader uniforms
            // TODO: Bind uniforms dynamically without so much checking and branching in the hot loop
            material.uniforms.find((u) => u.name === 'uProjectionMatrix')?.bindValue(scene.camera);
            material.uniforms.find((u) => u.name === 'uModelViewMatrix')?.bindValue(modelViewMatrix);
            const colorValue: vec4 = renderOptions.uniforms.find((u) => u.name === 'uColor')?.value as vec4 || [0.0, 0.0, 0.0, 0.0];
            material.uniforms.find((u) => u.name === 'uColor')?.bindValue(colorValue);

            const uTime = material.uniforms.find((u) => u.name === 'uTime');
            if (uTime) this.gl.uniform1f(uTime.index, window.performance.now());

            {
                const offset = 0;
                const vertexCount = 4;
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
            }
        });
    }

    public get canvasSize() {
        return {
            w: this.gl.canvas.clientWidth,
            h: this.gl.canvas.clientHeight,
        };
    }
}
