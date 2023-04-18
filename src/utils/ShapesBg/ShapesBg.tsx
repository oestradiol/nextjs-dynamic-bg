import styles from './ShapesBg.module.scss'
import { useWindowDimensions, WindowDimensions } from '@/utils/utils'

export class Colour {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString = (): string =>
    `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
}

export interface ShapesProps {
  numOfFiguresPerUnit?: number,
  avgAnimDuration?: number,
  shapeSize?: number,
  colour?: Colour,
}
const ShapesBg = ({
  numOfFiguresPerUnit = 45,
  avgAnimDuration = 15,
  shapeSize = 20,
  colour = new Colour(255, 255, 255, 1),
}: ShapesProps): JSX.Element =>
(
  <div className={styles.area}>
        <ul className={styles.list}>
          { new ShapesBuilder(numOfFiguresPerUnit, avgAnimDuration, shapeSize, colour, useWindowDimensions()).build() }
        </ul>
  </div>
)
export default ShapesBg;

class ShapesBuilder {
  unit: number = 1000; // In pixels
  avgAnimDuration: number;
  numOfFigures: number;
  dFactor: number;
  delay: number;

  circleDiameter: number = 0;
  triangleHalfWidth: number = 0;
  triangleHeight: number = 0;
  colour: string;

  _squareSize: number = 0;
  get squareSize() { return this._squareSize; }
  set squareSize(value: number) {
    this._squareSize = value;
    this.circleDiameter = 2 * value / Math.sqrt(Math.PI); // For cirle to have same area as square
    this.triangleHalfWidth = value / 1.5; // * 1 / Math.sqrt(Math.sqrt(3)); // Commented is for equilateral triangle to have same area as square but it visually looks better w/ 1.5
    this.triangleHeight = Math.sqrt(3) * this.triangleHalfWidth;
  }

  constructor(
    numOfFiguresPerUnit: number,
    avgAnimDuration: number,
    shapeSize: number,
    colour: Colour,
    { windowWidth }: WindowDimensions,
  ) {
    this.numOfFigures = numOfFiguresPerUnit * windowWidth / this.unit;
    this.avgAnimDuration = avgAnimDuration;
    this.squareSize = shapeSize;
    this.colour = colour.toString();
    this.dFactor = windowWidth / this.numOfFigures; // Distance between each figure
    this.delay = avgAnimDuration / this.numOfFigures * 1000; // In milliseconds
  }

  private configureShape = (style: any, i: number) => {
    switch (i % 3) {
      case 0: // Triangle
        style.width = `0`;
        style.height = `0`;
        style.borderLeft = `${this.triangleHalfWidth}px solid transparent`;
        style.borderRight = `${this.triangleHalfWidth}px solid transparent`;
        style.borderBottom = `${this.triangleHeight}px solid ${this.colour}`;
        style.backgroundColor = "transparent";
        break;
      case 1: // Square
        style.width = `${this.squareSize}px`;
        style.height = `${this.squareSize}px`;
        style.backgroundColor = this.colour;
        break;
      case 2: // Circle
        style.width = `${this.circleDiameter}px`;
        style.height = `${this.circleDiameter}px`;
        style.borderRadius = "50%";
        style.backgroundColor = this.colour;
        break;
    }
  }

  private randomIntInRange = (min: number, max: number): number => 
    Math.floor(min + Math.random() * (max - min + 1));

  private randomIntWithAvg = (avg: number): number => {
    const halfAvg = avg / 2;
    return this.randomIntInRange(avg - halfAvg, avg + halfAvg);
  }

  private randomPop = <T,>(arr: T[]): T => 
    arr.splice(Math.floor(Math.random() * arr.length), 1)[0];

  public build = (): JSX.Element[] => {
    const indexArr = Array.from({ length: this.numOfFigures }, (_, i) => i);
    return [...indexArr].map(i =>
      {
        const style: any = {
          animationDuration: `${this.randomIntWithAvg(this.avgAnimDuration)}s`,
          animationDelay: `${this.delay * this.randomPop(indexArr)}ms`,
          left: `${this.dFactor * i}px`,
        };
        
        this.configureShape(style, i);

        return <li key={i} style={style}/>
      }
    )
  }
}