document.addEventListener("DOMContentLoaded", () => {
    
    // 기준이 되는 모바일 최대 너비 (CSS 미디어쿼리 기준과 일치시킴)
    const MOBILE_WIDTH = 789;

    // 1. 스크롤 프로그레스 바 (모바일/PC 공통으로 둘지, PC에서만 둘지 결정 가능 - 여기선 공통 유지하되 안전성 확보)
    let progressBar = document.querySelector(".magazine-progress-bar");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.className = "magazine-progress-bar";
        document.body.prepend(progressBar);

        Object.assign(progressBar.style, {
            position: "fixed",
            top: "0",
            left: "0",
            height: "3px",
            backgroundColor: "var(--impact-color, #CCFB55)",
            width: "0%",
            zIndex: "9999",
            transition: "width 0.1s ease-out"
        });
    }

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }
    });


    // 2. Intersection Observer (페이드인 효과)
    // 모바일에서는 CSS 애니메이션이나 기본 스크롤로 대체하고 싶다면 창 너비 체크 추가 가능
    const fadeElements = document.querySelectorAll('.campaign-section, .campaign-top-hero, .quote-box');
    
    if (fadeElements.length > 0) {
        fadeElements.forEach(el => {
            // 모바일이 아닐 때만 초기 스타일 적용 (모바일 가독성 및 성능 보호)
            if (window.innerWidth > MOBILE_WIDTH) {
                el.style.opacity = "0";
                el.style.transform = "translateY(40px)";
                el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            }
        });

        if (window.innerWidth > MOBILE_WIDTH) {
            const observerOptions = { root: null, threshold: 0.15 };
            const fadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            fadeElements.forEach(el => fadeObserver.observe(el));
        }
    }


    // 3. 히어로 이미지 패럴랙스 효과 (오직 데스크톱에서만 작동하도록 철저히 분기 처리)
    const heroImg = document.querySelector('.hero-bg-img img');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            // 핵심: 모바일 해상도(789px 이하)이거나 화면 가로 줄어듦 감지 시 패럴랙스 연산 차단
            if (window.innerWidth <= MOBILE_WIDTH) {
                // 모바일에서는 스타일 강제 초기화 (밀림 현상 방지)
                heroImg.style.transform = 'none';
                return; 
            }

            const scrollY = window.scrollY;
            // 데스크톱에서만 부드러운 패럴랙스 적용
            heroImg.style.transform = `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0002})`;
        });
    }

});