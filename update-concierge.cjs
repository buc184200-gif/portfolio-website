const fs = require('fs');

const css = `
/* --- Premium AI Concierge Styles --- */
#ai-concierge-container {
    position: fixed;
    z-index: 9999;
    top: 0; left: 0; width: 100vw; height: 100vh;
    pointer-events: none;
    overflow: hidden;
}

#ai-concierge-orb-wrapper {
    position: absolute;
    top: 0; left: 0;
    width: 64px; height: 64px;
    border-radius: 50%;
    background: rgba(10, 15, 10, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(196, 168, 130, 0.3);
    box-shadow: 0 10px 40px rgba(196, 168, 130, 0.1), inset 0 0 20px rgba(196, 168, 130, 0.05);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; pointer-events: auto;
    opacity: 0;
    transform-origin: center;
    will-change: transform;
    transition: width 0.4s ease, height 0.4s ease, border-radius 0.4s ease, box-shadow 0.4s ease;
}

#ai-concierge-orb-wrapper.visible {
    opacity: 1;
}

#ai-concierge-orb-wrapper:hover {
    box-shadow: 0 15px 50px rgba(196, 168, 130, 0.25), inset 0 0 30px rgba(196, 168, 130, 0.15);
}

.ai-particles {
    position: absolute;
    top: 50%; left: 50%;
    width: 160px; height: 160px;
    pointer-events: none; z-index: -1;
    background: radial-gradient(circle, rgba(196, 168, 130, 0.2) 0%, rgba(0,0,0,0) 70%);
    animation: aiParticlePulse 4s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}

@keyframes aiParticlePulse {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
}

#ai-concierge-orb {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #fff, rgba(196, 168, 130, 0.8));
    box-shadow: 0 0 20px rgba(196, 168, 130, 0.6), 0 0 40px rgba(196, 168, 130, 0.2);
    position: relative; overflow: hidden;
    will-change: transform;
}

#ai-concierge-orb::after {
    content: ''; position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(circle at 70% 70%, rgba(0,0,0,0.5), transparent);
}

/* Chat Panel */
#ai-chat-panel {
    position: absolute;
    top: 0; left: 0;
    width: 380px; height: 550px;
    max-height: calc(100vh - 40px);
    max-width: calc(100vw - 40px);
    background: rgba(12, 16, 12, 0.85);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(196, 168, 130, 0.2);
    border-radius: 24px;
    z-index: 9998;
    display: flex; flex-direction: column;
    opacity: 0; pointer-events: none;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    overflow: hidden;
    will-change: transform, opacity;
}

#ai-chat-panel.active {
    opacity: 1; pointer-events: auto;
}

#ai-chat-header {
    padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 15px;
}
.ai-header-dot { width: 8px; height: 8px; background: #c4a882; border-radius: 50%; box-shadow: 0 0 10px #c4a882; }
.ai-header-title { color: #e8ece4; font-size: 1rem; font-weight: 500; letter-spacing: 1px; }
.ai-header-status { color: rgba(232, 236, 228, 0.5); font-size: 0.75rem; margin-top: 2px; }

#ai-chat-messages {
    flex: 1; overflow-y: auto; padding: 20px;
    display: flex; flex-direction: column; gap: 15px; scroll-behavior: smooth;
    pointer-events: auto;
}
#ai-chat-messages::-webkit-scrollbar { width: 4px; }
#ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(196, 168, 130, 0.3); border-radius: 4px; }

.ai-msg {
    max-width: 85%; padding: 12px 16px; border-radius: 16px;
    font-size: 0.9rem; line-height: 1.5; word-wrap: break-word;
    opacity: 0; transform: translateY(10px);
    animation: msgFadeIn 0.4s forwards cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes msgFadeIn { to { opacity: 1; transform: translateY(0); } }
.ai-msg.agent { background: rgba(255, 255, 255, 0.05); color: #e8ece4; align-self: flex-start; border-top-left-radius: 4px; }
.ai-msg.user { background: rgba(196, 168, 130, 0.15); color: #fff; align-self: flex-end; border-top-right-radius: 4px; border: 1px solid rgba(196, 168, 130, 0.3); }

.ai-typing { display: flex; gap: 4px; padding: 8px 0; }
.ai-typing span { width: 6px; height: 6px; background: rgba(196, 168, 130, 0.6); border-radius: 50%; animation: typing 1.4s infinite ease-in-out both; }
.ai-typing span:nth-child(1) { animation-delay: -0.32s; }
.ai-typing span:nth-child(2) { animation-delay: -0.16s; }
@keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

#ai-chat-input-area {
    padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; gap: 10px; background: rgba(0,0,0,0.2); pointer-events: auto;
}
#ai-chat-input {
    flex: 1; background: transparent; border: none; color: #e8ece4; font-size: 0.95rem; outline: none; font-family: 'Inter', sans-serif;
}
#ai-chat-input::placeholder { color: rgba(232, 236, 228, 0.3); }
#ai-chat-submit {
    background: transparent; border: none; color: #c4a882; cursor: pointer;
    display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 50%; transition: background 0.3s;
}
#ai-chat-submit:hover { background: rgba(196, 168, 130, 0.1); }

/* Tooltip/Suggestion Bubble */
#ai-suggestion {
    position: absolute;
    top: -50px; right: 0;
    background: rgba(10, 15, 10, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(196, 168, 130, 0.3); color: #e8ece4;
    padding: 10px 16px; border-radius: 12px; font-size: 0.85rem;
    white-space: nowrap; pointer-events: none;
    opacity: 0; transform: translateY(10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}
#ai-suggestion.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 768px) {
    #ai-chat-panel { width: calc(100vw - 40px); height: 450px; }
    #ai-concierge-orb-wrapper { width: 50px; height: 50px; }
    #ai-concierge-orb { width: 18px; height: 18px; }
    #ai-suggestion { font-size: 0.75rem; padding: 8px 12px; }
}
\`;

const js = \`
const AICierge = (() => {
    let initialized = false;
    let orbWrapper, orb, chatPanel, messagesContainer, inputField, submitBtn, suggestionBubble;
    
    // Physics & Positioning
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
        requestAnimationFrame(physicsLoop);
    };

    const injectHTML = () => {
        if(document.getElementById('ai-concierge-container')) return;
        const html = \\\`
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
                    <div id="ai-chat-messages">
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
                    <div id="ai-concierge-orb"></div>
                    <div id="ai-suggestion">Hello.</div>
                </div>
            </div>
        \\\`;
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
        orbWrapper.style.transform = \\\`translate3d(\\\${currentX}px, \\\${currentY}px, 0) scale(0)\\\`;
        setTimeout(() => {
            orbWrapper.classList.add('visible');
            gsap.to(orbWrapper, {
                scale: 1,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            });
        }, 500);
        resetIdle();
    };

    const physicsLoop = () => {
        if (!isChatOpen) {
            // Determine target position based on context & device
            const padding = window.innerWidth < 768 ? 20 : 40;
            const size = window.innerWidth < 768 ? 50 : 64;
            
            let destX = window.innerWidth - size - padding;
            let destY = window.innerHeight - size - padding;

            if (isIdle) {
                // Drift slightly inward to grab attention
                destX -= 20;
                destY -= 20;
            }

            // Adjust for active context
            if (activeContext === 'projects') {
                destY = window.innerHeight / 2; // Move to middle right
            } else if (activeContext === 'contact') {
                destX = window.innerWidth / 2 - size / 2; // Center bottom
                destY = window.innerHeight - size - padding - 20;
            }

            // Influence by scroll velocity (spring physics)
            destY += Math.min(Math.max(scrollVelocity * 0.5, -100), 100);
            scrollVelocity *= 0.9; // dampen

            // Mouse repulsion if hovering near
            if (!isHovered) {
                const distMouse = Math.hypot(mouseX - currentX, mouseY - currentY);
                if (distMouse < 150) {
                    const angle = Math.atan2(currentY - mouseY, currentX - mouseX);
                    destX += Math.cos(angle) * 50;
                    destY += Math.sin(angle) * 50;
                }
            }

            // LERP Position
            currentX += (destX - currentX) * 0.08;
            currentY += (destY - currentY) * 0.08;
            
            // Constrain
            currentX = Math.max(padding, Math.min(window.innerWidth - size - padding, currentX));
            currentY = Math.max(padding, Math.min(window.innerHeight - size - padding, currentY));

            orbWrapper.style.transform = \\\`translate3d(\\\${currentX}px, \\\${currentY}px, 0) scale(\\\${isHovered ? 1.05 : 1})\\\`;

            // Orb Rotation/Orientation LERP
            let targetRotX = scrollVelocity * 0.2; 
            let targetRotY = (mouseX - currentX) * 0.05;
            
            orbRotX += (targetRotX - orbRotX) * 0.1;
            orbRotY += (targetRotY - orbRotY) * 0.1;
            
            orb.style.transform = \\\`rotateX(\\\${orbRotX}deg) rotateY(\\\${orbRotY}deg)\\\`;
            
            // Breathing
            const breathe = Math.sin(Date.now() * 0.002) * 2;
            orb.style.boxShadow = \\\`0 \\\${breathe}px \\\${20 + breathe*2}px rgba(196, 168, 130, 0.6), 0 0 40px rgba(196, 168, 130, 0.2)\\\`;

        } else {
            // Chat is open, agent is anchored to chat panel
            // Chat panel stays centered or bottom right
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
            
            // Move Orb to chat header
            gsap.to(orbWrapper, {
                x: window.innerWidth < 768 ? pWidth - 20 : window.innerWidth - 80,
                y: window.innerWidth < 768 ? 20 : window.innerHeight - pHeight - 60,
                scale: 0,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            });

            setTimeout(() => inputField.focus(), 600);
            
        } else {
            chatPanel.classList.remove('active');
            
            // Hide panel
            gsap.to(chatPanel, {
                x: currentX,
                y: currentY,
                scale: 0.2,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            });
            
            // Bring Orb back
            gsap.to(orbWrapper, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                delay: 0.2,
                ease: "elastic.out(1, 0.5)"
            });
        }
    };

    const addMessage = (text, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = \\\`ai-msg \\\${sender}\\\`;
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
            
            if (data.text) {
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
\`;

fs.writeFileSync('public/ai-concierge.css', css);
fs.writeFileSync('public/ai-concierge.js', js);
