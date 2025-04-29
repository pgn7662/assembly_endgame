import Language from "./Language.jsx";
import {nanoid} from "nanoid";

export default function Attempts(props) {
    const languageList = props.languages.map((language,index) =>
        <Language key={language.id} color={language.color} name={language.name} isDead={index <= props.wrongAttempts-1}/>)
    return(
        <div className="language-cont">
            {languageList}
        </div>
    )
}