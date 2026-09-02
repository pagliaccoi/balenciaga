document.addEventListener('DOMContentLoaded', () => {
    // 비밀번호 재설정 오버레이 요소
    const pwResetTrigger = document.querySelector('#findPwTrigger');
    const pwResetOverlay = document.querySelector('#pwResetOverlay');
    const pwResetPanel = document.querySelector('#pwResetPanel');
    const pwResetClose = document.querySelector('#pwResetClose');
    const pwResetTabs = [...document.querySelectorAll('.pw-reset-tab[role="tab"]')];
    const pwResetPanels = [...document.querySelectorAll('.pw-reset-fields[role="tabpanel"]')];

    // 선택한 탭의 상태와 연결된 입력 영역을 동기화한다.
    function activatePasswordResetTab(tab, shouldFocus = false) {
        const panelId = tab.getAttribute('aria-controls');

        pwResetTabs.forEach((item) => {
            const isSelected = item === tab;
            item.setAttribute('aria-selected', String(isSelected));
            item.tabIndex = isSelected ? 0 : -1;
        });

        pwResetPanels.forEach((panel) => {
            panel.hidden = panel.id !== panelId;
        });

        if (shouldFocus) tab.focus();
    }

    // 오버레이를 열고, 현재 선택된 탭의 첫 번째 입력란으로 포커스를 옮긴다.
    function openPasswordReset() {
        pwResetOverlay.classList.add('is-open');
        pwResetPanel.classList.add('is-open');
        pwResetOverlay.setAttribute('aria-hidden', 'false');
        pwResetPanel.setAttribute('aria-hidden', 'false');
        pwResetTrigger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('is-modal-open');

        const activeTab = document.querySelector('.pw-reset-tab[aria-selected="true"]');
        const activePanel = activeTab && document.querySelector(`#${activeTab.getAttribute('aria-controls')}`);
        const activeInput = activePanel && activePanel.querySelector('input, select');
        if (activeInput) activeInput.focus();
    }

    // 오버레이를 닫고, 열기 버튼으로 포커스를 되돌린다.
    function closePasswordReset() {
        pwResetOverlay.classList.remove('is-open');
        pwResetPanel.classList.remove('is-open');
        pwResetOverlay.setAttribute('aria-hidden', 'true');
        pwResetPanel.setAttribute('aria-hidden', 'true');
        pwResetTrigger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-modal-open');
        pwResetTrigger.focus();
    }

    // 오버레이 열기·닫기 버튼 동작
    pwResetTrigger.addEventListener('click', openPasswordReset);
    pwResetOverlay.addEventListener('click', closePasswordReset);
    pwResetClose.addEventListener('click', closePasswordReset);

    // 탭 클릭 및 키보드(방향키, Home, End) 전환 동작
    pwResetTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activatePasswordResetTab(tab));

        tab.addEventListener('keydown', (event) => {
            let nextIndex;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (index + 1) % pwResetTabs.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (index - 1 + pwResetTabs.length) % pwResetTabs.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = pwResetTabs.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            activatePasswordResetTab(pwResetTabs[nextIndex], true);
        });
    });

    // 열린 상태에서 Esc 키를 누르면 오버레이를 닫는다.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && pwResetPanel.classList.contains('is-open')) {
            closePasswordReset();
        }
    });
});
