document.addEventListener('DOMContentLoaded', function() {
    // 默認載入首頁
    loadPage('home');

    // 為所有導航連結添加點擊事件
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadPage(page);
            
            // 更新活動連結樣式
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
    

    // 監聽動態加載的按鈕點擊事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('content-button')) {
            // 切換到 Collections 頁面
            loadPage('about');
            
            // 更新導航欄的活動狀態
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            document.querySelector('nav a[data-page="about"]').classList.add('active');
        }
    });

    // 監聽動態加載的按鈕點擊事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cta-button')) {
            // 切換到 Collections 頁面
            loadPage('collections');
            
            // 更新導航欄的活動狀態
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            document.querySelector('nav a[data-page="collections"]').classList.add('active');
        }
    });
});

// 載入頁面內容的函數
async function loadPage(page) {
    try {
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        
        // 更新內容區域
        document.getElementById('content').innerHTML = content;
        
        // 初始化跑馬燈
        initializeMarquee();
        
        // 重新初始化頁面特定的JavaScript
        initializePageScripts(page);
        
        // 更新頁面標題
        updatePageTitle(page);
        
        // 捲動到頁面頂部
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('content').innerHTML = '<p>Error loading content. Please try again.</p>';
    }
}

// 初始化跑馬燈
function initializeMarquee() {
    const container = document.querySelector('.frames-container');
    if (!container) return;

    // 複製元素以確保無縫滾動
    const frames = container.innerHTML;
    container.innerHTML = frames + frames;

    // 當滾動到一半時重置位置
    container.addEventListener('animationend', () => {
        container.style.animation = 'none';
        container.offsetHeight; // 觸發reflow
        container.style.animation = null;
    });

    
}

// 在 initializePageScripts 函數中添加 collections 的初始化
function initializePageScripts(page) {
    switch(page) {
        case 'home':
            initializeMarquee();
            break;
        case 'collections':
            initializeMarquee();
            initializeImageCarousel();
            setupEventListeners();
            break;
    }

    if (typeof gsap !== 'undefined') {
        initializeAnimations();
    }
}

// 更新頁面標題
function updatePageTitle(page) {
    const titles = {
        'home': 'Simu.S Virtual 3D',
        'collections': 'Collections - Simu.S Virtual 3D',
        'about': 'About Us - Simu.S Virtual 3D'
    };
    document.title = titles[page] || 'Simu.S Virtual 3D';
}

// 初始化動畫效果
function initializeAnimations() {
    gsap.from('.bg-change', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.bg-change',
            start: 'top center'
        }
    });
}

function initializeImageCarousel() {
    const items = document.querySelectorAll('.clothing-item');
    
    items.forEach(item => {
        const images = item.querySelectorAll('.images img');
        const prevBtn = item.querySelector('.prev');
        const nextBtn = item.querySelector('.next');
        let currentIndex = 0;

        // 确保只有第一张图片显示
        images.forEach((img, index) => {
            img.style.display = index === 0 ? 'block' : 'none';
        });

        // 切换图片的显示
        function showImage(index) {
            images.forEach(img => img.style.display = 'none');
            images[index].style.display = 'block';
        }


        // 左右按钮功能
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    });
}




function showModal(event) {
    const modal = document.querySelector('.fullscreen-modal');
    const gifContainer = modal.querySelector('.gif-container img');
    
    // 获取点击的图片对应的 GIF 路径
    const gifSrc = event.target.getAttribute('data-gif');
    gifContainer.src = gifSrc;  // 设置 GIF 图像的 src
    modal.style.display = 'flex'; // 顯示模態框
}

// 隱藏模態框的函數
function hideModal() {
    const modal = document.querySelector('.fullscreen-modal');
    modal.style.display = 'none'; // 隱藏模態框
}

// 設置事件監聽器的函數
function setupEventListeners() {
    const image1 = document.querySelectorAll('.image-1');
    const closeButton = document.querySelectorAll('.close');

    // 點擊第一張圖片時顯示模態框
    image1.forEach(image => {
        image.addEventListener('click', showModal);
    });

    // 點擊關閉按鈕時隱藏模態框
    closeButton.forEach(close => {
        close.addEventListener('click', hideModal);
    });

    // 可選：點擊模態框外部時隱藏模態框
    window.addEventListener('click', function(event) {
        // 檢查點擊的位置是否是模態框外部
        const modal = event.target.closest('.fullscreen-modal');
        if (modal && event.target === modal) {
            hideModal(event);
        }
    });
}
