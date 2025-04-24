import Language from "./Language.jsx";
import {nanoid} from "nanoid";

export default function Attempts(props) {
    const languageList = props.languages.map((language) =>
        <Language key={language.id} color={language.color} name={language.name} isDead={language.isDead}/>)
    return(
        <div className="language-cont">
            {languageList}
        </div>
    )
}