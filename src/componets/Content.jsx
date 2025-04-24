import Message from "./Message.jsx";
import Attempts from "./Attempts.jsx";
import Keyboard from "./Keyboard.jsx";
import Word from "./Word.jsx";
import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import {KeyContext} from "../KeyContext.js";

export default function Content() {
    const [message, setMessage] = useState({})
    const [languages, setLanguages] = useState(getInitialLanguages)
    const [word, setWord] = useState(Array.from({length: 8}, () => ''))
    const [keyboardCharacters, setKeyboardCharacters] = useState(getInitialKeyBoardCharacters);
    const solution = 'REFACTOR'
    const numberOfAttemptsLeft = languages.filter(language => language.isDead).length - 1
    const gameStatus = word.join('') === solution ? 'won' : numberOfAttemptsLeft === 0 ? 'lost' : 'in-progress'

    function getInitialKeyBoardCharacters() {
        return `QWERTYUIOPASDFGHJKLZXCVBNM`.split('').map(key => {
            return {
                id: nanoid(),
                character: key,
                state: 'not-selected'
            }
        })
    }

    function getInitialLanguages() {
        return [
            {
                name: 'Python',
                id: nanoid(),
                isDead: false,
                color: '#FFD742'
            }, {
                name: 'Java',
                id: nanoid(),
                isDead: false,
                color: '#ED8B00'
            }, {
                name: 'Javascript',
                id: nanoid(),
                isDead: false,
                color: '#f7df1e'
            }, {
                name: 'Go',
                id: nanoid(),
                isDead: false,
                color: '#00ADD8'
            }, {
                name: 'C#',
                id: nanoid(),
                isDead: false,
                color: '#9b4993'
            }, {
                name: 'Ruby',
                id: nanoid(),
                isDead: false,
                color: 'red'
            }, {
                name: 'PHP',
                id: nanoid(),
                isDead: false,
                color: '#8892be'
            }, {
                name: 'C',
                id: nanoid(),
                isDead: false,
                color: '#943051'
            }, {
                name: 'Assembly',
                id: nanoid(),
                isDead: false,
                color: 'black'
            }];
    }

    function onCharSelect(event){
        const selectedChar = event.target.name
        const matchedIndices = []
        solution.split('').forEach((value,index) => value === selectedChar && matchedIndices.push(index))
        const isCorrectChar = matchedIndices.length > 0
        const updatedState = isCorrectChar ? 'correct' : 'wrong'
        setKeyboardCharacters(prevKeyboardChars => prevKeyboardChars.map(
            keyboardChar => {
                if(keyboardChar.character === selectedChar){
                      return {...keyboardChar,state: updatedState}
                }else{
                    return keyboardChar
                }
            }
        ))
        if(isCorrectChar){
            setWord(prevWord => prevWord.map(
                (char,index) => matchedIndices.includes(index) ? selectedChar : ''));
        }
    }

    useEffect(()=>{
        if(keyboardCharacters.filter(keyboardCharacter => keyboardCharacter.state === 'wrong')){
            setLanguages(prevLanguages => prevLanguages.map((language,index) => {
                if(index === 8-numberOfAttemptsLeft){
                    return {...language,isDead: true}
                }else{
                    return language;
                }
            }))
        }
    },[keyboardCharacters])

    useEffect(() =>{
        if(gameStatus !== 'in-progress'){
            setMessage(prevMessage => ({
                heading :  gameStatus === 'won' ? 'You win!' : 'Game Over!',
                description: gameStatus === 'won' ? 'Well done! 🎉' : 'You lose! Better start learning Assembly 😭'
            }))
        }else{
            setMessage(prevState => ({
                description :'Farewell '+languages.reduce((accumulator,language,index) => {
                    accumulator += language.isDead ? language.name + ', ': ''
                })+' 🫡'
            }))
        }
    },[languages])

    return (
        <main>
            {message.length > 0 && <Message desc={message.description} heading={message.heading}></Message>}
            <Attempts languages={languages}></Attempts>
            <Word word={word}></Word>
            <KeyContext.Provider value={onCharSelect}>
                <Keyboard keyboardChars={keyboardCharacters}></Keyboard>
            </KeyContext.Provider>
        </main>
    )
}