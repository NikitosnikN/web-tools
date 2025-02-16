const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Resize canvas when window is resized
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = Math.floor(window.innerWidth / fontSize);
const drops = new Array(columns).fill(1);

// Set text properties
ctx.font = `${fontSize}px monospace`;

function draw() {
    // Semi-transparent black background for fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0F0';

    // Loop over drops
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop to top with random delay when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

// Animation loop
setInterval(draw, 33);
