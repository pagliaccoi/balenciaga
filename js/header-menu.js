function initializeHeaderMenu() {
    const mainMenuLis = document.querySelectorAll('.main-menu > li');
    const header = document.querySelector('header');
    const subBg = document.querySelector('.sub-bg');
    const allSubWraps = document.querySelectorAll('.sub-menu-wrap');

    if (!header || !subBg) return;

    mainMenuLis.forEach((menuItem) => {
        const subWrap = menuItem.querySelector('.sub-menu-wrap');

        menuItem.addEventListener('mouseenter', () => {
            allSubWraps.forEach((wrap) => {
                wrap.classList.remove('is-active');
            });

            if (subWrap) {
                subBg.classList.add('is-active');
                subWrap.classList.add('is-active');
            } else {
                subBg.classList.remove('is-active');
            }
        });
    });

    header.addEventListener('mouseleave', () => {
        subBg.classList.remove('is-active');
        allSubWraps.forEach((wrap) => {
            wrap.classList.remove('is-active');
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaderMenu);
} else {
    initializeHeaderMenu();
}
