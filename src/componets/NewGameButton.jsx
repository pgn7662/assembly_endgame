export default function NewGameButton(props){
    return (
        <button className="new-game-btn" aria-label="New Game button" onClick={props.onClick}>New Game</button>
    )
}