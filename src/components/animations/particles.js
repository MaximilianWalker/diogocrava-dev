import { useRef, useEffect } from 'react';
import { distance } from '@/utils/mathUtils';

class Particle {
    constructor(canvas, velocity, size, color, proximityLink) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = speed;
        this.size = size;
        this.color = color;
        // this.speed = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        // this.size = Math.random() * 5 + 1;
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
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Links {
    static draw(particles, ctx, linkDistance) {
        particles.forEach((particle, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = distance(particle.x, particle.y, particles[j].x, particles[j].y);
                if (dist < linkDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / linkDistance})`;
                    ctx.stroke();
                }
            }
        });
    }
}

class Triangles {
    static draw(particles, ctx, linkDistance) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                for (let k = j + 1; k < particles.length; k++) {
                    const distIJ = distance(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    const distJK = distance(particles[j].x, particles[j].y, particles[k].x, particles[k].y);
                    const distKI = distance(particles[k].x, particles[k].y, particles[i].x, particles[i].y);
                    if (distIJ < linkDistance && distJK < linkDistance && distKI < linkDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.lineTo(particles[k].x, particles[k].y);
                        ctx.closePath();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.stroke();
                    }
                }
            }
        }
    }
}

// https://javascript.info/js-animation
const Particles = ({
    particlesCount = 50,
    particlesColor = 'white',
    particlesSize = 5,
    particlesOpacity = 0.7,
    particlesVelocity = 1,
    backgroundColor = 'black',
    linkDistance = 100
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    let particles = [];

    const animate = (ctx, canvas) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        Links.draw(particles, ctx, linkDistance);
        Triangles.draw(particles, ctx, linkDistance);

        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++)
            particles.push(new Particle(canvas));

        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));

        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    );
};

export default Particles;
