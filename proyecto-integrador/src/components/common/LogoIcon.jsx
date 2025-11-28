const LogoIcon = ({ className = "w-6 h-6", ...props }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Outer Circle */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" />

            {/* Book */}
            <path
                d="M25 35 
           C 25 35, 45 35, 50 40
           C 55 35, 75 35, 75 35
           V 75
           C 75 75, 55 75, 50 80
           C 45 75, 25 75, 25 75
           Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Book Spine Line */}
            <path d="M50 40 V 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Checkmark (Left Page) */}
            <path
                d="M32 55 L 38 60 L 45 50"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Lines (Right Page) */}
            <path d="M58 50 H 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M58 60 H 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M58 70 H 66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

            {/* Pencil */}
            <path
                d="M65 30 L 80 15 L 90 25 L 75 40"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
            />
            {/* Pencil Tip */}
            <path d="M65 30 L 62 43 L 75 40" stroke="currentColor" strokeWidth="2" fill="currentColor" />
        </svg>
    );
};

export default LogoIcon;
