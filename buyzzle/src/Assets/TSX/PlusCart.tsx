type Props = {
    wait: boolean,
}
export default function PlusCart(props: Props) {
    const { wait } = props
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="plus 1">
                <g id="Group">
                    <path id="Vector" d="M2.78448 7.99999H13.2159M8.00017 2.7843V13.2157V2.7843Z" stroke={`${wait ? `#D6D6D6` : `#EA4B48`}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            </g>
        </svg>

    )
}