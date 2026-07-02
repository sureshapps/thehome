
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

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.dataset.page;
            if (!pageName) return;

            // Update nav active state
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding page
            Object.values(pages).forEach(p => {
                if (p) p.style.display = 'none';
            });
            if (pages[pageName]) {
                pages[pageName].style.display = 'block';
            }

            // Special handling for create page
            if (pageName === 'create') {
                document.querySelector('.create-screen').style.display = 'flex';
            }
        });
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

    // ================= REEL ACTION ANIMATION =================
    document.querySelectorAll('.reel-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon && icon.classList.contains('far') && icon.classList.contains('fa-heart')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#ff0055';
            }
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = 'scale(1)', 150);
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
                navItems.forEach(n => n.classList.remove('active'));
                document.querySelector('[data-page="home"]').classList.add('active');
                Object.values(pages).forEach(p => { if(p) p.style.display = 'none'; });
                if (pages.home) pages.home.style.display = 'block';
            }, 200);
        });
    }
});
