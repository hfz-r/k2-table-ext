import React, { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./components/Main"));

const App = (props) => (
  <Suspense fallback={<div>⏳</div>}>
    <LazyComponent {...props} />
  </Suspense>
);

export default App;
