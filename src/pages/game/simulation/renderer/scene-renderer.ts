import { vec4 } from 'gl-matrix';
import { ComponentType } from '../ecs/component-type.enum';
import { EcsRegistry } from '../ecs/ecs-registry';
import { TransformComponent } from '../ecs/transform.component';
import { Scene } from '../scenes/scene';
import { Material } from './material';
import { RendererComponent, UniformOverrides } from '../ecs/renderer.component';
import { VertexBuffer } from './vertex-buffer';

export class SceneRenderer {
    private gl: WebGL2RenderingContext;
    private clearColor: vec4 = [0.0, 0.0, 0.0, 0.0];
    private planeBuffer: VertexBuffer;
    private materials: Map<string, Material> = new Map();
    private background: Material;

    public constructor(
        private registry: EcsRegistry,
        private canvasEl: HTMLCanvasElement,
    ) {
        const ctx = this.canvasEl.getContext('webgl2', { alpha: false, premultipliedAlpha: false });
        if (!ctx) { throw new Error('Failed to initialize webgl2 context'); }
        this.gl = ctx;

        this.planeBuffer = VertexBuffer.plane(this.gl);
        this.background = Material.default(this.gl);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        this.gl.canvas.addEventListener('resize', () => {
            this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        });
    }

    public setClearColor(clearColor: vec4) {
        this.clearColor = clearColor;
    }
    public setBackground(materialName: string) {
        const material = this.materials.get(materialName);
        if (!material) throw new Error('Failed to set background material. Has it been loaded?');
        this.background = material;
    }

    public loadMaterial(name: string, textureUrls: string[] = []) {
        if (this.materials.has(name)) return;
        const defaultMat = Material.default(this.gl);
        this.materials.set(name, defaultMat);
        const vertSrcUrl = `/shaders/${name}.vert.glsl`;
        const fragSrcUrl = `/shaders/${name}.frag.glsl`;
        Promise.all([vertSrcUrl, fragSrcUrl].map((url) => this.fetchShaderSrc(url)))
            .then(([vertRes, fragRes]) => {
            // 404s get redirected to index by react-router
                const vertSrc = vertRes.startsWith('<!DOCTYPE html>') ? defaultMat.vertexShaderSrc : vertRes;
                const fragSrc = fragRes.startsWith('<!DOCTYPE html>') ? defaultMat.fragmentShaderSrc : fragRes;
                this.materials.set(name, new Material(this.gl, vertSrc, fragSrc, textureUrls));
            });
    }

    private fetchShaderSrc(url: string): Promise<string> {
        return fetch(url).then((res) => res.text());
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

            // TODO: Remove check once ECS returns a packed query result
            if (!transform || !renderOptions) return;

            // Set the material
            const material = this.materials.get(renderOptions.material)!;
            this.gl.useProgram(material.shaderProgram);

            // Set vertex attributes
            material.vertexAttributes.forEach((vertexAttribute) => vertexAttribute.bind(this.gl, this.planeBuffer.buffer));

            // Set the shader uniforms
            let samplerIndex = 0;
            const uniformValues: UniformOverrides = {
                uProjectionMatrix: scene.camera,
                uTransformPosition: transform.position,
                uTransformScale: transform.scale,
                uColor1: [0.43, 0.02, 0.99, 1],
                uColor2: [0.79, 0.61, 1.00, 1],
                uTime: window.performance.now(),
                ...renderOptions.uniforms,
            };
            material.uniforms.forEach((uniform) => uniform.bindValue(uniformValues[uniform.name] !== undefined
                ? uniformValues[uniform.name]
                : samplerIndex++));
            material.textures.forEach((texture, i) => {
                this.gl.activeTexture(this.gl[`TEXTURE${i.toString()}` as keyof WebGL2RenderingContext] as GLenum);
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
            });

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
