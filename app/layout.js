'use client';

import '../styles/globals.css';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const RootLayout = ({ children }) => (
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://stijndv.com" />
      <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
    </head>
    <body>
      {children}
      <ProgressBar
        height="4px"
        color="#76ffff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </body>
  </html>
);

export default RootLayout;
