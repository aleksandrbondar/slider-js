
const options = {
  containerIdName: '#carousel',
  slidesClassName: '.slide',

  isAutoplayCarousel: true,
  AutoplayInterval: 2000,
  isControlButtonsEnabled: true,
  isIndicatorsEnabled: true,
  isPauseAfterAction: true,

  iconPause: '<img src="https://smash-cs.ru/uploads/posts/2017-12/4506.jpg" alt="">',
  // iconPlay: 'fas fa-play',
  // iconPrev: 'fas fa-angle-left',
  // iconNext: '<img src="https://img.freepik.com/premium-photo/red-arrow-isolated-with-white-background_698953-6319.jpg" alt="">',
  // iconDownload: 'fas fa-download'

  userStyles: {
    // for carousel container style
    'carousel': '',

    // for slides container style
    'slides': '',

    // for indicator style
    'indicators': '',
    'indicator': 'background-color: red; border-color: yellow; border-radius: 0; opacity: 1;',

    // for control buttons style
    'controls': '',
    'control': '',

    // loading screen style
    'loading-screen': 'background-color: red;'
  }
};

function createCarousel(options) {
  try {
    const carousel = new SwipeCarousel(options);
    console.log('SwipeCarousel available.');
    return carousel;
  } catch (error) {
    console.log('SwipeCarousel not available. Falling back to Carousel.');
    return new Carousel(options);
  }
}

const carousel = createCarousel(options);
carousel.initCarousel();