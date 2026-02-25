// ===== Mobile Hamburger Menu =====
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Mobile dropdown toggle
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('a');
        if (toggle && window.innerWidth <= 768) {
            toggle.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('mobile-open');
                }
            });
        }
    });

    // ===== Navbar Scroll Effect =====
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // ===== Stat Counter Animation =====
    var statNumbers = document.querySelectorAll('.stat-number[data-target]');
    var statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (!target) return;

            var suffix = el.getAttribute('data-suffix') || '+';
            var duration = 2000;
            var increment = target / (duration / 16);
            var current = 0;

            function updateNumber() {
                current += increment;
                if (current < target) {
                    el.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    el.textContent = target + suffix;
                }
            }

            updateNumber();
        });
    }

    if (statNumbers.length > 0) {
        var statsSection = statNumbers[0].closest('.stats-grid') || statNumbers[0].closest('.about-grid');
        if (statsSection) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(statsSection);
        }
    }

    // ===== Scholar Stats Counter Animation =====
    var scholarNumbers = document.querySelectorAll('.scholar-stat-number[data-target]');
    var scholarAnimated = false;

    function animateScholarCounters() {
        if (scholarAnimated) return;
        scholarAnimated = true;

        scholarNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (!target) return;

            var separator = el.getAttribute('data-separator') || '';
            var duration = 2000;
            var increment = target / (duration / 16);
            var current = 0;

            function formatNumber(num) {
                if (separator) {
                    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                }
                return num.toString();
            }

            function updateNumber() {
                current += increment;
                if (current < target) {
                    el.textContent = formatNumber(Math.floor(current));
                    requestAnimationFrame(updateNumber);
                } else {
                    el.textContent = formatNumber(target);
                }
            }

            updateNumber();
        });
    }

    if (scholarNumbers.length > 0) {
        var scholarCard = scholarNumbers[0].closest('.scholar-stats-card');
        if (scholarCard) {
            var scholarObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateScholarCounters();
                        scholarObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            scholarObserver.observe(scholarCard);
        }
    }

    // ===== Scroll Fade-in Animation =====
    var fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        var fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    }

    // ===== Dynamic Research Image Sliders =====
    var researchSections = document.querySelectorAll('.research-section[data-folder]');

    function initSlider(section) {
        var slides = section.querySelectorAll('.slide');
        var indicators = section.querySelectorAll('.indicator');
        var currentSlide = 0;

        if (slides.length <= 1) return;

        setInterval(function () {
            slides[currentSlide].classList.remove('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
        }, 4000);

        indicators.forEach(function (indicator, index) {
            indicator.addEventListener('click', function () {
                slides[currentSlide].classList.remove('active');
                indicators[currentSlide].classList.remove('active');
                currentSlide = index;
                slides[currentSlide].classList.add('active');
                indicators[currentSlide].classList.add('active');
            });
        });
    }

    researchSections.forEach(function (section) {
        var folderNum = section.getAttribute('data-folder');
        var slidesContainer = section.querySelector('.research-slider .slides');
        var indicatorContainer = section.querySelector('.slider-indicators');
        var sliderEl = section.querySelector('.research-slider');

        if (!slidesContainer || !indicatorContainer) return;

        var imgIndex = 1;
        var loadedCount = 0;
        var formats = ['.png', '.jpg', '.jpeg', '.webp'];

        function tryLoadImage() {
            var basePath = 'images/research/' + folderNum + '/' + imgIndex;
            var formatIdx = 0;

            function tryFormat() {
                if (formatIdx >= formats.length) {
                    // No more formats to try, done loading
                    if (loadedCount > 1) initSlider(section);
                    if (loadedCount === 0 && sliderEl) sliderEl.style.display = 'none';
                    return;
                }

                var img = new Image();
                img.onload = function () {
                    var slide = document.createElement('div');
                    slide.className = 'slide' + (loadedCount === 0 ? ' active' : '');
                    slide.appendChild(img);
                    slidesContainer.appendChild(slide);

                    var indicator = document.createElement('span');
                    indicator.className = 'indicator' + (loadedCount === 0 ? ' active' : '');
                    indicatorContainer.appendChild(indicator);

                    loadedCount++;
                    imgIndex++;
                    tryLoadImage();
                };
                img.onerror = function () {
                    formatIdx++;
                    tryFormat();
                };
                img.src = basePath + formats[formatIdx];
            }

            tryFormat();
        }

        tryLoadImage();
    });

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var offset = 80;
                var top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
});
