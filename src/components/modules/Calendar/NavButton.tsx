export default function NavButton({ children, onClick }) {
    return (
        <button type="button" onClick={onClick}>
            {children}
        </button>
    )
}
