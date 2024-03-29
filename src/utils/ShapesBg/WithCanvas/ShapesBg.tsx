import styles from './ShapesBg.module.scss'
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
            Math.round(dFactor * i),
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
  
  return (
    <div className={styles.area}>
          <canvas className={styles.shapes} ref={canvasRef}></canvas>
    </div>
  );
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
  private x: number = 0;
  private y: number = 0;
  private xDisplacement: number = 0;
  private yDisplacement: number = 0;

  constructor(
    private readonly type: number,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly canvas: HTMLCanvasElement,
    private readonly animDuration: number,
    private readonly size: number,
    private readonly colour: Colour,
    private readonly delay: number,
    private readonly initialX: number,
  ) { }

  public update(mousePos: MousePosition, currTime: number) {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    // Moves away from mouse if mouse too close
    let dx = this.x - mousePos.x;
    let dy = this.y - mousePos.y;
    if (dx > canvasWidth / 2) {
      dx = dx - canvasWidth;
    } else if (dx < -canvasWidth / 2) {
      dx = canvasWidth + dx;
    }
    if (dy > canvasHeight / 2) {
      dy = dy - canvasHeight;
    } else if (dy < -canvasHeight / 2) {
      dy = canvasHeight + dy;
    }
    if (Math.sqrt(dx*dx + dy*dy) < 100) {
      this.xDisplacement += Math.round(dx / 15);
      this.yDisplacement += Math.round(dy / 15);
    }
    
    const animationProgress = ((currTime - this.delay) / this.animDuration) % 1;

    // Adds displacements then maps to canvas
    this.x = this.mapToInterval(this.initialX, this.xDisplacement, canvasWidth);
    this.y = this.mapToInterval(canvasHeight * animationProgress, this.yDisplacement, canvasHeight);

    this.draw(animationProgress);
  }

  private mapToInterval(pos: number, displacement: number, interval: number) {
    // Displacement might be negative so we add an extra "interval"
    return (pos + interval + displacement % interval) % interval;
  }

  private draw(rotationProgress: number) {
    this.ctx.beginPath();
    const minimumAlpha = 0.15;
    this.ctx.fillStyle = new Colour(
        this.colour.r,
        this.colour.g,
        this.colour.b,
        minimumAlpha + (this.colour.a - minimumAlpha) * (1 - this.y / this.canvas.height),
      ).toString();
      
    this.rotate(rotationProgress * 720);

    // All figures are drawn with (x, y) as the center
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
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-this.x, -this.y);
  }

  private drawTriangle() {
    const halfWidth = this.size / 1.5; // * 1 / Math.sqrt(Math.sqrt(3)); // Commented is for equilateral triangle to have same area as square but it visually looks better w/ 1.5
    const triangleHeight = Math.sqrt(3) * halfWidth;
    const upmostY = this.y - triangleHeight / 1.5;
    const baseY = upmostY + triangleHeight;
    this.ctx.moveTo(this.x, upmostY);
    this.ctx.lineTo(this.x - halfWidth, baseY);
    this.ctx.lineTo(this.x + halfWidth, baseY);
  }

  private drawSquare() {
    const halfSide = this.size / 2;
    this.ctx.rect(this.x - halfSide, this.y - halfSide, this.size, this.size);
  }

  private drawCircle() {
    this.ctx.arc(this.x, this.y, this.size / Math.sqrt(Math.PI), 0, Math.PI * 2);
  }
}
