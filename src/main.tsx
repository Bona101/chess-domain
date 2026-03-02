import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google' // for google oauth


// 1. Import the "map" that the plugin built for you
import { routeTree } from './routeTree.gen'

// 2. Create the router engine using that map
const router = createRouter({ routeTree })

// 3. Register the router for TypeScript (so it knows your routes are valid)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* 4. Provide the router to your whole app */}
       <RouterProvider router={router} />
   </GoogleOAuthProvider>
  </React.StrictMode>,
)







/*
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
    <App />
  </GoogleOAuthProvider>
);











import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google' // 1. Import this

import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  //   {/* 2. Wrap the RouterProvider here *///}
  //   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  //     <RouterProvider router={router} />
  //   </GoogleOAuthProvider>
  // </React.StrictMode>,
// )
// */