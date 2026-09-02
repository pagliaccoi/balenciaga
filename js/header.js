
document.addEventListener("DOMContentLoaded", () => {
  const mainMenuLis = document.querySelectorAll(".main-menu > li");
  const header = document.querySelector("header");
  const subBg = document.querySelector(".sub-bg");
  const allSubWraps = document.querySelectorAll(".sub-menu-wrap");

  mainMenuLis.forEach((li) => {
    const subWrap = li.querySelector(".sub-menu-wrap");

    li.addEventListener("mouseenter", () => {
      // 1. 모든 서브메뉴 닫기 (클래스 제거)
      allSubWraps.forEach((wrap) => {
        wrap.classList.remove("is-active");
      });

      // 2. 현재 호버한 메뉴에 서브메뉴가 있는 경우에만 배경과 서브메뉴 열기
      if (subWrap) {
        subBg.classList.add("is-active"); // 배경 슬라이드 열림
        subWrap.classList.add("is-active"); // 서브메뉴 열림
      } else {
        // '고객서비스'처럼 서브메뉴가 없는 메뉴에 마우스 올리면 배경 닫기
        subBg.classList.remove("is-active");
      }
    });
  });

  // 헤더 전체 영역을 벗어났을 때 모두 닫기
  header.addEventListener("mouseleave", () => {
    subBg.classList.remove("is-active"); // 배경 닫힘

    allSubWraps.forEach((wrap) => {
      wrap.classList.remove("is-active");
    });
  });
});

// 햄버거메뉴
document.addEventListener("DOMContentLoaded", () => {
  const hamBtn = document.querySelector(".ham-btn");
  const gnbMenu = document.querySelector(".gnb-menu");
  const closeBtn = document.querySelector(".m-close-btn");

  // 1. 햄버거 버튼 클릭 시 모바일 메뉴 열기
  if (hamBtn && gnbMenu) {
    hamBtn.addEventListener("click", (e) => {
      e.preventDefault();
      gnbMenu.classList.add("is-active");
    });
  }

  // 2. 닫기 버튼 클릭 시 모바일 메뉴 닫기
  if (closeBtn && gnbMenu) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      gnbMenu.classList.remove("is-active");
    });
  }
});
