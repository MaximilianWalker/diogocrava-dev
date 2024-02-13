'use client';

import { useRef, useEffect } from 'react';
import { distance } from '@/utils/mathUtils';
import useWindowSize from '@/hooks/useWindowSize';

class Particle {
    constructor(canvas, velocity, size, color) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = velocity;
        this.direction = Math.random() * Math.PI * 2;
        this.size = size;
        this.color = color;
        // this.speed = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        // this.size = Math.random() * 5 + 1;
    }

    randomize() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
    }

    update() {
        this.x += Math.cos(this.direction) * this.velocity;
        this.y += Math.sin(this.direction) * this.velocity;

        // Check if the particle is out of bounds
        if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
            // Choose a random side of the canvas for the particle to reappear
            const side = Math.floor(Math.random() * 4);

            switch (side) {
                case 0: // Top
                    this.x = Math.random() * this.canvas.width;
                    this.y = 0;
                    // Assign a random downward direction (90 to 270 degrees in radians)
                    this.direction = Math.PI / 2 + Math.random() * Math.PI;
                    break;
                case 1: // Right
                    this.x = this.canvas.width;
                    this.y = Math.random() * this.canvas.height;
                    // Assign a random leftward direction (180 to 360 degrees in radians)
                    this.direction = Math.PI + Math.random() * Math.PI;
                    break;
                case 2: // Bottom
                    this.x = Math.random() * this.canvas.width;
                    this.y = this.canvas.height;
                    // Assign a random upward direction (-90 to 90 degrees in radians)
                    this.direction = Math.random() * Math.PI - Math.PI / 2;
                    break;
                case 3: // Left
                    this.x = 0;
                    this.y = Math.random() * this.canvas.height;
                    // Assign a random rightward direction (0 to 180 degrees in radians)
                    this.direction = Math.random() * Math.PI;
                    break;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Links {
    static draw(particles, ctx, linkDistance) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = distance(particles[i], particles[j]);
                if (dist < linkDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / linkDistance})`;
                    ctx.stroke();
                }
            }
        }
    }
}

class Triangles {
    static draw(particles, ctx, linkDistance) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                for (let k = j + 1; k < particles.length; k++) {
                    const distIJ = distance(particles[i], particles[j]);
                    const distJK = distance(particles[j], particles[k]);
                    const distKI = distance(particles[k], particles[i]);
                    if (distIJ < linkDistance && distJK < linkDistance && distKI < linkDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.lineTo(particles[k].x, particles[k].y);
                        ctx.closePath();
                        ctx.fillStyle = `rgba(128, 128, 128, ${1 - ((distIJ + distJK + distKI) / (linkDistance * 3))})`;
                        ctx.fill();
                    }
                }
            }
        }
    }
}

// https://javascript.info/js-animation
const Particles = ({
    className,
    style,
    particleCount = 50,
    particleColor = '#fff',
    particleSize = 2,
    particleOpacity = 0.7,
    particleVelocity = 0.2,
    backgroundColor = '#000',
    linkDistance = 150
}) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const particlesRef = useRef([]);

    const size = useWindowSize();

    const animate = (ctx, canvas) => {
        const particles = particlesRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        Links.draw(particles, ctx, linkDistance);
        Triangles.draw(particles, ctx, linkDistance);

        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));
    };

    const randomizePositions = () => {
        const particles = particlesRef.current;
        particles.forEach(particle => particle.randomize());
    };

    const updateSize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.scale(dpr, dpr);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particles = particlesRef.current;

        for (let i = 0; i < particleCount; i++)
            particles.push(new Particle(canvas, particleVelocity, particleSize, particleColor));

        requestRef.current = requestAnimationFrame(() => animate(ctx, canvas));

        window.addEventListener('resize', updateSize);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', updateSize);
        };
    }, []);

    useEffect(() => {
        updateSize();
        randomizePositions();
    }, [size]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={style}
        />
    );
};

export default Particles;
