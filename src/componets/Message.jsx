export default function Message(props){
    return(
        <div>
            {props.heading && <h1>{props.heading}</h1>}
            <p>{props.desc}</p>
        </div>
    )
}