const main = document.getElementById('main');
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const btn = document.getElementById('btn');
const modal = document.getElementById('modal');
let started = false;
let attachedFile = null;
let promptCount = 0;
let maxPrompts = Math.floor(Math.random() * 6) + 15; // Random between 15-20

function showNewChatModal() {
    modal.classList.add('show');
}

function hideModal() {
    modal.classList.remove('show');
}

function newChat() {
    chat.innerHTML = '';
    main.style.display = 'flex';
    chat.classList.remove('active');
    started = false;
    input.value = '';
    promptCount = 0;
    maxPrompts = Math.floor(Math.random() * 6) + 15;
    document.querySelector('.input-box').classList.remove('disabled');
    hideModal();
}

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    attachedFile = file;
    
    // Show file preview
    const fileType = file.type.includes('image') ? '🖼️' : '📄';
    const preview = document.getElementById('filePreview');
    preview.innerHTML = `
        <div class="file-preview">
            <span>${fileType}</span>
            <span class="file-preview-name">${file.name}</span>
            <div class="remove-file" onclick="removeFile()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </div>
        </div>
    `;
    
    input.focus();
    e.target.value = '';
}

function removeFile() {
    attachedFile = null;
    document.getElementById('filePreview').innerHTML = '';
}

function send() {
    const text = input.value.trim();
    if (!text && !attachedFile) return;
    
    promptCount++;
    
    btn.disabled = true;
    input.disabled = true;
    
    // Build message content
    let messageContent = '';
    let level = 0;
    
    if (attachedFile) {
        const fileType = attachedFile.type.includes('image') ? '🖼️' : '📄';
        messageContent += `${fileType} ${attachedFile.name}`;
        
        // Calculate complexity from file
        level = Math.floor(attachedFile.size / 50000) + 5;
        if (attachedFile.type.includes('pdf')) level += 5;
        if (attachedFile.type.includes('image')) level += 2;
        
        if (text) messageContent += '\n' + text;
    } else {
        messageContent = text;
    }
    
    // Add user message
    add(messageContent, true);
    
    // Calculate text complexity and combine with file complexity
    if (text) {
        level += complexity(text);
    }
    
    level = Math.max(2, Math.min(25, level));
    
    const delay = 500 + (level * 100);
    
    // Clear inputs
    input.value = '';
    removeFile();
    
    thinking();
    
    setTimeout(() => {
        document.getElementById('thinking')?.remove();
        add(generate(level), false);
        
        // Check if baby is tired
        if (promptCount >= maxPrompts) {
            setTimeout(() => {
                document.getElementById('tiredOverlay').classList.add('show');
                document.querySelector('.input-box').classList.add('disabled');
            }, 1000);
        } else {
            btn.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }, delay);
}

function add(text, isUser) {
    if (!started) {
        main.style.display = 'none';
        chat.classList.add('active');
        started = true;
    }
    
    const msg = document.createElement('div');
    msg.className = 'msg';
    msg.innerHTML = `
        <div class="icon ${isUser ? 'user-icon' : 'ai-icon'}">
        ${isUser 
            ? `<img src="user-avatar.png" alt="You">` 
            : `<img src="godbaby-avatar.png" alt="God baby">`
        }
        </div>
        <div class="content">${text.replace(/\n/g, '<br>')}</div>
    `;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return msg;
}

function thinking() {
    const msg = add('<div class="thinking-dots"><span></span><span></span><span></span></div>', false);
    msg.id = 'thinking';
    return msg;
}

function complexity(text) {
    let score = text.length / 10;
    const q = ['what', 'why', 'how', 'when', 'where', 'who', 'explain', 'meaning'];
    const c = ['quantum', 'philosophy', 'consciousness', 'universe', 'theory', 'algorithm'];
    
    q.forEach(w => { if (text.toLowerCase().includes(w)) score += 3; });
    c.forEach(w => { if (text.toLowerCase().includes(w)) score += 5; });
    score += (text.match(/\?/g) || []).length * 2;
    
    return Math.max(2, Math.min(20, Math.floor(score)));
}

function generate(level) {
    const sounds = ['gugu', 'gaga', 'baba', 'dada'];
    let result = [];
    for (let i = 0; i < level; i++) {
        result.push(sounds[Math.floor(Math.random() * sounds.length)]);
    }
    return result.join(' ');
}