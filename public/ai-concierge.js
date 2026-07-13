const AICierge = (() => {
    let initialized = false;
    let orbWrapper, orb, chatPanel, messagesContainer, inputField, submitBtn, suggestionBubble;
    
    // Physics & Positioning
    
    let wanderTarget = { x: 0, y: 0 };
    let wanderTween = null;
    let pulseScale = 1;
    let pulseTween = null;
    let isChatOpen = false;

    
    // LERP targets
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let orbRotX = 0, orbRotY = 0, orbRotZ = 0;
    
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isHovered = false;
    
    let activeContext = 'general';
    let isIdle = false;
    let idleTimer = null;
    let lastSuggestionTime = 0;

    let chatHistory = [
        { role: "system", content: "You are an elite digital concierge and AI consultant for Crestiva Web Studio. Your personality is premium, professional, helpful, and concise. You represent a high-end web design agency. If a user is on the Projects page, assist them in understanding the technologies, design decisions, and business impact. If a user is on the Pricing/About page, guide them through pricing, process, and booking a consultation. Keep responses short and actionable. If the user shows buying intent, collect their Name, Business Type, Budget, and direct them to contact us via WhatsApp or hello@crestiva.com." }
    ];

    const contextMessages = {
        projects: [
            "Want to see our best performing project?",
            "This design increased engagement dramatically.",
            "Click a project to explore.",
            "Curious about the tech stack we used here?"
        ],
        pricing: [
            "Most clients choose the Growth package.",
            "Need a custom enterprise solution?",
            "Not sure which package fits your business?",
            "Let me help you compare these options."
        ],
        contact: [
            "Ready to discuss your vision?",
            "I can help you get started immediately.",
            "Drop us an email or a WhatsApp message."
        ],
        general: [
            "How can I assist your journey?",
            "Looking for something specific?",
            "Let me guide you through our studio."
        ]
    };

    
    const startWander = () => {
        if (wanderTween) wanderTween.kill();
        
        const size = window.innerWidth < 768 ? 50 : 64;
        const padding = 40;
        
        let targetX, targetY;
        let isSafe = false;
        let attempts = 0;
        
        while (!isSafe && attempts < 30) {
            attempts++;
            targetX = gsap.utils.random(padding, window.innerWidth - size - padding);
            targetY = gsap.utils.random(padding, window.innerHeight - size - padding);
            
            isSafe = true;
            const avoidEls = document.querySelectorAll('.nav, .btn-main, .gold-btn, .price-card, .builder-quote-box, form, .hero-title, .section-heading, .project-card, .footer');
            for (let el of avoidEls) {
                const rect = el.getBoundingClientRect();
                const margin = 40; 
                // Ignore elements that are far offscreen
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                
                if (targetX + size > rect.left - margin &&
                    targetX < rect.right + margin &&
                    targetY + size > rect.top - margin &&
                    targetY < rect.bottom + margin) {
                    isSafe = false;
                    break;
                }
            }
        }
        
        if (!isSafe) {
            targetX = window.innerWidth - size - padding;
            targetY = window.innerHeight - size - padding;
        }
        
        wanderTween = gsap.to(wanderTarget, {
            x: targetX,
            y: targetY,
            duration: gsap.utils.random(8, 15),
            ease: "sine.inOut",
            onComplete: startWander
        });
    };

    const triggerPulse = () => {
        if (isChatOpen || isHovered) {
            setTimeout(triggerPulse, 2000);
            return;
        }
        let pObj = { s: 1 };
        pulseTween = gsap.to(pObj, {
            s: 1.15,
            duration: 1.2,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
            onUpdate: () => { pulseScale = pObj.s; },
            onComplete: () => {
                setTimeout(triggerPulse, gsap.utils.random(4000, 8000));
            }
        });
    };

    const init = () => {
        if (initialized) return;
        initialized = true;

        injectHTML();
        cacheDOM();
        setupObserver();
        bindEvents();
        
        // Initial setup
        targetX = window.innerWidth - 80;
        targetY = window.innerHeight - 80;
        currentX = targetX;
        currentY = targetY;
        
        startEntrance();
        wanderTarget.x = targetX;
        wanderTarget.y = targetY;
        startWander();
        setTimeout(triggerPulse, 3000);
        requestAnimationFrame(physicsLoop);
    };

    const injectHTML = () => {
        if(document.getElementById('ai-concierge-container')) return;
        const html = `
            <div id="ai-concierge-container">
                <div id="ai-chat-panel">
                    <div id="ai-chat-header">
                        <div class="ai-header-dot"></div>
                        <div>
                            <div class="ai-header-title">Crestiva AI</div>
                            <div class="ai-header-status">Digital Concierge</div>
                        </div>
                        <button id="ai-chat-close" style="margin-left:auto; background:none; border:none; color:#c4a882; cursor:pointer; font-size:1.5rem; line-height:1;">&times;</button>
                    </div>
                    <div id="ai-chat-messages" data-lenis-prevent>
                        <div class="ai-msg agent">Welcome to Crestiva. I am your digital concierge. How may I assist you today?</div>
                    </div>
                    <div id="ai-chat-input-area">
                        <input type="text" id="ai-chat-input" placeholder="Ask me anything..." autocomplete="off">
                        <button id="ai-chat-submit">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
                
                <div id="ai-concierge-orb-wrapper">
                    <div class="ai-particles" id="ai-particles"></div>
                    <div id="ai-concierge-orb">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: auto; display: block;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                    <div id="ai-suggestion">Hello.</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    };

    const cacheDOM = () => {
        orbWrapper = document.getElementById('ai-concierge-orb-wrapper');
        orb = document.getElementById('ai-concierge-orb');
        chatPanel = document.getElementById('ai-chat-panel');
        messagesContainer = document.getElementById('ai-chat-messages');
        inputField = document.getElementById('ai-chat-input');
        submitBtn = document.getElementById('ai-chat-submit');
        suggestionBubble = document.getElementById('ai-suggestion');
    };

    const setupObserver = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id || entry.target.className;
                    if (id.includes('project') || id.includes('work') || id.includes('creativity')) {
                        activeContext = 'projects';
                    } else if (id.includes('pricing') || id.includes('plan')) {
                        activeContext = 'pricing';
                    } else if (id.includes('contact') || id.includes('result')) {
                        activeContext = 'contact';
                    } else {
                        activeContext = 'general';
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.section, section').forEach(sec => observer.observe(sec));
    };

    const bindEvents = () => {
        orbWrapper.addEventListener('click', toggleChat);
        document.getElementById('ai-chat-close').addEventListener('click', () => {
            if(isChatOpen) toggleChat();
        });
        
        submitBtn.addEventListener('click', handleSend);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            scrollVelocity = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
            resetIdle();
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            resetIdle();
        }, { passive: true });
        
        orbWrapper.addEventListener('mouseenter', () => isHovered = true);
        orbWrapper.addEventListener('mouseleave', () => isHovered = false);
    };

    const resetIdle = () => {
        isIdle = false;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            isIdle = true;
            triggerSuggestion();
        }, 3000); // 3 seconds idle
    };

    const triggerSuggestion = () => {
        if (isChatOpen) return;
        const now = Date.now();
        if (now - lastSuggestionTime < 10000) return; // Wait at least 10s between suggestions
        
        const msgs = contextMessages[activeContext] || contextMessages.general;
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        
        suggestionBubble.innerText = msg;
        suggestionBubble.classList.add('visible');
        lastSuggestionTime = now;
        
        setTimeout(() => {
            suggestionBubble.classList.remove('visible');
        }, 6000);
    };

    const startEntrance = () => {
        orbWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(0)`;
        setTimeout(() => {
            orbWrapper.classList.add('visible');
            if (window.gsap) {
                gsap.to(orbWrapper, {
                    scale: 1,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)"
                });
            } else {
                orbWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1)`;
            }
        }, 500);
        resetIdle();
    };

    
    const physicsLoop = () => {
        if (!isChatOpen) {
            const size = window.innerWidth < 768 ? 50 : 64;
            const padding = window.innerWidth < 768 ? 20 : 40;
            
            if (!isHovered) {
                let repX = 0, repY = 0;
                const avoidEls = document.querySelectorAll('.nav, .btn-main, .gold-btn, .price-card, .builder-quote-box, form, .hero-title, .section-heading, .project-card');
                for (let el of avoidEls) {
                    const rect = el.getBoundingClientRect();
                    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                    
                    const cx = Math.max(rect.left, Math.min(currentX + size/2, rect.right));
                    const cy = Math.max(rect.top, Math.min(currentY + size/2, rect.bottom));
                    const dist = Math.hypot(currentX + size/2 - cx, currentY + size/2 - cy);
                    
                    if (dist < 100) { 
                        const angle = Math.atan2(currentY + size/2 - cy, currentX + size/2 - cx);
                        const force = (100 - dist) * 0.05;
                        repX += Math.cos(angle) * force;
                        repY += Math.sin(angle) * force;
                    }
                }
                
                // Repulsive force from mouse
                const distMouse = Math.hypot(mouseX - (currentX + size/2), mouseY - (currentY + size/2));
                if (distMouse < 150) {
                    const angle = Math.atan2(currentY + size/2 - mouseY, currentX + size/2 - mouseX);
                    const force = (150 - distMouse) * 0.02;
                    repX += Math.cos(angle) * force;
                    repY += Math.sin(angle) * force;
                }
                
                let destX = wanderTarget.x + repX * 10;
                let destY = wanderTarget.y + repY * 10;
                
                // LERP Position
                currentX += (destX - currentX) * 0.03;
                currentY += (destY - currentY) * 0.03;
                
                // Constrain
                currentX = Math.max(padding, Math.min(window.innerWidth - size - padding, currentX));
                currentY = Math.max(padding, Math.min(window.innerHeight - size - padding, currentY));
            }
            
            const scale = pulseScale * (isHovered ? 1.05 : 1);
            
            // Add subtle floating motion (sine wave on Y)
            const floatY = Math.sin(Date.now() * 0.0015) * 8;
            
            orbWrapper.style.transform = `translate3d(${currentX}px, ${currentY + floatY}px, 0) scale(${scale})`;
            
            // Orb Rotation/Orientation LERP
            let targetRotX = (currentY - wanderTarget.y) * 0.05;
            let targetRotY = (mouseX - currentX) * 0.05;
            
            orbRotX += (targetRotX - orbRotX) * 0.1;
            orbRotY += (targetRotY - orbRotY) * 0.1;
            
            orb.style.transform = `rotateX(${orbRotX}deg) rotateY(${orbRotY}deg)`;
            
            // Breathing
            const breathe = Math.sin(Date.now() * 0.002) * 2;
            orb.style.boxShadow = `0 ${breathe}px ${20 + breathe*2}px rgba(196, 168, 130, 0.6), 0 0 40px rgba(196, 168, 130, 0.2)`;
        }
        
        requestAnimationFrame(physicsLoop);
    };

    
    const toggleChat = () => {
        isChatOpen = !isChatOpen;
        
        if (isChatOpen) {
            suggestionBubble.classList.remove('visible');
            
            const pWidth = window.innerWidth < 768 ? window.innerWidth - 40 : 380;
            const pHeight = window.innerWidth < 768 ? 450 : 550;
            const pX = window.innerWidth / 2 - pWidth / 2;
            const pY = window.innerHeight / 2 - pHeight / 2;

            if (window.gsap) {
                // Animate Panel appearing from Orb position
                gsap.set(chatPanel, { x: currentX, y: currentY, scale: 0.2, opacity: 0 });
                chatPanel.classList.add('active');
                
                gsap.to(chatPanel, {
                    x: window.innerWidth < 768 ? 20 : window.innerWidth - pWidth - 40,
                    y: window.innerWidth < 768 ? 20 : window.innerHeight - pHeight - 40,
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: "expo.out"
                });
                
                // Hide Orb (let physics loop stop rendering)
                gsap.to(orbWrapper, {
                    opacity: 0,
                    duration: 0.2
                });
                // We'll manage scale manually when it re-opens
            } else {
                chatPanel.classList.add('active');
                chatPanel.style.transform = `translate3d(${window.innerWidth < 768 ? 20 : window.innerWidth - pWidth - 40}px, ${window.innerWidth < 768 ? 20 : window.innerHeight - pHeight - 40}px, 0)`;
                orbWrapper.style.opacity = '0';
            }

            setTimeout(() => inputField.focus(), 600);
            
        } else {
            chatPanel.classList.remove('active');
            
            if (window.gsap) {
                // Hide panel back to currentX/Y
                gsap.to(chatPanel, {
                    x: currentX,
                    y: currentY,
                    scale: 0.2,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                });
                
                // Bring Orb back manually using pulseScale
                
                if (pulseTween) pulseTween.kill();
                pulseScale = 0;

                gsap.to(orbWrapper, {
                    opacity: 1,
                    duration: 0.2,
                    delay: 0.2
                });
                
                let obj = { s: 0 };
                gsap.to(obj, {
                    s: 1,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "elastic.out(1, 0.5)",
                    onUpdate: () => { pulseScale = obj.s; }
                });
            } else {
                orbWrapper.style.opacity = '1';
            }
        }
    };

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        msgDiv.innerText = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showTyping = () => {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-msg agent ai-typing-indicator';
        typingDiv.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
        typingDiv.id = 'ai-typing';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const removeTyping = () => {
        const typingDiv = document.getElementById('ai-typing');
        if (typingDiv) typingDiv.remove();
    };

    const handleSend = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = '';
        addMessage(text, 'user');
        chatHistory.push({ role: 'user', content: text });
        
        showTyping();

        try {
            const response = await fetch('/api/nvidia-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });
            
            removeTyping();
            
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            
            const text = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : null;
            if (text) {
                data.text = text;
                addMessage(data.text, 'agent');
                chatHistory.push({ role: 'assistant', content: data.text });
            } else {
                addMessage("I apologize, I'm having trouble connecting to my knowledge base right now.", 'agent');
            }
        } catch (err) {
            removeTyping();
            console.error(err);
            addMessage("Connection lost. Please try again or contact via WhatsApp.", 'agent');
        }
    };

    return { init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AICierge.init);
} else {
    AICierge.init();
}
