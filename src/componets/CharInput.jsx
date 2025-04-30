export default function CharInput(props){
    return (
        <div className={`dashed-line-input ${props.isRed && 'missed-char'}`}>{props.character}</div>
    )
}