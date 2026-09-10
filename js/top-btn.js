// 최상단 이동(TOP) 버튼
document.addEventListener("DOMContentLoaded", () => {
  // 버튼이 보이기 시작하는 스크롤 위치(px)
  const SHOW_AT = 300;

  const topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "top-btn";
  topBtn.setAttribute("aria-label", "맨 위로 이동");
  topBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

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
