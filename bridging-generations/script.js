'use strict';

(function () {
    var themeButton = document.querySelector('[data-theme-toggle]');
    var themeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var root = document.documentElement;

    function updateThemeButton(isDark) {
        themeButton.setAttribute('aria-pressed', String(isDark));
    }

    if (themeButton) {
        var savedTheme = root.getAttribute('data-theme');
        var isDark = savedTheme ? savedTheme === 'dark' : Boolean(themeMedia && themeMedia.matches);
        updateThemeButton(isDark);

        themeButton.addEventListener('click', function () {
            isDark = themeButton.getAttribute('aria-pressed') !== 'true';
            var selectedTheme = isDark ? 'dark' : 'light';
            root.setAttribute('data-theme', selectedTheme);
            updateThemeButton(isDark);

            try {
                localStorage.setItem('meriise-theme', selectedTheme);
            } catch (error) {
                // Keep the selection active for this page view when storage is unavailable.
            }
        });

        if (themeMedia) {
            var handleSystemThemeChange = function (event) {
                if (!root.hasAttribute('data-theme')) {
                    isDark = event.matches;
                    updateThemeButton(isDark);
                }
            };

            if (typeof themeMedia.addEventListener === 'function') {
                themeMedia.addEventListener('change', handleSystemThemeChange);
            } else if (typeof themeMedia.addListener === 'function') {
                themeMedia.addListener(handleSystemThemeChange);
            }
        }
    }

    var watchBtn = document.getElementById('watch-talk-btn');
    var modal = document.getElementById('live-modal');
    var modalDialog = modal.querySelector('[role="dialog"]');
    var closeSelectors = '[data-modal-close]';
    var lastFocusedElement = null;

    function getFocusableElements(container) {
        return container.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
    }

    function openModal(trigger) {
        lastFocusedElement = trigger || document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalDialog.focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    modal.addEventListener('click', function (event) {
        if (event.target.matches(closeSelectors)) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (!modal.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            closeModal();
            return;
        }

        if (event.key !== 'Tab') return;

        var focusable = getFocusableElements(modalDialog);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;

        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    });

    if (watchBtn) {
        watchBtn.addEventListener('click', function (event) {
            event.preventDefault();
            openModal(watchBtn);
        });
    }

    // Reveal talk cards as they scroll into view.
    var cards = Array.prototype.slice.call(document.querySelectorAll('.talk-card'));
    if ('IntersectionObserver' in window && cards.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var card = entry.target;
                    var index = cards.indexOf(card);
                    card.style.transitionDelay = String(index * 90) + 'ms';
                    card.classList.add('is-visible');
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.2 });

        cards.forEach(function (card) {
            observer.observe(card);
        });
    } else {
        cards.forEach(function (card) {
            card.classList.add('is-visible');
        });
    }

    // Add a subtle shadow to the sticky header once the page scrolls.
    var header = document.getElementById('site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Mobile full-screen nav overlay
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.getElementById('primary-nav');

    if (navToggle && navMenu) {
        var openNav = function () {
            navMenu.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            var firstLink = navMenu.querySelector('a, button');
            if (firstLink) firstLink.focus();
        };

        var closeNav = function () {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        navToggle.addEventListener('click', openNav);

        navMenu.addEventListener('click', function (event) {
            if (event.target.closest('[data-nav-close]')) {
                closeNav();
                if (navToggle.getAttribute('aria-expanded') === 'false') {
                    navToggle.focus();
                }
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
                closeNav();
                navToggle.focus();
            }
        });
    }

    // Wire a video cover to reveal/autoplay its embedded iframe
    function setupVideoCover(coverId, iframeId) {
        var videoCover = document.getElementById(coverId);
        var videoIframe = document.getElementById(iframeId);
        if (!videoCover || !videoIframe) return;

        var playVideo = function (event) {
            // Support both click and keyboard (Enter/Space)
            if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
                return;
            }
            event.preventDefault();

            var src = videoIframe.src;
            // Only add autoplay if not already present
            if (src.indexOf('autoplay=1') === -1) {
                videoIframe.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
            }
            // Hide the cover to reveal the iframe
            videoCover.style.display = 'none';
        };

        videoCover.addEventListener('click', playVideo);
        videoCover.addEventListener('keydown', playVideo);
    }

    setupVideoCover('latest-video-cover', 'latest-video-iframe');
    setupVideoCover('featured-video-cover', 'featured-video-iframe');
    setupVideoCover('drive-video-cover', 'drive-video-iframe');
    setupVideoCover('nagashankar-video-cover', 'nagashankar-video-iframe');
})();
