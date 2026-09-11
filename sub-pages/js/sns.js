document.addEventListener("DOMContentLoaded", function() {
    const video = document.querySelector('.auto-video');
    
    if (video) {
        video.muted = true; // 확실하게 음소거 처리
        let playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 자동 재생 성공
            }).catch(error => {
                // 모바일 저전력 모드나 정책으로 인해 자동 재생이 차단된 경우
                // 사용자가 화면을 터치하는 순간 재생
                document.addEventListener('touchstart', function once() {
                    video.play();
                    document.removeEventListener('touchstart', once);
                }, { once: true });
            });
        }
    }
});