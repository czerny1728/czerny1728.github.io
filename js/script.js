const header = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');

let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
    const currentScrollY = window.scrollY;

    // Condense or expand nav
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('condensed');
    } else if (currentScrollY < lastScrollY) {
        header.classList.remove('condensed');
    }

    lastScrollY = currentScrollY;

    // Highlight nav links
    const fromTop = currentScrollY + 100;
    navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.glass, .dark-glass').forEach(card => {
    observer.observe(card);
});

// Toggle button for menu nav behavior
menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);

    if (!expanded) {
        header.classList.remove('condensed');
    } else {
        header.classList.add('condensed');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function setupSkillsObserver(container) {
    const categories = container.querySelectorAll('.skills-category');

    const categoryObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const nextDivider = entry.target.nextElementSibling;
                if (nextDivider && nextDivider.classList.contains('category-divider')) {
                    nextDivider.classList.add('visible');
                }

                categoryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    categories.forEach(category => {
        categoryObserver.observe(category);
    });
}

function loadSection(containerId, file) {
    fetch(file)
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById(containerId);
            container.innerHTML = html;
            lucide.createIcons();

            document.querySelectorAll(`#${containerId} .glass, #${containerId} .dark-glass`).forEach(card => {
                observer.observe(card);
            });

            if (containerId === 'skills-container') {
                setupSkillsObserver(container);
            }

            if (containerId === 'contact-container') {
                const contactForm = container.querySelector('.contact-form');
                if (contactForm) {
                    contactForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        lucide.createIcons();

                        const sendLabel = contactForm.querySelector('.send-label');
                        const dots = contactForm.querySelector('.sending-dots');
                        const sendButton = contactForm.querySelector('.glass-submit');
                        const email = contactForm.email.value.trim();
                        const message = contactForm.message.value.trim();

                        if (!email || !message) {
                            alert('Fill both fields');
                            return;
                        }

                        // Step 1: Start Sending...
                        sendLabel.textContent = 'Sending';
                        dots.classList.remove('hidden');

                        let resultIcon = 'check-circle';
                        let resultText = 'Message Sent!';

                        try {
                            const response = await fetch('https://czerny1728-github-io.onrender.com/api/contact', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email, message }),
                            });

                            if (!response.ok) {
                                resultIcon = 'alert-triangle';
                                resultText = 'Sending Failed';
                            }
                        } catch (error) {
                            resultIcon = 'wifi-off';
                            resultText = 'Network Error';
                        }

                        // Step 2: Implode dots and label
                        sendLabel.classList.add('implode');
                        dots.classList.add('hidden');

                        // Step 3: Explode final message after short delay
                        setTimeout(() => {
                            sendButton.classList.add('explode');
                            sendButton.innerHTML = `<i data-lucide="${resultIcon}"></i> ${resultText}`;
                            lucide.createIcons();
                        }, 300);

                        // Step 4: Reset form after another delay
                        setTimeout(() => {
                            sendButton.classList.remove('explode');
                            sendButton.innerHTML = `
                            <i data-lucide="send" class="send-icon"></i>
                            <span class="send-label">Send</span>
                            <span class="sending-dots hidden">
                                <span class="dot">.</span>
                                <span class="dot">.</span>
                                <span class="dot">.</span>
                            </span>
                            `;
                            lucide.createIcons();
                            contactForm.reset();
                        }, 2500);
                    });
                }
            }
        })
        .catch(err => console.error(`Failed to load ${file}:`, err));
}


loadSection('projects-container', 'projects.html');
loadSection('skills-container', 'skills.html');
loadSection('education-container', 'education.html');
loadSection('contact-container', 'contact.html');

window.addEventListener('load', () => {
    document.querySelector('.profile-pic').classList.add('animate-in');
    document.querySelector('.top-nav').classList.add('animate-in');
    document.querySelector('.social-links').classList.add('animate-in');
    document.querySelector('.intro-heading').classList.add('animate-in');
    document.querySelector('.intro-subtext').classList.add('animate-in');
});
