import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import styles from './index.module.scss'
import ShapesBg, { Colour } from '@/utils/ShapesBg/WithCanvas/ShapesBg'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>17β-Estradiol - Letícia</title>
        <meta name="description" content="Now testing the background" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ShapesBg colour={ new Colour(127, 0, 255, 0.85) }/>
        <ShapesBg colour={ new Colour(220, 20, 60, 0.85) } />
        <div className={styles.context}>
          <h1>17β-Estradiol</h1>
        </div>
      </main>
    </>
  )
}
export default Home;