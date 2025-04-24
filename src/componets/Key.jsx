import {useContext} from "react";
import {KeyContext} from "../KeyContext.js";

export default function Key(props){
    const context = useContext(KeyContext);
    return(
        <button className="keys" name={props.character} disabled={context.gameStatus !== 'in-progress'} style={{backgroundColor: props.state === 'not-selected' ? '#FCBA29' : props.state === 'correct' ? '#10A95B' : '#EC5D49'}}
                onClick={context.onCharSelect}>
            {props.character}
        </button>
    )
}