document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('#filterSortTrigger');
    const overlay = document.querySelector('#filterSortOverlay');
    const panel = document.querySelector('#filterSortPanel');
    const closeButton = document.querySelector('#filterSortClose');
    const form = document.querySelector('#filterSortForm');
    const accordionTriggers = document.querySelectorAll('.filter-accordion-trigger');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!trigger || !overlay || !panel || !closeButton || !form) return;

    // 패널을 열고, 키보드 사용자가 바로 조작할 수 있도록 닫기 버튼으로 포커스를 이동합니다.
    function openFilterPanel() {
        overlay.classList.add('is-open');
        panel.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        panel.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('is-modal-open');
        closeButton.focus();
    }

    // 열기 전 버튼으로 포커스를 돌려주어, 닫은 뒤에도 키보드 흐름이 자연스럽게 이어집니다.
    function closeFilterPanel() {
        overlay.classList.remove('is-open');
        panel.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-modal-open');
        trigger.focus();
    }

    function getFocusableElements() {
        return [...panel.querySelectorAll(
            'button:not([disabled]), input:not([disabled])'
        )];
    }

    trigger.addEventListener('click', openFilterPanel);
    closeButton.addEventListener('click', closeFilterPanel);
    overlay.addEventListener('click', closeFilterPanel);

    // 여러 항목을 동시에 펼쳐 비교할 수 있는 아코디언입니다.
    accordionTriggers.forEach((accordionTrigger) => {
        accordionTrigger.addEventListener('click', () => {
            const panelId = accordionTrigger.getAttribute('aria-controls');
            const accordionPanel = document.getElementById(panelId);
            const isExpanded = accordionTrigger.getAttribute('aria-expanded') === 'true';

            accordionTrigger.setAttribute('aria-expanded', String(!isExpanded));

            if (!isExpanded) {
                accordionPanel.hidden = false;
                window.requestAnimationFrame(() => {
                    if (accordionTrigger.getAttribute('aria-expanded') === 'true') {
                        accordionPanel.classList.add('is-open');
                    }
                });
                return;
            }

            if (!accordionPanel.classList.contains('is-open')) {
                accordionPanel.hidden = true;
                return;
            }

            accordionPanel.classList.remove('is-open');

            if (reducedMotion.matches) {
                accordionPanel.hidden = true;
                return;
            }

            // 접히는 전환이 끝난 뒤에만 숨겨 키보드 초점도 함께 목록에서 제거합니다.
            const hideCollapsedPanel = (event) => {
                if (event.propertyName !== 'max-height') return;

                accordionPanel.removeEventListener('transitionend', hideCollapsedPanel);
                if (accordionTrigger.getAttribute('aria-expanded') === 'false') {
                    accordionPanel.hidden = true;
                }
            };

            accordionPanel.addEventListener('transitionend', hideCollapsedPanel);
        });
    });

    // 현재 상품 목록에는 실제 필터 데이터가 없으므로, 선택값을 유지한 채 패널만 닫습니다.
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        closeFilterPanel();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel.classList.contains('is-open')) {
            closeFilterPanel();
            return;
        }

        if (event.key === 'Tab' && panel.classList.contains('is-open')) {
            const focusableElements = getFocusableElements();
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });
});
