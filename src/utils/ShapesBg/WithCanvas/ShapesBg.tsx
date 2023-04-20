import React, { useEffect, useRef } from 'react'
import { MousePosition, useMousePositionRef, useWindowDimensions } from '@/utils/utils'

export class Colour {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number,
  ) { }

  toString = (): string =>
    `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
}

export interface ShapesProps {
  numOfParticlesPerUnit?: number,
  avgAnimDuration?: number,
  shapeSize?: number,
  colour?: Colour,
}
const ShapesBg = ({
  numOfParticlesPerUnit = 45,
  avgAnimDuration = 15,
  shapeSize = 20,
  colour = new Colour(255, 255, 255, 1),
}: ShapesProps): JSX.Element => {
  const unitSize = 1000; // In pixels

  const canvasRef = useRef(null);
  const mousePosRef = useMousePositionRef();
  const wDimensions = useWindowDimensions();
  
  const requestRef = useRef(0);
  const animate = useRef<(time: number) => void>(() => {
    requestRef.current = requestAnimationFrame(animate.current);
  });

  useEffect(() => {
    const {width, height} = wDimensions;
    if (width === 0 && height === 0) return;

    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const numOfParticles = numOfParticlesPerUnit * width / unitSize;
    const delay = 1000 * avgAnimDuration / numOfParticles; // In milliseconds
    const dFactor = width / numOfParticles; // Distance between each figure
    
    const indexArr = Array.from({ length: numOfParticles }, (_, i) => i);
    const particles: Particle[] = [];
    for (let i = 0; i < numOfParticles; i++) {
      const currDelay = delay * randomPop(indexArr);
      setTimeout(
        () => particles.push(
          new Particle(
            i,
            ctx,
            canvas,
            randomIntWithAvg(avgAnimDuration) * 1000, // milliseconds
            shapeSize,
            colour,
            currDelay,
            dFactor * i,
          )
        ),
        currDelay,
      );
    }

    animate.current = (time) => {
      requestRef.current = requestAnimationFrame(animate.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update(mousePosRef.current, time));
    }
  }, [canvasRef, wDimensions]);

  useEffect(() => {
    animate.current(0);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
  
  return <canvas ref={canvasRef}></canvas>;
}
export default ShapesBg;

const randomIntInRange = (min: number, max: number): number => 
  Math.floor(min + Math.random() * (max - min + 1));

const randomIntWithAvg = (avg: number): number => {
  const halfAvg = avg / 2;
  return randomIntInRange(avg - halfAvg, avg + halfAvg);
};

const randomPop = <T,>(arr: T[]): T => 
  arr.splice(Math.floor(Math.random() * arr.length), 1)[0];

class Particle {
  private y: number = 0;
  private yDisplacement: number = 0;

  constructor(
    private readonly type: number,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly canvas: HTMLCanvasElement,
    private readonly animDuration: number,
    private readonly size: number,
    private readonly colour: Colour,
    private readonly currDelay: number,
    private x: number,
  ) {
  }

  public update(mousePos: MousePosition, currTime: number) {
    const dx = this.x - mousePos.x;
    const dy = this.y - mousePos.y;

    if (Math.sqrt(dx*dx + dy*dy) < 100) {
      this.x += dx / 15;
      this.yDisplacement += dy / 15;
    }
    
    const animationProgress = ((currTime - this.currDelay) / this.animDuration) % 1;
    this.y = (this.canvas.height * animationProgress + this.yDisplacement) % this.canvas.height;
    this.draw(this.y / this.canvas.height);
  }

  private draw(progress: number) {
    this.ctx.beginPath();
    this.ctx.fillStyle = new Colour(
        this.colour.r,
        this.colour.g,
        this.colour.b,
        this.colour.a * (1 - this.y / this.canvas.height),
      ).toString();
      
    this.rotate(progress * 720);

    switch (this.type % 3) {
      case 0: // Triangle
        this.drawTriangle();
        break;
      case 1: // Square
        this.drawSquare();
        break;
      case 2: // Circle
        this.drawCircle();
        break;
    }

    this.ctx.fill();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.closePath();
  }

  private rotate(angle: number) {
    const cx = this.x + this.size / 2;
    const cy = this.y + this.size / 2;
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-cx, -cy);
  }

  private drawTriangle() {
    const halfWidth = this.size / 1.5; // * 1 / Math.sqrt(Math.sqrt(3)); // Commented is for equilateral triangle to have same area as square but it visually looks better w/ 1.5
    const baseY = this.y + Math.sqrt(3) * halfWidth;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x - halfWidth, baseY);
    this.ctx.lineTo(this.x + halfWidth, baseY);
  }

  private drawSquare() {
    this.ctx.rect(this.x, this.y, this.size, this.size);
  }

  private drawCircle() {
    this.ctx.arc(this.x, this.y, this.size / Math.sqrt(Math.PI), 0, Math.PI * 2);
  }
}
