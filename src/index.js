import 'utils/polyfill';
import 'utils/scroll';

class App {
  constructor() {
    this.url = window.location.pathname;
  }
}

// eslint-disable-next-line no-new
new App();
