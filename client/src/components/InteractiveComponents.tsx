import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CutesyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
}

export const CutesyButton = ({ children, className, variant = "primary", onClick, ...props }: CutesyButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className={cn(
                "btn-sunset px-8 py-4 text-lg font-display font-semibold tracking-wide transition-all duration-400",
                className
            )}
            {...props}
        >
            <span className="relative z-10">
                {isHovered && children === "Yes" ? "YAY!" : children}
            </span>
        </motion.button>
    );
};

export const DodgingButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDodging, setIsDodging] = useState(false);
    const [text, setText] = useState(children);

    const dodge = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDodging(true);
        const parentRect = (e.target as HTMLElement).offsetParent?.getBoundingClientRect();

        if (!parentRect) return;

        const maxX = Math.min(window.innerWidth - 150, parentRect.width - 150);
        const maxY = Math.min(window.innerHeight - 100, parentRect.height - 100);

        const newX = Math.random() * (maxX - (-maxX)) + (-maxX);
        const newY = Math.random() * (maxY - (-maxY)) + (-maxY);

        const constrainedX = Math.max(-150, Math.min(150, newX));
        const constrainedY = Math.max(-200, Math.min(200, newY));

        setPosition({ x: constrainedX, y: constrainedY });
        setText("Wait!");

        setTimeout(() => {
            setText(children);
        }, 1000)
    };

    return (
        <motion.button
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            className={cn(
                "bg-parchment-warm text-ink font-display font-semibold px-8 py-4 rounded-lg shadow-md border border-burgundy/15",
                "absolute md:relative",
                className
            )}
        >
            {text}
        </motion.button>
    );
};

export const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("glass-card p-8 md:p-12", className)}>
            {children}
        </div>
    );
};

export const FloatingHearts = () => {
    return (
        <div className="floating-hearts">
            {Array.from({ length: 12 }).map((_, i) => (
                <div
                    key={i}
                    className="heart-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 7}s`,
                        animationDuration: `${12 + Math.random() * 10}s`
                    }}
                >
                    {i % 3 === 0 ? '♥' : i % 3 === 1 ? '❦' : '✿'}
                </div>
            ))}
        </div>
    )
}
