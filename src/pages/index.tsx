import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import styles from './index.module.scss'
import ShapesBg, { Colour } from '@/utils/shapesBg/shapesBg'
import { useWindowDimensions, useWindowWidth } from '@/utils/utils'

const Home: NextPage = () => {
  const test = useWindowDimensions();
  const test0 = useWindowWidth();

  return (
    <>
      <Head>
        <title>17β-Estradiol - Letícia</title>
        <meta name="description" content="Now testing the background" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        { ShapesBg(45, 15, 20, new Colour(127, 0, 255, 0.75)) }
        { ShapesBg(45, 15, 20, new Colour(220, 20, 60, 0.75)) }
        <div className={styles.context}>
          <h1>17β-Estradiol</h1>
          <h1>Width: { test0 }</h1>
          <h1>Width and height: { test.windowWidth } { test.windowHeight }</h1>
        </div>
      </main>
    </>
  )
}
export default Home;