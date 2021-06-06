import { hot } from 'react-hot-loader/root';
import React, { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./components/index'));

const App = props => (
  <Suspense fallback={<div>⏳</div>}>
    <LazyComponent {...props} />
  </Suspense>
);

export default hot(App);
