(function () {
  const container = document.querySelector('#carousel')
  const slides = container.querySelectorAll('.slide')
  const indicatorsContainer = container.querySelector('#indicators-container')
  const indicatorItems = indicatorsContainer.querySelectorAll('.indicator')
  const pauseBtn = container.querySelector('#pause-btn')
  const prevBtn = container.querySelector('#prev-btn')
  const nextBtn = container.querySelector('#next-btn')

  const SLIDES_COUNT = slides.length
  const CODE_ARROW_LEFT = 'ArrowLeft'
  const CODE_ARROW_RIGHT = 'ArrowRight'
  const CODE_SPACE = 'Space'
  const FA_PAUSE = '<i class="fas fa-pause"></i>'
  const FA_PLAY = '<i class="fas fa-play"></i>'
  const INTERVAL = 2000

  let currentSlide = 0
  let isPlaying = true
  let timerId = null
  let startPosX = null
  let endPosX = null

  function gotoNth(n) {
    slides[currentSlide].classList.toggle('active')
    indicatorItems[currentSlide].classList.toggle('indicator--active')
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT
    slides[currentSlide].classList.toggle('active')
    indicatorItems[currentSlide].classList.toggle('indicator--active')
  }

  function gotoNext() {
    gotoNth(currentSlide + 1)
  }

  function gotoPrev() {
    gotoNth(currentSlide - 1)
  }

  function pauseHandler() {
    isPlaying = false
    clearInterval(timerId)
    pauseBtn.innerHTML = FA_PLAY
  }

  function tick() {
    timerId = setInterval(gotoNext, INTERVAL)
  }

  function playHandler() {
    isPlaying = true
    pauseBtn.innerHTML = FA_PAUSE
    tick()
  }

  function pausePlayHandler() {
    isPlaying ? pauseHandler() : playHandler()
  }

  function nextHandler() {
    pauseHandler()
    gotoNext()
  }

  function prevHandler() {
    pauseHandler()
    gotoPrev()
  }

  function indicateHandler(e) {
    const { target } = e
    if (target.classList.contains('indicator')) {
      pauseHandler()
      gotoNth(+target.dataset.slideTo)
    }
  }

  function pressKey(e) {
    const { code } = e

    if (code === CODE_ARROW_LEFT) prevHandler()
    if (code === CODE_ARROW_RIGHT) nextHandler()
    if (code === CODE_SPACE) pausePlayHandler()
  }

  function swipeStartHandler(e) {
    startPosX = e instanceof MouseEvent
      ? e.pageX // MouseEvent
      : e.changedTouches[0].pageX // TouchEvent
  }

  function swipeEndHandler(e) {
    endPosX = e instanceof MouseEvent
      ? e.pageX // MouseEvent
      : e.changedTouches[0].pageX // TouchEvent

    if (endPosX - startPosX > 100) prevHandler()
    if (endPosX - startPosX < -100) nextHandler()
  }

  function initListeners() {
    pauseBtn.addEventListener('click', pausePlayHandler)
    nextBtn.addEventListener('click', nextHandler)
    prevBtn.addEventListener('click', prevHandler)
    indicatorsContainer.addEventListener('click', indicateHandler)
    container.addEventListener('touchstart', swipeStartHandler)
    container.addEventListener('mousedown', swipeStartHandler)
    container.addEventListener('touchend', swipeEndHandler)
    container.addEventListener('mouseup', swipeEndHandler)
    document.addEventListener('keydown', pressKey)
  }

  function init() {
    initListeners()
    tick()
  }

  init()
}())