// 최상단 이동(TOP) 버튼
// 아이콘 경로를 이 스크립트 위치 기준으로 계산해서 메인/서브페이지 모두에서 동작
const TOP_BTN_ICON = new URL(
  "/images/icon/icon_arrow.svg",
  document.currentScript.src
).href;

document.addEventListener("DOMContentLoaded", () => {
  // 버튼이 보이기 시작하는 스크롤 위치(px)
  const SHOW_AT = 300;

  const topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "top-btn";
  topBtn.setAttribute("aria-label", "맨 위로 이동");
  topBtn.innerHTML = `<img src="${TOP_BTN_ICON}" alt="">`;

  document.body.appendChild(topBtn);

  // 스크롤 위치에 따라 버튼 보이기/숨기기
  const toggleTopBtn = () => {
    topBtn.classList.toggle("is-active", window.scrollY > SHOW_AT);
  };

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleTopBtn, { passive: true });
  toggleTopBtn();
});
