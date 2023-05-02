import { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef, useState } from "react";

export type StrictGetServerSideProps<
  P,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>
) => Promise<GetServerSidePropsResult<P>>

export interface WindowDimensions {
  width: number;
  height: number;
}
export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => 
      setWindowDimensions(
        (): WindowDimensions => {
          const { innerWidth: wWidth, innerHeight: wHeight } = window;
          return { width: wWidth, height: wHeight };
        }
      );

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export interface MousePosition {
  x: number;
  y: number;
}
export const useMousePositionRef = () => {
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => 
      mousePosition.current =
        ((event): MousePosition => ({
          x: event.clientX,
          y: event.clientY
        }))(e);

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);
  
  return mousePosition;
};

// type Props = {
//   // Insert props and types
// }
// export const getServerSideProps: StrictGetServerSideProps<Props> =
//   async ({ query: { viewport } }) => {
//     return {
//       // redirect: {
//       //   statusCode: 308,
//       //   destination: ''
//       // }
//       props: {
//         // Define Props
//       }
//     }
//   }