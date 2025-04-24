export default function Message(props){
    return(
        <div className="message-box" style={{backgroundColor : props.gameStatus === 'in-progress' ? '#7A5EA7' : props.gameStatus === 'won' ? '#10A95B' : '#BA2A2A'}}>
            {props.heading && <h1>{props.heading}</h1>}
            <p>{props.desc}</p>
        </div>
    )
}