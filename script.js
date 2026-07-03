document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const app = document.getElementById('app');

    let progress = 0;
    const duration = 9000; // 3 seconds
    const interval = 40;
    const step = 100 / (duration / interval);

    // 1. Simulate Loading Progress
    const loadInterval = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            finishLoading();
        }
        progressBar.style.width = progress + '%';
        progressText.innerText = Math.floor(progress) + '%';
    }, interval);

    function finishLoading() {
        setTimeout(() => {
            loader.classList.add('hidden');
            app.style.display = 'block';
            setTimeout(() => {
                app.style.opacity = '1';
            }, 100);
        }, 400);
    }

    // ================= NAVIGATION =================
    const navItems = document.querySelectorAll('.nav-item');
    const pages = {
        home: document.getElementById('homePage'),
        search: document.getElementById('searchPage'),
        create: document.getElementById('createPage'),
        reels: document.getElementById('reelsPage'),
        profile: document.getElementById('profilePage')
    };

    function showPage(pageName) {
        if (!pageName || !pages[pageName]) return;
        const nextPage = pages[pageName];
        if (nextPage.style.display === 'block') return; // already on this page

        navItems.forEach(n => n.classList.remove('active'));
        const navBtn = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (navBtn) navBtn.classList.add('active');

        const currentPage = Object.values(pages).find(p => p && p !== nextPage && p.style.display !== 'none');

        function revealNextPage() {
            nextPage.style.display = 'block';
            nextPage.classList.add('page-entering');
            // Force a reflow so the browser registers the starting (opacity:0) state
            // before we remove the class, which is what makes the fade actually animate.
            void nextPage.offsetWidth;
            nextPage.classList.remove('page-entering');

            if (pageName === 'create') {
                document.querySelector('.create-screen').style.display = 'flex';
            }
            if (pageName === 'reels') {
                if (window.ReelsPlayer) window.ReelsPlayer.onShow();
            } else {
                if (window.ReelsPlayer) window.ReelsPlayer.onHide();
            }
        }

        if (currentPage) {
            currentPage.classList.add('page-leaving');
            setTimeout(() => {
                currentPage.style.display = 'none';
                currentPage.classList.remove('page-leaving');
            }, 200);
        }
        revealNextPage();
    }
    window.showPage = showPage;

    navItems.forEach(item => {
        item.addEventListener('click', () => showPage(item.dataset.page));
    });

    // Set initial page
    if (pages.home) pages.home.style.display = 'block';

    // ================= PROFILE TABS =================
    const tabs = document.querySelectorAll('.tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(tc => tc.classList.remove('active'));
            const target = document.getElementById(tabName + 'Tab');
            if (target) target.classList.add('active');
        });
    });

    // ================= MODAL LOGIC =================
    window.openModal = function(id) {
        const modal = document.getElementById(id);
        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeModal = function(id) {
        const modal = document.getElementById(id);
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Close modal on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ================= STORY VIEWER =================
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach(item => {
        item.addEventListener('click', () => {
            openModal('storyModal');
            // Auto close after 5s
            setTimeout(() => {
                closeModal('storyModal');
            }, 5000);
        });
    });

    // ================= LIKE BUTTON ANIMATION =================
    document.querySelectorAll('.post-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon && icon.classList.contains('far') && icon.classList.contains('fa-heart')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff0055';
                // Small bounce animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => this.style.transform = 'scale(1)', 200);
            }
        });
    });

    // ================= SKILL BAR ANIMATION =================
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.fill');
                fills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsList = document.querySelector('.skills-list');
    if (skillsList) skillObserver.observe(skillsList);

    // ================= DASHBOARD CARD CLICK =================
    const dashboardCard = document.querySelector('.dashboard-card');
    if (dashboardCard) {
        dashboardCard.addEventListener('click', () => {
            openModal('dashboardModal');
        });
    }

    // ================= CREATE BUTTON PULSE =================
    const createBtn = document.querySelector('.create-main-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            createBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                createBtn.style.transform = 'scale(1)';
                // Switch to home after click
                showPage('home');
            }, 200);
        });
    }

    // ================= REELS VIDEO PLAYER =================
    (function initReelsPlayer() {
        const container = document.getElementById('reelsContainer');
        if (!container) return;

        // Hand-curated reels now live in their own data file (reels.js),
        // loaded before this script — same pattern as data.js for POSTS.
        const handmadeReels = window.REELS || [];

        // Every "video" type post from the 50-post feed is a reel too — merging
        // them here means anything posted as a video in Home/Search/Profile
        // automatically shows up in the swipeable Reels page and Reels tab.
        const feedVideoReels = (window.POSTS || []).filter(p => p.type === 'video').map(p => ({
            src: p.videoSrc,
            user: p.username,
            avatar: p.avatar,
            caption: p.caption,
            audio: 'Original audio \u00b7 ' + p.username,
            likes: p.likes,
            comments: String(p.comments),
            poster: p.thumb,
            postId: p.id
        }));

        const reelsData = [...handmadeReels, ...feedVideoReels];
        window.ALL_REELS = reelsData;

        let isMuted = false;

        // Build slides
        reelsData.forEach((reel, i) => {
            const slide = document.createElement('div');
            slide.className = 'reel-slide';
            slide.innerHTML = `
                <video class="reel-video-el" src="${reel.src}" loop muted playsinline preload="metadata"></video>
                <div class="reel-slide-gradient"></div>
                <div class="reel-progress"><div class="reel-progress-fill"></div></div>
                <div class="reel-mute-btn"><i class="fas fa-volume-up"></i></div>
                <div class="reel-play-overlay"><i class="fas fa-play"></i></div>
                <div class="reels-bottom-info">
                    <div class="reel-user">
                        <img src="${reel.avatar}" alt="${reel.user}">
                        <span>${reel.user}</span>
                        <button class="follow-btn">Follow</button>
                    </div>
                    <div class="reel-caption">${reel.caption}</div>
                    <div class="reel-audio"><i class="fas fa-music"></i> ${reel.audio}</div>
                </div>
            `;
            container.appendChild(slide);
        });

        const slides = Array.from(container.querySelectorAll('.reel-slide'));
        const videos = slides.map(s => s.querySelector('.reel-video-el'));

        function pauseAll(exceptVideo) {
            videos.forEach(v => {
                if (v !== exceptVideo && !v.paused) v.pause();
            });
        }

        function updateMuteIcons() {
            document.querySelectorAll('.reel-mute-btn i').forEach(icon => {
                icon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            });
        }

        function playSlide(video) {
            if (!video) return;
            video.muted = isMuted;
            const playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(() => {
                    // Browser blocked unmuted autoplay (no direct user gesture yet) —
                    // fall back to muted playback so the video still plays.
                    if (!video.muted) {
                        isMuted = true;
                        video.muted = true;
                        videos.forEach(v => v.muted = true);
                        updateMuteIcons();
                        video.play().catch(() => {});
                    }
                });
            }
            const slide = video.closest('.reel-slide');
            if (slide) slide.classList.remove('paused');
        }

        // Autoplay the reel currently in view, pause the rest
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('.reel-video-el');
                if (!video) return;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    pauseAll(video);
                    playSlide(video);
                } else {
                    video.pause();
                }
            });
        }, { threshold: [0, 0.6, 1] });

        slides.forEach(slide => observer.observe(slide));

        // Tap video to toggle play/pause
        slides.forEach(slide => {
            const video = slide.querySelector('.reel-video-el');
            video.addEventListener('click', () => {
                if (video.paused) {
                    playSlide(video);
                } else {
                    video.pause();
                    slide.classList.add('paused');
                }
            });

            // Progress bar
            const fill = slide.querySelector('.reel-progress-fill');
            video.addEventListener('timeupdate', () => {
                if (video.duration) {
                    fill.style.width = (video.currentTime / video.duration * 100) + '%';
                }
            });

            // Mute toggle (applies globally so the next reel keeps the preference)
            const muteBtn = slide.querySelector('.reel-mute-btn');
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isMuted = !isMuted;
                videos.forEach(v => v.muted = isMuted);
                updateMuteIcons();
            });

            // Like button bounce + fill heart (sidebar icons removed; guard in case markup changes)
            const likeBtn = slide.querySelector('.reel-like-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', () => {
                    const icon = likeBtn.querySelector('i');
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#ff0055';
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '';
                    }
                    likeBtn.style.transform = 'scale(1.2)';
                    setTimeout(() => likeBtn.style.transform = 'scale(1)', 200);
                });
            }
        });

        // Desktop: ArrowUp / ArrowDown scrolls to the previous/next reel
        function isReelsPageActive() {
            const reelsPage = document.getElementById('reelsPage');
            return reelsPage && reelsPage.style.display !== 'none';
        }

        function currentSlideIndex() {
            const containerTop = container.scrollTop;
            let closest = 0;
            let minDiff = Infinity;
            slides.forEach((slide, i) => {
                const diff = Math.abs(slide.offsetTop - containerTop);
                if (diff < minDiff) { minDiff = diff; closest = i; }
            });
            return closest;
        }

        function goToSlide(index) {
            if (index < 0 || index >= slides.length) return;
            slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.addEventListener('keydown', (e) => {
            if (!isReelsPageActive()) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                goToSlide(currentSlideIndex() + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                goToSlide(currentSlideIndex() - 1);
            }
        });

        // Mouse wheel support on desktop (in addition to native touch swipe on mobile,
        // which the scroll-snap container already handles natively)
        let wheelLock = false;
        container.addEventListener('wheel', (e) => {
            if (wheelLock) { e.preventDefault(); return; }
            e.preventDefault();
            wheelLock = true;
            if (e.deltaY > 0) {
                goToSlide(currentSlideIndex() + 1);
            } else if (e.deltaY < 0) {
                goToSlide(currentSlideIndex() - 1);
            }
            setTimeout(() => { wheelLock = false; }, 500);
        }, { passive: false });

        // Expose control hooks for the nav handler
        window.ReelsPlayer = {
            onShow() {
                const idx = currentSlideIndex();
                if (videos[idx]) playSlide(videos[idx]);
            },
            onHide() {
                videos.forEach(v => v.pause());
            },
            goToIndex(i) {
                goToSlide(i);
                setTimeout(() => { if (videos[i]) { pauseAll(videos[i]); playSlide(videos[i]); } }, 350);
            }
        };
    })();

    // ================= CONTENT SYSTEM: feed / search / profile / tagged =================
    initContentSystem();
});

function initContentSystem() {
    const POSTS = window.POSTS || [];
    const TAGGED_POSTS = window.TAGGED_POSTS || [];
    const postById = id => POSTS.find(p => p.id === id);

    /* ---------------------------------------------------------------
       Small helpers
    --------------------------------------------------------------- */
    function hashtagsHtml(tags) {
        return `<div class="hashtag-row">${tags.map(t => `<span class="hashtag-pill" data-tag="${t}">#${t}</span>`).join('')}</div>`;
    }

    function typeLabel(type) {
        return {
            photo: '<i class="fas fa-image"></i> Photo',
            video: '<i class="fas fa-video"></i> Original audio',
            website: '<i class="fas fa-globe"></i> Web project',
            post: '<i class="fas fa-align-left"></i> Text post'
        }[type] || '';
    }

    function appendHtml(container, html) {
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        Array.from(wrap.children).forEach(child => container.appendChild(child));
    }

    function shareUrlFor(post) {
        return post.type === 'website' ? post.demoUrl : `https://creative.dev/p/${post.id}`;
    }

    function shareText(title) {
        return encodeURIComponent(title);
    }

    function openShareSheet(title, url) {
        if (navigator.share) {
            navigator.share({ title, url }).catch(() => {});
            return;
        }
        const encUrl = encodeURIComponent(url);
        const t = shareText(title);
        const links = [
            { icon: 'fa-brands fa-x-twitter', label: 'X', href: `https://twitter.com/intent/tweet?text=${t}&url=${encUrl}` },
            { icon: 'fa-brands fa-facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}` },
            { icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${encUrl}` },
            { icon: 'fa-brands fa-telegram', label: 'Telegram', href: `https://t.me/share/url?url=${encUrl}&text=${t}` },
            { icon: 'fa-solid fa-link', label: 'Copy link', href: '#copy' }
        ];
        const sheet = document.createElement('div');
        sheet.className = 'modal-overlay share-sheet-overlay';
        sheet.innerHTML = `
            <div class="modal-sheet share-sheet">
                <div class="modal-handle"></div>
                <div class="modal-header" style="background:linear-gradient(90deg,#38bdf8,#6366f1);">
                    <h2>Share</h2>
                    <button class="close-modal" data-close-share><i class="fas fa-times"></i></button>
                </div>
                <div class="share-icons">
                    ${links.map(l => `<a href="${l.href}" target="_blank" rel="noopener" class="share-icon-btn" ${l.href === '#copy' ? 'data-copy="' + url + '"' : ''}>
                        <span class="share-icon-circle"><i class="${l.icon}"></i></span><span>${l.label}</span>
                    </a>`).join('')}
                </div>
            </div>`;
        document.body.appendChild(sheet);
        document.body.style.overflow = 'hidden';
        // Add "active" on the next frame (not immediately) so the browser registers
        // the initial hidden state first and the fade/slide-up actually animates.
        requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('active')));
        function destroy() {
            sheet.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => sheet.remove(), 350);
        }
        sheet.addEventListener('click', (e) => {
            if (e.target === sheet || e.target.closest('[data-close-share]')) destroy();
            const copyBtn = e.target.closest('[data-copy]');
            if (copyBtn) {
                e.preventDefault();
                navigator.clipboard?.writeText(copyBtn.dataset.copy).catch(() => {});
                copyBtn.querySelector('span:last-child').textContent = 'Copied!';
                setTimeout(destroy, 600);
            }
        });
    }

    function toggleLike(btn) {
        const icon = btn.querySelector('i');
        if (!icon) return;
        if (icon.classList.contains('far')) {
            icon.classList.remove('far'); icon.classList.add('fas'); icon.style.color = '#ff0055';
        } else {
            icon.classList.remove('fas'); icon.classList.add('far'); icon.style.color = '';
        }
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    }

    function toggleBookmark(btn) {
        const icon = btn.querySelector('i');
        if (!icon) return;
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
    }

    function goToHashtagSearch(tag) {
        showPage('search');
        const input = document.getElementById('searchInput');
        if (input) {
            input.value = tag;
            input.dispatchEvent(new Event('input'));
        }
    }

    /* ---------------------------------------------------------------
       HOME FEED — 10 posts per load, spinner between batches
    --------------------------------------------------------------- */
    const feedContainer = document.getElementById('feedPosts');
    const feedSentinel = document.getElementById('feedSentinel');
    const feedLoader = document.getElementById('feedLoader');
    const feedEnd = document.getElementById('feedEnd');
    const FEED_BATCH = 10;
    let feedLoaded = 0;
    let feedLoading = false;

    function feedCardHtml(post) {
        let mediaHtml, extraHeader = '';
        if (post.type === 'photo') {
            mediaHtml = `<div class="post-media" data-post-id="${post.id}"><img src="${post.image}" alt=""></div>`;
        } else if (post.type === 'video') {
            mediaHtml = `<div class="post-media video-media" data-post-id="${post.id}"><img src="${post.thumb}" alt=""><div class="media-play-badge"><i class="fas fa-play"></i></div></div>`;
        } else if (post.type === 'website') {
            mediaHtml = `
                <div class="post-media website-media" data-post-id="${post.id}">
                    <div class="browser-frame"><span class="bdot r"></span><span class="bdot y"></span><span class="bdot g"></span><span class="burl">${post.demoUrl.replace('https://', '')}</span></div>
                    <img src="${post.thumb}" alt="">
                    <div class="media-play-badge website-badge"><i class="fas fa-arrow-up-right-from-square"></i></div>
                </div>`;
            extraHeader = `<div class="post-website-info"><span class="proj-title">${post.title}</span><span class="stars"><i class="fas fa-star"></i> ${(post.stars / 1000).toFixed(1)}K</span></div>`;
        } else {
            mediaHtml = `<div class="post-media text-media" data-post-id="${post.id}" style="background:${post.gradient}"><p>${post.text}</p></div>`;
        }
        const captionText = post.type === 'post' ? post.text : (post.caption || '');
        return `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-user">
                    <img src="${post.avatar}" alt="${post.username}">
                    <div class="post-user-info">
                        <span class="username">${post.username} <i class="fas fa-check-circle verified"></i></span>
                        <span class="audio-info">${typeLabel(post.type)}</span>
                    </div>
                </div>
                <button class="more-btn"><i class="fas fa-ellipsis-h"></i></button>
            </div>
            ${extraHeader}
            ${mediaHtml}
            <div class="post-actions-row">
                <div class="post-actions-left">
                    <button class="post-action-btn like-btn"><i class="far fa-heart"></i><span>${post.likes}</span></button>
                    <button class="post-action-btn"><i class="far fa-comment"></i><span>${post.comments}</span></button>
                    <button class="post-action-btn share-btn" data-post-id="${post.id}"><i class="far fa-paper-plane"></i></button>
                </div>
                <button class="post-action-btn bookmark"><i class="far fa-bookmark"></i></button>
            </div>
            <div class="post-caption"><span class="caption-user">${post.username}</span> ${captionText}</div>
            ${hashtagsHtml(post.hashtags)}
            <div class="post-time">${post.date}</div>
        </div>`;
    }

    function appendFeedBatch() {
        const batch = POSTS.slice(feedLoaded, feedLoaded + FEED_BATCH);
        appendHtml(feedContainer, batch.map(feedCardHtml).join(''));
        feedLoaded += batch.length;
        feedLoader.style.display = 'none';
        feedLoading = false;
        if (feedLoaded >= POSTS.length) feedEnd.style.display = 'flex';
    }

    function loadFeedBatch() {
        if (feedLoading) return;
        if (feedLoaded >= POSTS.length) {
            feedLoader.style.display = 'none';
            feedEnd.style.display = 'flex';
            return;
        }
        feedLoading = true;
        feedLoader.style.display = 'flex';
        setTimeout(appendFeedBatch, 750);
    }

    if (feedContainer) {
        // First 10 posts appear immediately, no loading indicator
        feedLoading = true;
        appendFeedBatch();
        const feedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) loadFeedBatch(); });
        }, { rootMargin: '400px' });
        feedObserver.observe(feedSentinel);

        feedContainer.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (likeBtn) { toggleLike(likeBtn); return; }
            const bookmarkBtn = e.target.closest('.bookmark');
            if (bookmarkBtn) { toggleBookmark(bookmarkBtn); return; }
            const shareBtn = e.target.closest('.share-btn');
            if (shareBtn) {
                const post = postById(shareBtn.dataset.postId);
                if (post) openShareSheet(post.title || post.username, shareUrlFor(post));
                return;
            }
            const tagPill = e.target.closest('.hashtag-pill');
            if (tagPill) { goToHashtagSearch(tagPill.dataset.tag); return; }
            const media = e.target.closest('.post-media');
            if (media) {
                const post = postById(media.dataset.postId);
                if (post) openPostPopup(post);
            }
        });
    }

    /* ---------------------------------------------------------------
       SEARCH PAGE — all 50 posts, filterable by hashtag
    --------------------------------------------------------------- */
    const exploreGrid = document.getElementById('exploreGrid');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchMeta = document.getElementById('searchMeta');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchTagRow = document.getElementById('searchTagRow');

    function gridThumbHtml(post, tall) {
        const isVideo = post.type === 'video';
        const isWebsite = post.type === 'website';
        const isText = post.type === 'post';
        const thumbSrc = isText ? null : post.thumb;
        const inner = isText
            ? `<div class="explore-text-thumb" style="background:${post.gradient}"><p>${post.text.slice(0, 70)}${post.text.length > 70 ? '\u2026' : ''}</p></div>`
            : `<img src="${thumbSrc}" alt="">`;
        const badge = isVideo ? '<i class="fas fa-play"></i>' : isWebsite ? '<i class="fas fa-globe"></i>' : isText ? '<i class="fas fa-align-left"></i>' : '';
        return `<div class="explore-item${tall ? ' tall' : ''}" data-post-id="${post.id}">${inner}${badge ? `<div class="explore-badge">${badge}</div>` : ''}</div>`;
    }

    function renderExploreGrid(filterTag) {
        const filtered = filterTag
            ? POSTS.filter(p => p.hashtags.some(h => h.toLowerCase().includes(filterTag)))
            : POSTS;
        exploreGrid.innerHTML = filtered.map((p, i) => gridThumbHtml(p, i % 9 === 0)).join('');
        exploreGrid.style.display = filtered.length ? 'grid' : 'none';
        searchEmpty.style.display = filtered.length ? 'none' : 'flex';
        searchMeta.textContent = filterTag ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for #${filterTag}` : '';
    }

    // Build the quick-filter chip row straight from the posts' own hashtags.
    (function buildTagChipsFromPosts() {
        const seen = new Set();
        POSTS.forEach(p => p.hashtags.forEach(h => seen.add(h)));
        const topTags = Array.from(seen).slice(0, 12);
        if (searchTagRow) searchTagRow.innerHTML = topTags.map(t => `<span class="hashtag-pill" data-tag="${t}">#${t}</span>`).join('');
    })();

    if (exploreGrid) {
        renderExploreGrid('');

        searchInput.addEventListener('input', () => {
            const val = searchInput.value.trim().toLowerCase().replace(/^#/, '');
            searchClear.style.display = val ? 'block' : 'none';
            renderExploreGrid(val);
        });
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            renderExploreGrid('');
        });
        searchTagRow.addEventListener('click', (e) => {
            const pill = e.target.closest('.hashtag-pill');
            if (!pill) return;
            searchInput.value = pill.dataset.tag;
            searchInput.dispatchEvent(new Event('input'));
        });
        exploreGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.explore-item');
            if (!item) return;
            const post = postById(item.dataset.postId);
            if (post) openPostPopup(post);
        });
    }

    /* ---------------------------------------------------------------
       PROFILE GRID TAB — 20 posts per load
    --------------------------------------------------------------- */
    const profileGrid = document.getElementById('profileGrid');
    const profileGridSentinel = document.getElementById('profileGridSentinel');
    const profileGridLoader = document.getElementById('profileGridLoader');
    const profileGridEnd = document.getElementById('profileGridEnd');
    const PROFILE_BATCH = 20;
    let profileLoaded = 0;
    let profileLoading = false;

    function appendProfileBatch() {
        const batch = POSTS.slice(profileLoaded, profileLoaded + PROFILE_BATCH);
        appendHtml(profileGrid, batch.map(p => gridThumbHtml(p, false).replace('explore-item', 'grid-item').replace('explore-badge', 'grid-overlay')).join(''));
        profileLoaded += batch.length;
        profileGridLoader.style.display = 'none';
        profileLoading = false;
        if (profileLoaded >= POSTS.length) profileGridEnd.style.display = 'flex';
    }

    function loadProfileBatch() {
        if (profileLoading) return;
        if (profileLoaded >= POSTS.length) {
            profileGridLoader.style.display = 'none';
            profileGridEnd.style.display = 'flex';
            return;
        }
        profileLoading = true;
        profileGridLoader.style.display = 'flex';
        setTimeout(appendProfileBatch, 700);
    }

    if (profileGrid) {
        // First 20 posts appear immediately, no loading indicator
        profileLoading = true;
        appendProfileBatch();
        const profileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) loadProfileBatch(); });
        }, { rootMargin: '400px' });
        profileObserver.observe(profileGridSentinel);

        profileGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.grid-item');
            if (!item) return;
            const post = postById(item.dataset.postId);
            if (post) openPostPopup(post);
        });
    }

    /* ---------------------------------------------------------------
       PROJECTS — every "website" type post from the 50
    --------------------------------------------------------------- */
    const projectsList = document.getElementById('projectsList');
    if (projectsList) {
        const projects = POSTS.filter(p => p.type === 'website');
        projectsList.innerHTML = projects.map(p => `
            <div class="project-card" data-post-id="${p.id}">
                <div class="project-img"><img src="${p.thumb}" alt=""></div>
                <div class="project-body">
                    <div class="project-header">
                        <span class="proj-title">${p.title}</span>
                        <span class="stars"><i class="fas fa-star"></i> ${(p.stars / 1000).toFixed(1)}K</span>
                    </div>
                    <p class="proj-desc">${p.desc}</p>
                    <div class="proj-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
                    <div class="proj-actions">
                        <a class="proj-btn" href="${p.demoUrl}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                        <a class="proj-btn" href="${p.githubUrl}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
                    </div>
                </div>
            </div>`).join('');
        projectsList.addEventListener('click', (e) => {
            if (e.target.closest('.proj-btn')) return; // let links behave normally
            const card = e.target.closest('.project-card');
            if (!card) return;
            const post = postById(card.dataset.postId);
            if (post) openPostPopup(post);
        });
    }

    /* ---------------------------------------------------------------
       PROFILE REELS TAB — synced with the Reels page player
    --------------------------------------------------------------- */
    const profileReelsGrid = document.getElementById('profileReelsGrid');
    if (profileReelsGrid) {
        // ALL_REELS is populated by initReelsPlayer(), which runs just before this.
        const reels = window.ALL_REELS || [];
        profileReelsGrid.innerHTML = reels.map((r, i) => `
            <div class="reel-thumb" data-index="${i}">
                <img src="${r.poster}" alt="">
                <div class="reel-overlay"><i class="fas fa-play"></i><span>${r.likes}</span></div>
            </div>`).join('');
        profileReelsGrid.addEventListener('click', (e) => {
            const thumb = e.target.closest('.reel-thumb');
            if (!thumb) return;
            const idx = parseInt(thumb.dataset.index, 10);
            showPage('reels');
            setTimeout(() => { if (window.ReelsPlayer) window.ReelsPlayer.goToIndex(idx); }, 60);
        });
    }

    /* ---------------------------------------------------------------
       TAGGED TAB — 20 blog-style posts
    --------------------------------------------------------------- */
    const taggedList = document.getElementById('taggedList');
    if (taggedList) {
        taggedList.innerHTML = TAGGED_POSTS.map(t => `
            <div class="project-card tagged-card" data-tagged-id="${t.id}">
                <div class="project-img"><img src="${t.coverThumb}" alt=""></div>
                <div class="project-body">
                    <div class="project-header"><span class="proj-title">${t.title}</span></div>
                    <p class="proj-desc">${t.subtitle}</p>
                    <div class="proj-tags">${t.hashtags.map(h => `<span>#${h}</span>`).join('')}</div>
                </div>
            </div>`).join('');
        taggedList.addEventListener('click', (e) => {
            const card = e.target.closest('.tagged-card');
            if (!card) return;
            const post = TAGGED_POSTS.find(t => t.id === card.dataset.taggedId);
            if (post) openBlogPopup(post);
        });
    }

    /* ---------------------------------------------------------------
       UNIVERSAL POST POPUP — one modal, per-type layout
    --------------------------------------------------------------- */
    const postPopupModal = document.getElementById('postPopupModal');
    const postPopupContent = document.getElementById('postPopupContent');

    function popupHeaderHtml(post) {
        return `
            <div class="post-popup-header">
                <div class="post-user">
                    <img src="${post.avatar}" alt="">
                    <div class="post-user-info">
                        <span class="username">${post.username} <i class="fas fa-check-circle verified"></i></span>
                        <span class="audio-info">${typeLabel(post.type)}</span>
                    </div>
                </div>
                <button class="close-modal" id="closePostPopup"><i class="fas fa-times"></i></button>
            </div>`;
    }

    function popupFooterHtml(post) {
        const caption = post.type === 'post' ? post.text : (post.caption || '');
        return `
            <div class="post-popup-actions">
                <div class="post-actions-left">
                    <button class="post-action-btn like-btn"><i class="far fa-heart"></i><span>${post.likes}</span></button>
                    <button class="post-action-btn"><i class="far fa-comment"></i><span>${post.comments}</span></button>
                    <button class="post-action-btn" id="popupShareBtn"><i class="far fa-paper-plane"></i></button>
                </div>
                <button class="post-action-btn bookmark"><i class="far fa-bookmark"></i></button>
            </div>
            <div class="post-popup-caption"><span class="caption-user">${post.username}</span> ${caption}</div>
            ${hashtagsHtml(post.hashtags)}
            <div class="post-time">${post.date}</div>`;
    }

    function openPostPopup(post) {
        let body = '';
        if (post.type === 'photo') {
            body = `<div class="popup-media popup-photo"><img src="${post.image}" alt=""></div>`;
        } else if (post.type === 'video') {
            body = `<div class="popup-media popup-video"><video src="${post.videoSrc}" poster="${post.thumb}" controls autoplay playsinline loop></video></div>`;
        } else if (post.type === 'website') {
            body = `
                <div class="popup-media popup-website">
                    <div class="browser-frame"><span class="bdot r"></span><span class="bdot y"></span><span class="bdot g"></span><span class="burl">${post.demoUrl.replace('https://', '')}</span></div>
                    <img src="${post.thumb}" alt="">
                </div>
                <div class="popup-website-info">
                    <div class="project-header"><span class="proj-title">${post.title}</span><span class="stars"><i class="fas fa-star"></i> ${(post.stars / 1000).toFixed(1)}K</span></div>
                    <p class="proj-desc">${post.desc}</p>
                    <div class="proj-tags">${post.tags.map(t => `<span>${t}</span>`).join('')}</div>
                    <div class="proj-actions">
                        <a class="proj-btn" href="${post.demoUrl}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                        <a class="proj-btn" href="${post.githubUrl}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
                    </div>
                </div>`;
        } else {
            body = `<div class="popup-media popup-text" style="background:${post.gradient}"><p>${post.text}</p></div>`;
        }

        postPopupContent.innerHTML = popupHeaderHtml(post) + body + popupFooterHtml(post);
        openModal('postPopupModal');

        postPopupContent.querySelector('#closePostPopup').addEventListener('click', closePostPopup);
        const likeBtn = postPopupContent.querySelector('.like-btn');
        if (likeBtn) likeBtn.addEventListener('click', () => toggleLike(likeBtn));
        const bookmarkBtn = postPopupContent.querySelector('.bookmark');
        if (bookmarkBtn) bookmarkBtn.addEventListener('click', () => toggleBookmark(bookmarkBtn));
        const shareBtn = postPopupContent.querySelector('#popupShareBtn');
        if (shareBtn) shareBtn.addEventListener('click', () => openShareSheet(post.title || post.username, shareUrlFor(post)));
        postPopupContent.querySelectorAll('.hashtag-pill').forEach(pill => {
            pill.addEventListener('click', () => { closePostPopup(); goToHashtagSearch(pill.dataset.tag); });
        });
    }

    function closePostPopup() {
        const video = postPopupContent.querySelector('video');
        if (video) video.pause();
        closeModal('postPopupModal');
    }
    window.openPostPopup = openPostPopup;
    window.closePostPopup = closePostPopup;

    /* ---------------------------------------------------------------
       TAGGED BLOG POPUP — full blog-post layout + media gallery + add media
    --------------------------------------------------------------- */
    const blogPopupContent = document.getElementById('blogPopupContent');

    function mediaGalleryItemHtml(m, i) {
        if (m.type === 'photo') return `<div class="gallery-item" data-idx="${i}"><img src="${m.src}" alt=""></div>`;
        if (m.type === 'video') return `<div class="gallery-item gallery-video" data-idx="${i}"><img src="${m.poster}" alt=""><i class="fas fa-play"></i></div>`;
        return `<a class="gallery-item gallery-link" href="${m.url}" target="_blank" rel="noopener" data-idx="${i}"><i class="fas fa-link"></i><span>${m.label}</span></a>`;
    }

    function renderBlogPopup(post) {
        blogPopupContent.innerHTML = `
            <div class="blog-popup-close-row">
                <button class="close-modal" id="closeBlogPopup"><i class="fas fa-times"></i></button>
            </div>
            <div class="blog-popup-scroll">
                <h1 class="blog-title">${post.title}</h1>
                <h3 class="blog-subtitle">${post.subtitle}</h3>
                <div class="blog-media-gallery" id="blogMediaGallery">
                    ${post.media.map(mediaGalleryItemHtml).join('')}
                    <button class="gallery-item gallery-add" id="addMediaBtn"><i class="fas fa-plus"></i><span>Add media</span></button>
                </div>
                <p class="blog-media-text">${post.mediaText}</p>
                <p class="blog-description">${post.description}</p>
                <div class="blog-meta-row">
                    <span class="blog-date"><i class="far fa-calendar"></i> ${post.date}</span>
                </div>
                ${hashtagsHtml(post.hashtags)}
                <div class="blog-share-row">
                    <span class="blog-share-label">Share this post</span>
                    <button class="blog-share-btn" id="blogShareBtn"><i class="far fa-paper-plane"></i> Share</button>
                </div>
                <div class="add-media-panel" id="addMediaPanel" style="display:none;">
                    <button data-add="photo"><i class="fas fa-image"></i> Photo URL</button>
                    <button data-add="video"><i class="fas fa-video"></i> Video URL</button>
                    <button data-add="link"><i class="fas fa-link"></i> Link</button>
                </div>
            </div>`;

        blogPopupContent.querySelector('#closeBlogPopup').addEventListener('click', closeBlogPopup);
        blogPopupContent.querySelector('#blogShareBtn').addEventListener('click', () => openShareSheet(post.title, `https://creative.dev/journal/${post.id}`));

        const gallery = blogPopupContent.querySelector('#blogMediaGallery');
        gallery.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item:not(.gallery-add):not(.gallery-link)');
            if (!item) return;
            const idx = parseInt(item.dataset.idx, 10);
            const m = post.media[idx];
            if (m.type === 'photo') openPostPopup({ id: 'gallery-' + post.id + '-' + idx, type: 'photo', username: post.title, avatar: post.coverThumb, image: m.src, thumb: m.src, likes: '', comments: '', hashtags: post.hashtags, date: post.date, caption: post.mediaText });
            if (m.type === 'video') openPostPopup({ id: 'gallery-' + post.id + '-' + idx, type: 'video', username: post.title, avatar: post.coverThumb, videoSrc: m.src, thumb: m.poster, likes: '', comments: '', hashtags: post.hashtags, date: post.date, caption: post.mediaText });
        });

        const addBtn = blogPopupContent.querySelector('#addMediaBtn');
        const addPanel = blogPopupContent.querySelector('#addMediaPanel');
        addBtn.addEventListener('click', () => {
            addPanel.style.display = addPanel.style.display === 'none' ? 'flex' : 'none';
        });
        addPanel.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add]');
            if (!btn) return;
            const kind = btn.dataset.add;
            if (kind === 'link') {
                const url = prompt('Paste a link URL:');
                if (url) { post.media.push({ type: 'link', url, label: 'Shared link' }); renderBlogPopup(post); }
            } else {
                const url = prompt(`Paste a ${kind} URL:`);
                if (url) {
                    post.media.push(kind === 'photo' ? { type: 'photo', src: url } : { type: 'video', src: url, poster: post.coverThumb });
                    renderBlogPopup(post);
                }
            }
        });
    }

    function openBlogPopup(post) {
        renderBlogPopup(post);
        openModal('blogPopupModal');
    }
    function closeBlogPopup() {
        blogPopupContent.querySelectorAll('video').forEach(v => v.pause());
        closeModal('blogPopupModal');
    }
    window.openBlogPopup = openBlogPopup;
    window.closeBlogPopup = closeBlogPopup;
}