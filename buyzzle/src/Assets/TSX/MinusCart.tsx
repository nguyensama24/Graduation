type Props = {
    wait: boolean,
}
export default function MinusCart(props: Props) {
    const { wait } = props
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Minus">
                <g id="Group">
                    <path id="Vector" d="M2.78452 8H13.2159" stroke={`${wait ? `#D6D6D6` : `#EA4B48`}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
        </svg>

    )
}
