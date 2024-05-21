function Carousel(options = {}) {
  const {
    containerIdName = '#carousel',
    slidesClassName = '.slide',

    isAutoplayCarousel = true,
    AutoplayInterval = 10000,
    isControlButtonsEnabled = true,
    isIndicatorsEnabled = true,
    isPauseAfterAction = false,

    iconPause = '<i class="fas fa-pause" id="pause-btn"></i>',
    iconPlay = '<i class="fas fa-play" id="play-btn"></i>',
    iconPrev = '<i class="fas fa-angle-left" id="prev-btn"></i>',
    iconNext = '<i class="fas fa-angle-right" id="next-btn"></i>',
    iconDownload = '<i class="fa-solid fa-spinner"></i>',

    userStyles = {},
  } = options;

  this.container = document.querySelector(containerIdName);
  this.slides = this.container.querySelectorAll(slidesClassName);

  this.autoplay = isAutoplayCarousel;
  this.interval = AutoplayInterval;
  this.isControlEnabled = isControlButtonsEnabled;
  this.isIndicatorEnabled = isIndicatorsEnabled;
  this.pauseAfterAction = isPauseAfterAction;

  this.FA_PAUSE = iconPause;
  this.FA_PLAY = iconPlay;
  this.FA_PREV = iconPrev;
  this.FA_NEXT = iconNext;
  this.FA_DOWNLOAD = iconDownload;

  const iconCLass = icon => icon.match(/\bclass=["']([^"']+)["']/)?.[1] ?? '';
  this.FA_PAUSE_CLASS = iconCLass(this.FA_PAUSE);
  this.FA_PLAY_CLASS = iconCLass(this.FA_PLAY);

  this.userStyles = userStyles;
}


Carousel.prototype = {
  _initControls() {
    const controls = document.createElement('div')
    controls.setAttribute('class', 'controls')
    controls.setAttribute('id', 'controls-container')

    const PLAY = `<span class="control control-pause" id="pause-btn">${this.FA_PLAY}</span>`    // добавил в спаны ID
    const PAUSE = `<span class="control control-pause" id="pause-btn">${this.FA_PAUSE}</span>`
    const PREV = `<span class="control control-prev" id="prev-btn">${this.FA_PREV}</span>`
    const NEXT = `<span class="control control-next" id="next-btn">${this.FA_NEXT}</span>`

    controls.innerHTML = PREV + (!this.autoplay ? PLAY : PAUSE) + NEXT;
    this.container.append(controls)
  },

  _initIndicators() {
    const indicators = document.createElement('div')

    indicators.setAttribute('class', 'indicators')
    indicators.setAttribute('id', 'indicators-container')
    this.container.append(indicators)

    this.slides.forEach((item, index) => {
      const indicator = `<div class="indicator" data-index="${index}"></div>`
      indicators.innerHTML += indicator
    })
  },


  _initProps() {
    if (this.isControlEnabled) {
      this.pauseBtn = this.container.querySelector('#pause-btn') ?? this.container.querySelector('.control-pause').childNodes[0]
      this.prevBtn = this.container.querySelector('#prev-btn') ?? this.container.querySelector('.control-prev').childNodes[0]
      this.nextBtn = this.container.querySelector('#next-btn') ?? this.container.querySelector('.control-next').childNodes[0]
    }
    if (this.isIndicatorEnabled) {
      this.indicatorsContainer = this.container.querySelector('#indicators-container')
      this.indicatorItems = this.indicatorsContainer.querySelectorAll('.indicator').length === 0 ? this.container.querySelector('#indicators-container').childNodes : this.indicatorsContainer.querySelectorAll('.indicator')
    }

    this.SLIDES_COUNT = this.slides.length
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'

    this.currentSlide = 0
    this.isPlaying = this.autoplay
  },

  _initListeners() {
    if (this.isControlEnabled) {
      this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this))
      this.nextBtn.addEventListener('click', this.nextHandler.bind(this))
      this.prevBtn.addEventListener('click', this.prevHandler.bind(this))
    }
    if (this.isIndicatorEnabled) {
      this.indicatorsContainer.addEventListener('click', this._indicateHandler.bind(this))
    }
    document.addEventListener('keydown', this._pressKey.bind(this))
  },

  _initUserClasses() {
    Object.keys(this.userStyles).forEach(key => {
      const element = key === 'carousel' ? [this.container] : this.container.querySelectorAll(`.${key}`)
      element.forEach(item => item.setAttribute('style', this.userStyles[key]))
    })
  },

  _initFirstSlide() {
    this.slides[this.currentSlide].classList.toggle('slide--active')
    !this.isIndicatorEnabled || this.indicatorItems[this.currentSlide].classList.toggle('indicator--active')
  },

  _indicateHandler(e) {
    const { target } = e
    if (target.classList.contains('indicator')) {
      this.pauseHandler()
      this.gotoNth(+target.dataset.index)
    }
  },

  _pressKey(e) {
    const { code } = e

    if (code === this.CODE_ARROW_LEFT) this.prevHandler()
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler()
    if (code === this.CODE_SPACE) { this.pausePlayHandler(), e.preventDefault() }
  },

  _tick() {
    this.timerId = setInterval(() => this.gotoNext(), this.interval)
  },

  gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('slide--active')
    !this.isIndicatorEnabled || this.indicatorItems[this.currentSlide].classList.toggle('indicator--active')
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
    this.slides[this.currentSlide].classList.toggle('slide--active')
    !this.isIndicatorEnabled || this.indicatorItems[this.currentSlide].classList.toggle('indicator--active')
  },

  gotoNext() {
    this.gotoNth(this.currentSlide + 1)
  },

  gotoPrev() {
    this.gotoNth(this.currentSlide - 1)
  },

  pauseHandler() {
    this.isPlaying = false
    clearInterval(this.timerId)
    // !this.isControlEnabled || (this.pauseBtn.className = this.FA_PLAY_CLASS)
    !this.isControlEnabled || (this.container.querySelector('.control-pause').innerHTML = this.FA_PLAY)
  },

  playHandler() {
    this.isPlaying = true
    // !this.isControlEnabled || (this.pauseBtn.className = this.FA_PAUSE_CLASS)
    !this.isControlEnabled || (this.container.querySelector('.control-pause').innerHTML = this.FA_PAUSE)
    this._tick()
  },

  pausePlayHandler() {
    this.isPlaying ? this.pauseHandler() : this.playHandler()
  },

  nextHandler() {
    !this.pauseAfterAction || this.pauseHandler()
    this.gotoNext()
  },

  prevHandler() {
    !this.pauseAfterAction || this.pauseHandler()
    this.gotoPrev()
  },


  hideLoadingScreen() {
    this.container.classList.toggle('carousel--loading')
    setTimeout(() => this.container.querySelector('#loading-screen').remove(), 1000)
    window.removeEventListener('load', this.hideLoadingScreen.bind(this))
  },

  initLoadingScreen() {
    this.container.classList.toggle('carousel--loading')
    this.container.insertAdjacentHTML('beforeend', `<div class="loading-screen" id="loading-screen">${this.FA_DOWNLOAD ?? ''}</div>`);

    window.addEventListener('load', this.hideLoadingScreen.bind(this))
  },

  initCarousel() {
    this.initLoadingScreen()
    !this.isControlEnabled || this._initControls()
    !this.isIndicatorEnabled || this._initIndicators()
    this._initProps()
    this._initListeners()
    this._initUserClasses()
    this._initFirstSlide()
    !this.autoplay || this._tick()
  }
}

Carousel.prototype.constructor = Carousel;