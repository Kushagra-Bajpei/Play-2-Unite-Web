// Configuration
const API_BASE_URL = 'https://play-2-unite-web-2vl6.vercel.app/api/v1';

// Notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    if (type === 'success') notification.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    if (type === 'error') notification.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
    if (type === 'info') notification.style.background = 'linear-gradient(45deg, var(--primary), var(--primary-light))';
    
    document.body.appendChild(notification);
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Three.js Galaxy Background
    const galaxyContainer = document.getElementById('galaxy-bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    galaxyContainer.appendChild(renderer.domElement);

    // Create galaxy particles
    const particles = 50000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    const sizes = new Float32Array(particles);

    const colorCenter = new THREE.Color(0xFF5722);
    const colorMid = new THREE.Color(0x9C27B0);
    const colorOuter = new THREE.Color(0x0D47A1);

    // Create spiral galaxy pattern
    for (let i = 0; i < particles; i++) {
        const radius = Math.pow(Math.random(), 2) * 20;
        const angle = Math.random() * Math.PI * 2;
        const armOffset = Math.floor(Math.random() * 5) * (Math.PI * 2 / 5);
        const spiralFactor = 0.8;
        
        positions[i * 3] = radius * Math.cos(angle + armOffset + radius * spiralFactor) * (0.8 + Math.random() * 0.4);
        positions[i * 3 + 1] = radius * Math.sin(angle + armOffset + radius * spiralFactor) * (0.8 + Math.random() * 0.4);
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        let particleColor;
        if (radius < 5) {
            particleColor = colorCenter.clone().lerp(colorMid, radius/5);
        } else {
            particleColor = colorMid.clone().lerp(colorOuter, (radius-5)/15);
        }
        
        particleColor.offsetHSL(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.2
        );
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        sizes[i] = (Math.random() * 0.5 + 0.5) * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // Add bright stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(2000 * 3);
    const starSizes = new Float32Array(2000);
    
    for (let i = 0; i < 2000; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 3000;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 3000;
        starSizes[i] = Math.random() * 2 + 1;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 1,
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 30;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.0001;
        galaxy.rotation.x = time * 0.1;
        galaxy.rotation.y = time * 0.2;
        starMaterial.size = 0.5 + Math.sin(time * 3) * 0.5;
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href').startsWith('#') && !this.getAttribute('href').startsWith('#gallery')) {
                e.preventDefault();
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });           

    // Header scroll effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/contact/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification(data.message || 'Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showNotification(data.error || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showNotification('Network error. Please check your connection and try again.', 'error');
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // Join Community button
    const joinCommunityBtn = document.getElementById('join-community-btn');
    if (joinCommunityBtn) {
        joinCommunityBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                const contactNavLink = document.querySelector('nav a[href="#contact"]');
                if (contactNavLink) contactNavLink.classList.add('active');
            }
        });
    }

    // Upcoming Events button
    const upcomingEventsBtn = document.getElementById('upcoming-events-btn');
    if (upcomingEventsBtn) {
        upcomingEventsBtn.addEventListener('click', function() {
            const eventsSection = document.getElementById('events');
            if (eventsSection) {
                window.scrollTo({
                    top: eventsSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                const eventsNavLink = document.querySelector('nav a[href="#events"]');
                if (eventsNavLink) eventsNavLink.classList.add('active');
            }
        });
    }

    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-title, .about-text p, .event-card, .team-member, .activity-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.animationPlayState = 'running';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});