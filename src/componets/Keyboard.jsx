import Keys from "./Key.jsx";

export default function Keyboard(props) {
    const keyboardCont = props.keyboardChars.map(keys => <Keys character={keys.character} key={keys.id}
                                                               state={keys.state}/>)
    return (
        <div className="keyboard">
            {keyboardCont}
        </div>
    )
}