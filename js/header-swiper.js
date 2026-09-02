const headerSwiperElement = document.querySelector('.headerSwiper');

if (headerSwiperElement) {
    new Swiper(headerSwiperElement, {
        loop: true,
        spaceBetween: 0,
        centeredSlides: false,
        a11y: false,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });
}
