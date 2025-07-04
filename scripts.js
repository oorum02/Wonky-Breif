// Order tracking and analytics data structure (ready for database integration)
const orderData = {
    timestamp: null,
    userEmail: '',
    userName: '',
    preferences: '',
    address: '',
    source: 'landing_page',
    conversionPath: [],
    sessionId: generateSessionId()
};

// Track user interactions for analytics
const analytics = {
    pageViews: 1,
    ctaClicks: 0,
    faqInteractions: 0,
    timeOnPage: Date.now(),
    scrollDepth: 0
};

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Modal functionality
function openOrderModal() {
    document.getElementById('orderModal').style.display = 'block';
    analytics.ctaClicks++;
    orderData.conversionPath.push({
        action: 'modal_opened',
        timestamp: Date.now()
    });
    
    // Track which CTA was clicked
    trackEvent('cta_clicked', {
        location: event.target.closest('section')?.className || 'unknown'
    });
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

// Handle form submission
function handleOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const form = event.target;
    
    // Update order data
    orderData.timestamp = Date.now();
    orderData.userEmail = formData.get('email');
    orderData.userName = formData.get('name');
    orderData.preferences = formData.get('preferences');
    orderData.address = formData.get('address');
    
    // Show loading state
    form.classList.add('loading');
    
    // Simulate API call (replace with actual backend integration)
    setTimeout(() => {
        // This is where you'd send data to your backend/database
        console.log('Order Data (ready for database):', orderData);
        console.log('Analytics Data:', analytics);
        
        // Show success message
        alert('🎉 Success! Your trial box is on its way. Check your email for confirmation.');
        
        // Reset form and close modal
        form.reset();
        form.classList.remove('loading');
        closeOrderModal();
        
        // Track conversion
        trackEvent('order_completed', orderData);
        
    }, 2000);
}

// FAQ functionality
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('span:last-child');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.textContent = '+';
    } else {
        // Close other FAQs
        document.querySelectorAll('.faq-answer.active').forEach(item => {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('span:last-child').textContent = '+';
        });
        
        answer.classList.add('active');
        icon.textContent = '−';
        analytics.faqInteractions++;
    }
}

// Scroll animations and tracking
function handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled / (document.body.scrollHeight - window.innerHeight);
    analytics.scrollDepth = Math.max(analytics.scrollDepth, Math.round(rate * 100));
    
    // Animate elements on scroll
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementVisible = 150;
        
        if (scrolled > elementTop - window.innerHeight + elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.remove('animate-on-scroll');
        } else {        
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        }           
    });
}

// Event tracking function (placeholder for analytics integration)
function trackEvent(eventName, eventData) {
    // This is where you'd integrate with your analytics service
    // (Google Analytics, Mixpanel, etc.)
    console.log('Event tracked:', eventName, eventData);
}

// Fix the openOrderModal function to handle event properly
function openOrderModal(event) {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'block';
        analytics.ctaClicks++;
        orderData.conversionPath.push({
            action: 'modal_opened',
            timestamp: Date.now()
        });

        // Track which CTA was clicked (safe fallback)
        try {
            trackEvent('cta_clicked', {
                location: event?.target?.closest('section')?.className || 'unknown'
            });
        } catch (e) {
            console.log('Event tracking failed:', e);
        }
    } else {
        console.error('Modal not found! Make sure the HTML includes the modal with ID "orderModal"');
    }
}


// Initialize scroll listener
window.addEventListener('scroll', handleScroll);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Track page load
    trackEvent('page_loaded', {
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: orderData.sessionId
    });
    
    // Initialize scroll animations
    handleScroll();
    
    // Add event listeners to all CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .header-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openOrderModal();
        });
    });
    
    // Debug: Check if modal exists
    const modal = document.getElementById('orderModal');
    if (!modal) {
        console.error('Modal HTML is missing! The form won\'t work without the modal HTML.');
    }
});