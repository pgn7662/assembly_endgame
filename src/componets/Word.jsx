import CharInput from "./CharInput.jsx";

export default  function Word(props){
    const answer = props.isGameOver ? props.answer.split('') : props.guessedWord
    return (
        <div className="dashed-input-cont">
            {answer.map((char, index) => <CharInput isRed={!props.guessedWord.includes(char)} key={index} character={char}/>)}
        </div>
    )
}