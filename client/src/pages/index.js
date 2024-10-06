import { React } from 'react'
import Container from '../components/Layout/Container';
import Head from 'next/head';
import WebAI from '../components/WebAI';

export default function Home() {

  return (
    <>
      <Head>
        <title>Webstral AI</title>
        <meta name="description" content="One AI to get you everything you ever wanted from the web as a structured JSON API." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className='h-full'>
        <WebAI />
      </Container>
    </>

  )
}
