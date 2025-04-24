import {useContext} from "react";
import {KeyContext} from "../KeyContext.js";

export default function Key(props){
    const onSelect = useContext(KeyContext);
    return(
        <button className="keys" name={props.character} disabled={props.state !== 'not-selected'} style={{backgroundColor: props.state === 'not-selected' ? '#FCBA29' : props.state === 'right' ? '#10A95B' : '#EC5D49'}} onClick={onSelect}>
            {props.character}
        </button>
    )
}