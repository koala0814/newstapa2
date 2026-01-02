<script type="text/javascript">
    // === GOOGLE TRANSLATE INTEGRATION ===
    // Global variables for translation state
    let isTranslated = false;
    let translateApiReady = false;

    // 1. The official Google callback function - MUST have global scope
    function googleTranslateElementInit() {
        console.log("Google Translate API initialized.");
        translateApiReady = true;
        
        // Initialize the widget but hide it
        new google.translate.TranslateElement({
            pageLanguage: 'mn',
            includedLanguages: 'en,mn',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false // Prevents the default dropdown from showing
        }, 'google_translate_element');
        
        // Update button state based on current language
        updateTranslateButton();
    }

    // 2. Function to manually trigger translation
    function triggerTranslation(targetLang) {
        if (!translateApiReady || typeof google === 'undefined') {
            console.error("Google Translate API not loaded yet.");
            alert("The translation service is still loading. Please wait a moment and try again.");
            return false;
        }

        try {
            // Access the select dropdown created by Google
            const selectField = document.querySelector('.goog-te-combo');
            if (selectField) {
                selectField.value = targetLang;
                // This event triggers the actual page translation
                selectField.dispatchEvent(new Event('change'));
                
                // Update our interface state
                isTranslated = (targetLang === 'en');
                updateTranslateButton();
                return true;
            } else {
                console.error("Google Translate dropdown not found in page.");
                // Fallback: try to force a re-initialization
                setTimeout(() => {
                    if (document.getElementById('google_translate_element').innerHTML === '') {
                        location.reload(); // Last resort reload
                    }
                }, 500);
                return false;
            }
        } catch (error) {
            console.error("Error during translation:", error);
            alert("A translation error occurred. Please refresh the page.");
            return false;
        }
    }

    // 3. Update our custom button's text and appearance
    function updateTranslateButton() {
        const translateBtn = document.getElementById('translateBtn');
        if (!translateBtn) return;
        
        if (isTranslated) {
            translateBtn.innerHTML = '<i class="fas fa-language"></i><span>Монгол</span>';
            translateBtn.title = "Click to switch back to Mongolian";
        } else {
            translateBtn.innerHTML = '<i class="fas fa-language"></i><span>English</span>';
            translateBtn.title = "Click to translate to English";
        }
    }

    // === YOUR EXISTING WEBSITE FUNCTIONALITY ===
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Section navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section id
            const targetSectionId = link.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(targetSectionId).classList.add('active');
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Scroll to top when switching sections
            window.scrollTo(0, 0);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // === TRANSLATE BUTTON SETUP ===
    // Fixed button click handler
    document.addEventListener('DOMContentLoaded', function() {
        const translateBtn = document.getElementById('translateBtn');
        if (translateBtn) {
            translateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetLang = isTranslated ? 'mn' : 'en';
                triggerTranslation(targetLang);
            });
        }
        
        // Re-initialize translation when switching SPA sections
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Small delay to allow new section to render
                setTimeout(() => {
                    if (translateApiReady && isTranslated) {
                        updateTranslateButton();
                    }
                }, 100);
            });
        });
    });

    // YouTube video placeholder click
    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoTitle = this.closest('.article-video').querySelector('.video-title').textContent;
            alert(`Та "${videoTitle}" видеог YouTube суваг дээрээс үзэх болномжтой. \n\nХолбоос: https://youtube.com/@budragchaaser`);
        });
    });

    // 5. Periodically check if Google Translate loaded (fallback)
    let loadAttempts = 0;
    const checkTranslateLoaded = setInterval(() => {
        if (typeof google !== 'undefined' && google.translate && translateApiReady) {
            console.log("Google Translate confirmed loaded.");
            clearInterval(checkTranslateLoaded);
        } else if (loadAttempts > 20) { // 10 second timeout
            console.warn("Google Translate failed to load.");
            clearInterval(checkTranslateLoaded);
            const btn = document.getElementById('translateBtn');
            if (btn) {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Service Offline</span>';
                btn.style.backgroundColor = '#999';
                btn.disabled = true;
                btn.title = "Translation service unavailable";
            }
        }
        loadAttempts++;
    }, 500);
</script>

<!-- KEEP THIS LINE EXACTLY AS IS - Google's script file -->
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>