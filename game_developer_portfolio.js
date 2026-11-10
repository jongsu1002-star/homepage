// 1. 슬라이더 데이터 및 상태
let currentSlide = 0;
const totalSlides = 4;
const slides = document.querySelectorAll('.slide-item');
const thumbs = document.querySelectorAll('.thumb-btn');
const indicator = document.getElementById('slide-indicator');
const videoElement = document.getElementById('gameplay-video');

function updateSlider(index) {
    // 인덱스 바운더리 처리
    if (index < 0) currentSlide = totalSlides - 1;
    else if (index >= totalSlides) currentSlide = 0;
    else currentSlide = index;

    // 슬라이드 전환
    slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
            slide.classList.add('opacity-100', 'z-10');
            
            // 비디오 탭으로 돌아왔을 때 재생 재개
            if (idx === 0 && videoElement) {
                videoElement.play().catch(e => console.log("자동재생 차단됨:", e));
            }
        } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
        }
    });

    // 비디오 슬라이드 벗어날 때 영상 일시정지 처리
    if (currentSlide !== 0 && videoElement) {
        videoElement.pause();
    }

    // 썸네일 활성화 스타일 갱신
    thumbs.forEach((thumb, idx) => {
        if (idx === currentSlide) {
            thumb.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-800');
            thumb.classList.remove('bg-slate-800/60');
        } else {
            thumb.classList.remove('ring-2', 'ring-cyan-400', 'bg-slate-800');
            thumb.classList.add('bg-slate-800/60');
        }
    });

    // 인디케이터 텍스트 갱신
    if (indicator) {
        indicator.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
    }
}

// 이전/다음 버튼 이벤트
document.getElementById('btn-prev').addEventListener('click', () => {
    updateSlider(currentSlide - 1);
});

document.getElementById('btn-next').addEventListener('click', () => {
    updateSlider(currentSlide + 1);
});

// 썸네일 클릭 이벤트
thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const target = parseInt(thumb.getAttribute('data-target'), 10);
        updateSlider(target);
    });
});

// 2. 코드 리뷰 탭 전환 로직
function switchCodeTab(tabIndex) {
    const btn1 = document.getElementById('tab-code-1');
    const btn2 = document.getElementById('tab-code-2');
    const content1 = document.getElementById('content-code-1');
    const content2 = document.getElementById('content-code-2');

    if (tabIndex === 1) {
        btn1.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 transition-all';
        btn2.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all';
        content1.classList.remove('hidden');
        content2.classList.add('hidden');
    } else {
        btn2.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 transition-all';
        btn1.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all';
        content2.classList.remove('hidden');
        content1.classList.add('hidden');
    }
}

// 3. 토스트 알림 함수 (alert() 절대 금지 원칙 준수)
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs font-medium shadow-2xl shadow-cyan-500/20 transform transition-all duration-300 translate-y-3 opacity-0';
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-cyan-400 text-sm"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    // 등장 애니메이션
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-3', 'opacity-0');
    });

    // 3초 후 자동 제거
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. 안전한 클립보드 복사 (execCommand 폴백 지원)
function copyToClipboard(textToCopy, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = textToCopy;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(successMsg || '클립보드에 복사되었습니다.');
        } else {
            showToast('복사에 실패했습니다. 직접 복사해주세요.');
        }
    } catch (err) {
        showToast('클립보드 복사 지원되지 않는 환경입니다.');
    } finally {
        document.body.removeChild(tempInput);
    }
}

// 5. 코드 스니펫 복사 헬퍼
function copyCodeSnippet(elementId) {
    const codeEl = document.getElementById(elementId);
    if (codeEl) {
        copyToClipboard(codeEl.innerText, 'C# 소스 코드가 클립보드에 복사되었습니다!');
    }
}

// 6. 간이 폼 제출 핸들러
function handleFormSubmit(e) {
    e.preventDefault();
    showToast('아직 메시지 전송 기능이 연결되지 않았습니다. 이메일을 이용해 주세요.');

}

// 키보드 좌우 화살표로도 슬라이더 조작 가능 (접근성)
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateSlider(currentSlide - 1);
    if (e.key === 'ArrowRight') updateSlider(currentSlide + 1);
});

// HTML ??? ??? ??
document.querySelectorAll('[data-code-tab]').forEach(button => {
    button.addEventListener('click', () => switchCodeTab(Number(button.dataset.codeTab)));
});
document.querySelectorAll('[data-copy-code]').forEach(button => {
    button.addEventListener('click', () => copyCodeSnippet(button.dataset.copyCode));
});
document.querySelectorAll('[data-copy-text]').forEach(button => {
    button.addEventListener('click', () => copyToClipboard(button.dataset.copyText, button.dataset.copyMessage));
});
document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => showToast(button.dataset.toast));
});
document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);
document.querySelectorAll('img[data-fallback-src]').forEach(img => {
    const useFallback = () => {
        if (img.src !== img.dataset.fallbackSrc) img.src = img.dataset.fallbackSrc;
    };
    img.addEventListener('error', useFallback);
    if (img.complete && img.naturalWidth === 0) useFallback();
});
