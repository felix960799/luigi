import { useEffect } from 'react';
import Head from 'next/head';
// import { addInitListener } from '@luigi-project/client';

function Home() {
  useEffect(() => {
    if (typeof self !== 'undefined') {
      // Your code that relies on self here
      const LuigiClient = require('@luigi-project/client');
      LuigiClient.addInitListener(function(context) {
        console.log('Luigi Client initialised in Home');
      });
    }
  }, []);

  return (
    <>
      <Head />
      <div>
        <h1>Welcome to Luigi with Next.js</h1>
      </div>
    </>
  );
}

export default Home;
