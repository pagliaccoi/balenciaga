// 필터 및 정렬 슬라이드 아코디언 JS

function initCategoryScrollbar() {
  const list = document.querySelector(".shop-category-list");
  const scrollbar = document.querySelector(".shop-category-scrollbar");
  const thumb = document.querySelector(".shop-category-scrollbar-thumb");

  if (!list || !scrollbar || !thumb) return;

  let dragState = null;

  function updateScrollbar() {
    const maxScroll = list.scrollWidth - list.clientWidth;
    const isScrollable = maxScroll > 0;

    scrollbar.classList.toggle("is-scrollable", isScrollable);

    if (!isScrollable) return;

    const trackWidth = scrollbar.clientWidth;

    const thumbWidth = Math.max(
      40,
      (list.clientWidth / list.scrollWidth) * trackWidth,
    );

    const maxThumbOffset = trackWidth - thumbWidth;

    const thumbOffset = maxThumbOffset * (list.scrollLeft / maxScroll);

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbOffset}px)`;

    scrollbar.setAttribute("aria-valuemax", Math.round(maxScroll));

    scrollbar.setAttribute("aria-valuenow", Math.round(list.scrollLeft));
  }

  function scrollFromPointer(clientX) {
    const maxScroll = list.scrollWidth - list.clientWidth;

    const trackRect = scrollbar.getBoundingClientRect();

    const thumbWidth = thumb.getBoundingClientRect().width;

    const maxThumbOffset = trackRect.width - thumbWidth;

    const pointerOffset = clientX - trackRect.left - thumbWidth / 2;

    const progress = Math.min(1, Math.max(0, pointerOffset / maxThumbOffset));

    list.scrollLeft = progress * maxScroll;
  }

  /* 스크롤바 클릭 / 드래그 시작 */
  scrollbar.addEventListener("pointerdown", (event) => {
    if (!scrollbar.classList.contains("is-scrollable")) {
      return;
    }

    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: list.scrollLeft,
      isThumb: event.target === thumb,
    };

    scrollbar.setPointerCapture(event.pointerId);

    /* 트랙을 직접 클릭한 경우 */
    if (!dragState.isThumb) {
      scrollFromPointer(event.clientX);
      dragState.startScroll = list.scrollLeft;
    }

    event.preventDefault();
  });

  /* 스크롤바 드래그 */
  scrollbar.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) {
      return;
    }

    if (dragState.isThumb) {
      const maxScroll = list.scrollWidth - list.clientWidth;

      const maxThumbOffset =
        scrollbar.clientWidth - thumb.getBoundingClientRect().width;

      const scrollDelta =
        (event.clientX - dragState.startX) * (maxScroll / maxThumbOffset);

      list.scrollLeft = dragState.startScroll + scrollDelta;
    } else {
      scrollFromPointer(event.clientX);
    }
  });

  /* 드래그 종료 */
  ["pointerup", "pointercancel"].forEach((eventName) => {
    scrollbar.addEventListener(eventName, () => {
      dragState = null;
    });
  });

  /* 키보드 조작 */
  scrollbar.addEventListener("keydown", (event) => {
    const step = list.clientWidth * 0.8;

    if (event.key === "ArrowRight") {
      list.scrollBy({
        left: step,
      });
    } else if (event.key === "ArrowLeft") {
      list.scrollBy({
        left: -step,
      });
    } else if (event.key === "Home") {
      list.scrollTo({
        left: 0,
      });
    } else if (event.key === "End") {
      list.scrollTo({
        left: list.scrollWidth,
      });
    } else {
      return;
    }

    event.preventDefault();
  });

  /* 마우스 휠 → 가로 스크롤 */
  list.addEventListener(
    "wheel",
    (event) => {
      const maxScroll = list.scrollWidth - list.clientWidth;

      if (maxScroll <= 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const nextScroll = Math.min(
        maxScroll,
        Math.max(0, list.scrollLeft + event.deltaY),
      );

      if (nextScroll === list.scrollLeft) {
        return;
      }

      event.preventDefault();

      list.scrollLeft = nextScroll;
    },
    {
      passive: false,
    },
  );

  /* 실제 카테고리 스크롤 감지 */
  list.addEventListener("scroll", updateScrollbar, {
    passive: true,
  });

  /* 화면 크기 변경 */
  window.addEventListener("resize", updateScrollbar);

  updateScrollbar();
}

initCategoryScrollbar();
document.addEventListener("DOMContentLoaded", () => {
  const triggerBtn = document.getElementById("filterTriggerBtn");
  const menuLayer = document.getElementById("filterMenuLayer");
  const closeBtn = document.getElementById("filterCloseBtn");
  const backdrop = document.getElementById("filterBackdrop");
  const applyBtn = document.getElementById("filterApplyBtn");
  const resetBtn = document.getElementById("filterResetBtn");
  const productListEl = document.getElementById("productList");
  const itemCountEl = document.getElementById("filterItemCount");

  if (!triggerBtn || !menuLayer || !productListEl) return;

  // 1. 드로어 열고 닫기 제어 함수
  function openDrawer() {
    menuLayer.classList.add("is-active");
    backdrop.classList.add("is-active");
    document.body.style.overflow = "hidden"; // 배경 스크롤 방지
  }

  function closeDrawer() {
    menuLayer.classList.remove("is-active");
    backdrop.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  triggerBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  // 2. 아코디언 메뉴 토글 기능
  const accordionHeaders = menuLayer.querySelectorAll(
    ".filter-accordion-header",
  );
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("is-open");
    });
  });

  // 3. 원본 상품 데이터 캐싱
  const originalItems = Array.from(productListEl.querySelectorAll("li")).map(
    (li) => {
      const isBanner =
        li.classList.contains("women-img1") ||
        li.classList.contains("women-img2") ||
        !li.querySelector(".product-price");
      const titleEl = li.querySelector(".product-title");
      const priceEl = li.querySelector(".product-price");

      return {
        element: li,
        title: titleEl ? titleEl.textContent.trim() : "",
        price: priceEl
          ? parseInt(priceEl.textContent.replace(/[^0-9]/g, ""), 10) || 0
          : 0,
        isBanner: isBanner,
      };
    },
  );

  let currentSort = "default";
  let currentPrice = "all";

  // 필터 조건에 따른 결과 미리 계산하는 함수 (개수 표시용)
  function getFilteredList() {
    let workingList = [...originalItems];
    const isDefaultView = currentSort === "default" && currentPrice === "all";

    if (!isDefaultView) {
      workingList = workingList.filter((item) => !item.isBanner);
    }

    if (currentPrice === "under2m") {
      workingList = workingList.filter(
        (item) => item.isBanner || item.price < 2000000,
      );
    } else if (currentPrice === "over4m") {
      workingList = workingList.filter(
        (item) => item.isBanner || item.price > 4000000,
      );
    }

    if (currentSort === "lowPrice") {
      workingList.sort((a, b) =>
        a.isBanner ? 1 : b.isBanner ? -1 : a.price - b.price,
      );
    } else if (currentSort === "highPrice") {
      workingList.sort((a, b) =>
        a.isBanner ? 1 : b.isBanner ? -1 : b.price - a.price,
      );
    } else if (currentSort === "name") {
      workingList.sort((a, b) =>
        a.isBanner ? 1 : b.isBanner ? -1 : a.title.localeCompare(b.title, "ko"),
      );
    } else if (currentSort === "default") {
      workingList.sort(
        (a, b) => originalItems.indexOf(a) - originalItems.indexOf(b),
      );
    }

    return workingList;
  }

  // 갯수 업데이트 함수
  function updateItemCount() {
    const count = getFilteredList().filter((item) => !item.isBanner).length;
    if (itemCountEl) itemCountEl.textContent = count;
  }

  // 4. 실제 필터 & 정렬 적용 실행 함수
  function applyFilterAndSort() {
    const workingList = getFilteredList();

    productListEl.innerHTML = "";
    workingList.forEach((item) => productListEl.appendChild(item.element));
    closeDrawer();
  }

  // 5. 버튼 클릭 이벤트 (버튼형식 선택 활성화 처리)
  menuLayer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const sortVal = btn.dataset.sort;
    const priceVal = btn.dataset.price;

    if (sortVal !== undefined) {
      currentSort = sortVal;
      btn
        .closest("ul")
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateItemCount();
    }

    if (priceVal !== undefined) {
      currentPrice = priceVal;
      btn
        .closest("ul")
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updateItemCount();
    }
  });

  // 6. '모두 지우기' 버튼 기능
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentSort = "default";
      currentPrice = "all";

      menuLayer
        .querySelectorAll("ul button")
        .forEach((b) => b.classList.remove("active"));
      const defaultSortBtn = menuLayer.querySelector('[data-sort="default"]');
      const defaultPriceBtn = menuLayer.querySelector('[data-price="all"]');
      if (defaultSortBtn) defaultSortBtn.classList.add("active");
      if (defaultPriceBtn) defaultPriceBtn.classList.add("active");

      updateItemCount();
    });
  }

  // 7. 하단 '아이템 N개 표시' 버튼 클릭 시 최종 적용
  if (applyBtn) {
    applyBtn.addEventListener("click", applyFilterAndSort);
  }

  // 초기 로드 시 개수 세팅
  updateItemCount();
});
