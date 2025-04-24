import CharInput from "./CharInput.jsx";

export default  function Word(props){
    return (
        <div className="dashed-input-cont">
            {props.word.map((char,index) => <CharInput key={index} character={char}/>)}
        </div>
    )
}