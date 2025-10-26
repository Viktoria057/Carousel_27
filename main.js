const container = document.querySelector('#carousel')
const slidesContainer = container.querySelector('#slides-container')
const slides = container.querySelectorAll('.slide')
const indicators = container.querySelectorAll('.indicator')
const indicatorContainer = container.querySelector('#indicators-container')
const pauseBtn = container.querySelector('#pause-btn')
const previousBtn = container.querySelector('#previous-btn')
const nextBtn = container.querySelector('#next-btn')

const SLIDES_COUNT = slides.length
const CODE_ARROW_LEFT = 'ArrowLeft'
const CODE_ARROW_RIGHT = 'ArrowRight'
const CODE_SPACE = 'Space'
const TIMER_INTERVAL = 2000
const SWIPE_THRESHOLD = 100

let currentSlide = 0
let timerId = null
let isPlaying = true
let swipeStartX = null
let swipeEndX = null

function gotoNth(n) {
  slides[currentSlide].classList.toggle('active')
  indicators[currentSlide].classList.toggle('active')
  currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT
  slides[currentSlide].classList.toggle('active')
  indicators[currentSlide].classList.toggle('active')
}

function gotoPrev() { 
  gotoNth(currentSlide - 1) 
}

function gotoNext() {
   gotoNth(currentSlide + 1) 
  }

function tick() { timerId = setInterval(gotoNext, TIMER_INTERVAL) }

function pauseHandler() {
  if (!isPlaying) return
  clearInterval(timerId)
  isPlaying = false;
  pauseBtn.innerHTML = 'Play'
}

function playHandler() {
  if (isPlaying) return
  isPlaying = true
  pauseBtn.innerHTML = 'Pause'
  tick();
}

function togglePlayHandler() {
  isPlaying ? pauseHandler() : playHandler()
}

function nextHandler() {
  gotoNext()
  pauseHandler()
}

function prevHandler() {
  gotoPrev()
  pauseHandler()
}

function indicatorClickHandler(e) {
  const { target } = e
  if (target && target.classList.contains('indicator')) {
    pauseHandler()
    gotoNth(+target.dataset.slideTo)
  }
}

function keydownHandler(e) {
  const code = e.code

  if (code === CODE_ARROW_LEFT) prevHandler()
  if (code === CODE_ARROW_RIGHT) nextHandler()
  if (code === CODE_SPACE) {
    e.preventDefault()
    togglePlayHandler()
  }
}

function swipeStartHandler(e) {
  swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
}

function swipeEndHandler(e) {
  swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX

  const diff = swipeEndX - swipeStartX

  if (diff > SWIPE_THRESHOLD) prevHandler()
  if (diff < -SWIPE_THRESHOLD) nextHandler()
}


function initEventListeners() {
  pauseBtn.addEventListener('click', togglePlayHandler)
  previousBtn.addEventListener('click', prevHandler)
  nextBtn.addEventListener('click', nextHandler)
  indicatorContainer.addEventListener('click', indicatorClickHandler)
  document.addEventListener('keydown', keydownHandler)
  slidesContainer.addEventListener('touchstart', swipeStartHandler, { passive: true })
  slidesContainer.addEventListener('mousedown', swipeStartHandler)
  slidesContainer.addEventListener('touchend', swipeEndHandler)
  slidesContainer.addEventListener('mouseup', swipeEndHandler)
 
}

function init() {
  initEventListeners()
  tick()
}

init()

