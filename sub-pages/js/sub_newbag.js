function syncVisualHeight() {
    const list = document.querySelector('.bag-product-list');
    if (!list) return;

    const normalItem = list.querySelector('.bag-product-item:not(.bag-product-item--visual)');
    const tallImage = list.querySelector('.bag-product-item--tall .bag-product-image');
    if (!normalItem || !tallImage) return;

    if (window.innerWidth <= 789) {
        tallImage.style.height = '';
        return;
    }

    const normalImage = normalItem.querySelector('.bag-product-image');
    const normalInfo = normalItem.querySelector('.bag-product-info');
    if (!normalImage || !normalInfo) return;

    const rowGap = parseFloat(getComputedStyle(list).rowGap) || 0;
    const imageHeight = normalImage.offsetHeight;
    const infoHeight = normalInfo.offsetHeight;

    tallImage.style.height = `${imageHeight + infoHeight + rowGap + imageHeight}px`;
}

syncVisualHeight();
window.addEventListener('resize', syncVisualHeight);

// 카테고리 스와이프, 스크롤바, 키보드 이동을 제어합니다.
const categorySwiper = new Swiper('.bag-category-swiper', {
    slidesPerView: 'auto',
    centerInsufficientSlides: true,
    grabCursor: true,
    watchOverflow: true,
    freeMode: true,
    scrollbar: {
        el: '.bag-category-scrollbar',
        draggable: true,
        snapOnRelease: false,
    },
    mousewheel: {
        forceToAxis: false,
        releaseOnEdges: true,
    },
    keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: false,
    },
    breakpoints: {
        0: {
            spaceBetween: 12,
            slidesOffsetBefore: 12,
            slidesOffsetAfter: 12,
        },
        790: {
            spaceBetween: 16,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
        },
        1281: {
            spaceBetween: 20,
            slidesOffsetBefore: 40,
            slidesOffsetAfter: 40,
        },
    },
});

const categoryScrollbar = document.querySelector('.bag-category-scrollbar');

// 카테고리가 모두 보이는 화면에서는 페이지 휠 스크롤을 우선합니다.
function syncCategoryMousewheel() {
    if (window.innerWidth >= 790 || categorySwiper.isLocked) {
        categorySwiper.mousewheel.disable();
    } else {
        categorySwiper.mousewheel.enable();
    }
}

function updateCategoryScrollbarA11y() {
    categoryScrollbar.setAttribute('aria-valuenow', Math.round(categorySwiper.progress * 100));
    categoryScrollbar.setAttribute('aria-disabled', String(categorySwiper.isLocked));
}

categoryScrollbar.addEventListener('keydown', (event) => {
    if (event.key === 'Home') {
        categorySwiper.slideTo(0);
    } else if (event.key === 'End') {
        categorySwiper.slideTo(categorySwiper.slides.length - 1);
    } else {
        return;
    }

    event.preventDefault();
});

categorySwiper.on('progress lock unlock', updateCategoryScrollbarA11y);
categorySwiper.on('lock unlock breakpoint', syncCategoryMousewheel);
syncCategoryMousewheel();
updateCategoryScrollbarA11y();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches) {
    const revealSelectors = [
        '.bag-category-heading',
        '.bag-category-item',
        '.bag-product-item',
    ];

    const revealItems = revealSelectors.flatMap((selector) => (
        [...document.querySelectorAll(selector)].map((item) => {
            item.classList.add('bag-reveal');
            return item;
        })
    ));

    document.documentElement.classList.add('motion-ready');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.01,
            rootMargin: '0px 0px -4%',
        });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }
}
