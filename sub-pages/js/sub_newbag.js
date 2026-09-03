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

// 모바일에서만 카테고리 스와이프, 스크롤바, 키보드 이동을 사용합니다.
const categoryScrollbar = document.querySelector('.bag-category-scrollbar');
const categoryList = document.querySelector('.bag-category-list');
let categorySwiper = null;

function syncCategoryMousewheel() {
    if (!categorySwiper) return;

    // 카테고리가 모두 보이는 경우에는 페이지 휠 스크롤을 우선합니다.
    if (categorySwiper.isLocked) {
        categorySwiper.mousewheel.disable();
    } else {
        categorySwiper.mousewheel.enable();
    }
}

function updateCategoryScrollbarA11y() {
    if (!categorySwiper) return;

    categoryScrollbar.setAttribute('aria-valuenow', Math.round(categorySwiper.progress * 100));
    categoryScrollbar.setAttribute('aria-disabled', String(categorySwiper.isLocked));
}

categoryScrollbar.addEventListener('keydown', (event) => {
    if (!categorySwiper) return;

    if (event.key === 'Home') {
        categorySwiper.slideTo(0);
    } else if (event.key === 'End') {
        categorySwiper.slideTo(categorySwiper.slides.length - 1);
    } else {
        return;
    }

    event.preventDefault();
});

function createCategorySwiper() {
    categorySwiper = new Swiper('.bag-category-swiper', {
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
        },
    });

    categorySwiper.on('progress lock unlock', updateCategoryScrollbarA11y);
    categorySwiper.on('lock unlock breakpoint', syncCategoryMousewheel);
    categoryScrollbar.removeAttribute('aria-hidden');
    categoryScrollbar.tabIndex = 0;
    syncCategoryMousewheel();
    updateCategoryScrollbarA11y();
}

function destroyCategorySwiper() {
    if (categorySwiper) {
        categorySwiper.destroy(true, true);
        categorySwiper = null;
    }

    // Swiper가 남긴 위치값을 지워 CSS 중앙 정렬이 그대로 적용되게 한다.
    categoryList.removeAttribute('style');

    categoryScrollbar.setAttribute('aria-hidden', 'true');
    categoryScrollbar.setAttribute('aria-disabled', 'true');
    categoryScrollbar.setAttribute('aria-valuenow', '0');
    categoryScrollbar.tabIndex = -1;
}

function syncCategorySwiper() {
    // 790px 이상은 카테고리를 한 줄 중앙 정렬로 고정합니다.
    if (window.innerWidth >= 790) {
        destroyCategorySwiper();
        return;
    }

    if (!categorySwiper) createCategorySwiper();
}

window.addEventListener('resize', syncCategorySwiper);
syncCategorySwiper();

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
