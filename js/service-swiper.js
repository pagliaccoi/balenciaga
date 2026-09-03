const serviceSwiperElement = document.querySelector('.service-swiper');
const serviceTabletQuery = window.matchMedia('(max-width: 1280px)');
let serviceSwiper;

function updateServiceSwiper() {
    if (!serviceSwiperElement) return;

    // 태블릿·모바일에서는 가로 스와이프를 사용한다.
    if (serviceTabletQuery.matches && !serviceSwiper) {
        serviceSwiper = new Swiper(serviceSwiperElement, {
            slidesPerView: 1.15,
            spaceBetween: 16,
            slidesOffsetBefore: 10,
            slidesOffsetAfter: 10,
            grabCursor: true,
            watchOverflow: true,
            breakpoints: {
                481: {
                    slidesPerView: 1.15,
                    spaceBetween: 16,
                    slidesOffsetBefore: 12,
                    slidesOffsetAfter: 12,
                },
                768: {
                    slidesPerView: 2.2,
                    spaceBetween: 20,
                    slidesOffsetBefore: 12,
                    slidesOffsetAfter: 12,
                },
                790: {
                    slidesPerView: 2.2,
                    spaceBetween: 20,
                    slidesOffsetBefore: 40,
                    slidesOffsetAfter: 40,
                },
            },
        });
        return;
    }

    // PC에서는 Swiper를 제거해 고정 3열 배치를 유지한다.
    if (!serviceTabletQuery.matches && serviceSwiper) {
        serviceSwiper.destroy(true, true);
        serviceSwiper = undefined;
    }
}

updateServiceSwiper();
serviceTabletQuery.addEventListener('change', updateServiceSwiper);
