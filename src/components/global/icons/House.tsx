export const House = ({ color }: { color: string }) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color={color}>
            <path
                d="M3.75 13.939V22.189H9.75V16.189C9.75 15.3605 10.4216 14.689 11.25 14.689H12.75C13.5784 14.689 14.25 15.3605 14.25 16.189V22.189H20.25V13.939"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M0.75 12.439L10.939 2.24998C11.2203 1.96847 11.602 1.8103 12 1.8103C12.398 1.8103 12.7797 1.96847 13.061 2.24998L23.25 12.439"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
