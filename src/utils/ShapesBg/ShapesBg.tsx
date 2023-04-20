import styles from './ShapesBg.module.scss'
import { useWindowDimensions } from '@/utils/utils'

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
}: ShapesProps): JSX.Element => {
  const unitSize = 1000; // In pixels
  const { width } = useWindowDimensions();

  const numOfFigures = numOfFiguresPerUnit * width / unitSize;
  const dFactor = width / numOfFigures; // Distance between each figure
  const delay = 1000 * avgAnimDuration / numOfFigures; // In milliseconds

  const colourAsStr = colour.toString();
  const circleDiameter = 2 * shapeSize / Math.sqrt(Math.PI); // For cirle to have same area as square
  const triangleHalfWidth = shapeSize / 1.5; // * 1 / Math.sqrt(Math.sqrt(3)); // Commented is for equilateral triangle to have same area as square but it visually looks better w/ 1.5
  const triangleHeight = Math.sqrt(3) * triangleHalfWidth;

  const indexArr = Array.from({ length: numOfFigures }, (_, i) => i);
  const listItems = [...indexArr].map(i =>
    {
      const style: any = {
        animationDuration: `${randomIntWithAvg(avgAnimDuration)}s`,
        animationDelay: `${delay * randomPop(indexArr)}ms`,
        left: `${dFactor * i}px`,
      };
      
      switch (i % 3) {
        case 0: // Triangle
          style.width = `0`;
          style.height = `0`;
          style.borderLeft = `${triangleHalfWidth}px solid transparent`;
          style.borderRight = `${triangleHalfWidth}px solid transparent`;
          style.borderBottom = `${triangleHeight}px solid ${colourAsStr}`;
          style.backgroundColor = "transparent";
          break;
        case 1: // Square
          style.width = `${shapeSize}px`;
          style.height = `${shapeSize}px`;
          style.backgroundColor = colourAsStr;
          break;
        case 2: // Circle
          style.width = `${circleDiameter}px`;
          style.height = `${circleDiameter}px`;
          style.borderRadius = "50%";
          style.backgroundColor = colourAsStr;
          break;
      }

      return <li key={i} style={style}/>;
    }
  );

  return (
    <div className={styles.area}>
          <ul className={styles.list}>
            { listItems }
          </ul>
    </div>
  )
};
export default ShapesBg;

const randomIntInRange = (min: number, max: number): number => 
  Math.floor(min + Math.random() * (max - min + 1));

const randomIntWithAvg = (avg: number): number => {
  const halfAvg = avg / 2;
  return randomIntInRange(avg - halfAvg, avg + halfAvg);
};

const randomPop = <T,>(arr: T[]): T => 
  arr.splice(Math.floor(Math.random() * arr.length), 1)[0];