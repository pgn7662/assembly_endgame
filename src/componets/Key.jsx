import {useContext} from "react";
import {KeyContext} from "../util/KeyContext.js";

export default function Key(props){
    const context = useContext(KeyContext);
    return(
        <button className="keys" name={props.character} disabled={context.gameStatus !== 'in-progress'} style={{backgroundColor: props.state === 'not-selected' ? '#FCBA29' : props.state === 'correct' ? '#10A95B' : '#EC5D49'}}
                aria-disabled={props.state !== 'not-selected'}
                onClick={context.onCharSelect} aria-label={`Letter ${props.character}`}>
            {props.character}
        </button>
    )
}