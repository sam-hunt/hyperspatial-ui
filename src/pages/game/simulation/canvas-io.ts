export class CanvasIO {
    // Mouse state
    public mouseX: number = 0;
    public mouseY: number = 0;
    public mouseIsDown: boolean = false;

    // Key states
    public keysDown = new Map<string, boolean>();

    public constructor(canvasEl: HTMLCanvasElement) {
        canvasEl.addEventListener('mousedown', () => { this.mouseIsDown = true; });
        canvasEl.addEventListener('mouseup', () => { this.mouseIsDown = false; });
        canvasEl.addEventListener('mousemove', (ev) => { this.mouseX = ev.clientX; this.mouseY = ev.clientY; });
        canvasEl.addEventListener('keydown', (ev) => { this.keysDown.set(ev.key, true); });
        canvasEl.addEventListener('keyup', (ev) => { this.keysDown.set(ev.key, false); });
        // TODO: test this more
        canvasEl.addEventListener('blur', () => {
            this.mouseIsDown = false;
            this.keysDown.forEach((v, k, m) => m.set(k, false));
        });
    }
}
