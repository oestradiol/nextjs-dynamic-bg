import { GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useState } from "react";

export type StrictGetServerSideProps<
  P,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>
) => Promise<GetServerSidePropsResult<P>>

export interface WindowDimensions {
  windowWidth: number;
  windowHeight: number;
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    windowWidth: 0,
    windowHeight: 0,
  });

  useEffect(() => {
    const handleResize = () => setWindowDimensions(
      ((): WindowDimensions => {
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        return { windowWidth, windowHeight };
      })()
    );

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(
      ((): WindowDimensions => {
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
        return { windowWidth, windowHeight };
      })().windowWidth
    );

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
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