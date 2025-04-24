import Keys from "./Key.jsx";

export default function Keyboard(props) {
    const keys = props.keyboardChars;
    function getKeyBoardRow(keys){
        return keys.map(key => <Keys character={key.character} key={key.id}
                                     state={key.state}/>)
    }
    const firstRow = getKeyBoardRow(keys.slice(0,10));
    const secondRow = getKeyBoardRow(keys.slice(10,19));
    const thirdRow = getKeyBoardRow(keys.slice(20-27));
    return (
        <div className="keyboard">
            <div className="keyboard-row">
                {firstRow}
            </div>
            <div className="keyboard-row">
                {secondRow}
            </div>
            <div className="keyboard-row">
                {thirdRow}
            </div>
        </div>
    )
}