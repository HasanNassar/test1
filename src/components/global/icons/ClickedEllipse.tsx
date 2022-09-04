export const ClickedEllipse = ({ className }: { className?: string }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="8" cy="8" r="7.25" stroke="#FF5A5A" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="3.5" fill="#FF5A5A" stroke="#FF5A5A" />
    </svg>
)
