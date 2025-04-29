import Keys from "./Key.jsx";

export default function Keyboard(props) {
    function getKeyBoardRow(keys) {
        return keys.split('').map((key) => {
            return <Keys character={key}
                         state={props.getKeyState(key)}/>
        })
    }

    const firstRow = getKeyBoardRow('QWERTYUIOP');
    const secondRow = getKeyBoardRow('ASDFGHJKL');
    const thirdRow = getKeyBoardRow('ZXCVBNM');
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