import { useRef, useEffect } from 'react';

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.size = Math.random() * 5 + 1;
    }

    update() {
        if (this.x < 0 || this.x > this.canvas.width) this.velocity.x *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.velocity.y *= -1;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }
}

// https://javascript.info/js-animation
const Particles = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    let particles = [];

    const animate = (ctx, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }

        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));

        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
};

export default Particles;
