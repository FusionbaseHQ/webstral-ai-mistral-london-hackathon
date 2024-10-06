import PropTypes from 'prop-types'
import Layout from '../components/Layout'
import dynamic from 'next/dynamic'
import '../styles/globals.css'
import { Fragment } from 'react';

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar");
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }) {

  return (
    <Fragment>
      <Layout>
        <TopProgressBar />
        <Component {...pageProps} />
      </Layout>
      <div id="portal" style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999 }} />
    </Fragment>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default MyApp
