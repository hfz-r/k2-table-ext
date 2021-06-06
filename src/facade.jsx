import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

export default class Widget {
  static el;

  static mount({ parentElement = null, ...options } = {}) {
    function doRender() {
      if (Widget.el) {
        throw new Error('Widget is already mounted, unmount first');
      }

      // create element or hook at parent DOM
      const el = document.createElement('div');
      if (parentElement) {
        document.querySelector(parentElement).appendChild(el);
      } else {
        document.body.appendChild(el);
      }

      // create global element
      ReactDOM.createRoot(el).render(<App {...options} />);
      Widget.el = el;
    }

    if (document.readyState === 'complete') {
      doRender();
    } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
  }

  static unmount() {
    if (!Widget.el) {
      throw new Error('Widget is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(Widget.el);
    Widget.el.parentNode.removeChild(Widget.el);
    Widget.el = null;
  }
}
