// Galaxy background from the main Play 2 Unite page
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

        // Create galaxy particles (increased count for richer effect)
        const particles = 50000;
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const sizes = new Float32Array(particles);

        const colorCenter = new THREE.Color(0xFF5722); // Orange center
        const colorMid = new THREE.Color(0x9C27B0);    // Purple middle
        const colorOuter = new THREE.Color(0x0D47A1);  // Blue outer

        // Create spiral galaxy pattern
        for (let i = 0; i < particles; i++) {
            // Spiral distribution
            const radius = Math.pow(Math.random(), 2) * 20;
            const angle = Math.random() * Math.PI * 2;
            const armOffset = Math.floor(Math.random() * 5) * (Math.PI * 2 / 5);
            const spiralFactor = 0.8;
            
            // 3D position with some randomness
            positions[i * 3] = radius * Math.cos(angle + armOffset + radius * spiralFactor) * (0.8 + Math.random() * 0.4);
            positions[i * 3 + 1] = radius * Math.sin(angle + armOffset + radius * spiralFactor) * (0.8 + Math.random() * 0.4);
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // Color gradient
            let particleColor;
            if (radius < 5) {
                particleColor = colorCenter.clone().lerp(colorMid, radius/5);
            } else {
                particleColor = colorMid.clone().lerp(colorOuter, (radius-5)/15);
            }
            
            // Add some color variation
            particleColor.offsetHSL(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.2
            );
            
            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
            
            // Size variation
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

        // Animation with varying speed for more dynamic effect
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate galaxy with varying speed
            const time = Date.now() * 0.0001;
            galaxy.rotation.x = time * 0.1;
            galaxy.rotation.y = time * 0.2;
            
            // Pulsing effect for stars
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

        // Smooth scrolling only for same-page links
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                // Only prevent default for anchor links, not for page links
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
                    
                    // Update active nav item
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

        // Scroll animations
        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.section-title, .team-member');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.animationPlayState = 'running';
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Run once on load

        // Domain Filter Functionality
        const domainButtons = document.querySelectorAll('.domain-btn');
        const teamMembers = document.querySelectorAll('.team-member');
        const teamHeading = document.getElementById('team-heading');

        // Map domain names to display names
        const domainDisplayNames = {
            'all': 'Our Team',
            'leadership': 'Our Leadership',
            'events': 'Events Team',
            'finance': 'Finance Team',
            'marketing': 'Marketing Team',
            'creative': 'Creative Team'
        };

        // Function to update the heading based on the active domain
        function updateTeamHeading(domain) {
            teamHeading.textContent = domainDisplayNames[domain];
            
            // Add animation effect to heading
            teamHeading.style.opacity = '0';
            teamHeading.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                teamHeading.style.opacity = '1';
                teamHeading.style.transform = 'translateY(0)';
            }, 300);
        }

        // Initialize the heading based on the active button
        function initializeTeamHeading() {
            const activeButton = document.querySelector('.domain-btn.active');
            if (activeButton) {
                const domain = activeButton.getAttribute('data-domain');
                updateTeamHeading(domain);
            }
        }

        // Call the initialization function when the page loads
        document.addEventListener('DOMContentLoaded', initializeTeamHeading);

        domainButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                domainButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const domain = this.getAttribute('data-domain');
                
                // Update the heading
                updateTeamHeading(domain);
                
                // Filter team members
                teamMembers.forEach(member => {
                    if (domain === 'all' || member.getAttribute('data-domain') === domain) {
                        member.style.display = 'block';
                        // Trigger animation
                        member.style.animation = 'fadeIn 0.8s ease forwards';
                    } else {
                        member.style.display = 'none';
                    }
                });
            });
        });