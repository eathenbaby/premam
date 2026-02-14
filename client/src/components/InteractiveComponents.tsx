import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CutesyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
}

export const CutesyButton = ({ children, className, variant = "primary", onClick, ...props }: CutesyButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className={cn(
                "btn-sunset px-8 py-4 text-lg md:text-xl font-bold tracking-wider uppercase transition-all duration-300 transform",
                className
            )}
            {...props}
        >
            <span className="relative z-10 drop-shadow-sm">
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

        // Calculate safe boundaries (keep within screen/container)
        const maxX = Math.min(window.innerWidth - 150, parentRect.width - 150);
        const maxY = Math.min(window.innerHeight - 100, parentRect.height - 100);

        const newX = Math.random() * (maxX - (-maxX)) + (-maxX); // Simplified random move logic
        const newY = Math.random() * (maxY - (-maxY)) + (-maxY);

        // Constrain to typical view area for simplicity in this random logic
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
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={dodge}
            onTouchStart={dodge}
            className={cn(
                "bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg border-2 border-primary/20",
                "absolute md:relative", // Ensure it can move freely
                className
            )}
            style={{

            }}
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
            {Array.from({ length: 15 }).map((_, i) => (
                <div
                    key={i}
                    className="heart-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${10 + Math.random() * 10}s`
                    }}
                >
                    ❤️
                </div>
            ))}
        </div>
    )
}
