import Message from "./Message.jsx";
import Attempts from "./Attempts.jsx";
import Keyboard from "./Keyboard.jsx";
import Word from "./Word.jsx";
import {useCallback, useEffect, useState} from "react";
import {nanoid} from "nanoid";
import {KeyContext} from "../KeyContext.js";
import ReactConfetti from "react-confetti";
import NewGameButton from "./NewGameButton.jsx";
import {faker} from "@faker-js/faker"

export default function Content() {
    const [message, setMessage] = useState({
        heading: 'Let Set Go!',
        description: 'Save your favorite programming languages'
    })
    const [languages, setLanguages] = useState(getInitialLanguages)
    const [word, setWord] = useState(Array.from({length: 8}, () => ''))
    const [solution, setSolution] = useState(getRandomWord)
    const numberOfAttemptsLeft = 8 - languages.filter(language => language.isDead).length
    const gameStatus = word.join('') === solution ? 'won' : numberOfAttemptsLeft < 1 ? 'lost' : 'in-progress'
    const [selectedCharacters, setSelectedCharacters] = useState([])

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

    function onCharSelect(event, selectedChar) {
        selectedChar = selectedChar || event.target.name
        if (selectedCharacters.includes(selectedChar)) {
            return;
        }
        const matchedIndices = []
        solution.split('').forEach((value, index) => value === selectedChar && matchedIndices.push(index))
        const isCorrectChar = matchedIndices.length > 0
        setSelectedCharacters(prevChars => [...prevChars, selectedChar])
        if (isCorrectChar) {
            setWord(prevWord => prevWord.map(
                (char, index) => matchedIndices.includes(index) ? selectedChar : char));
        }
    }

    function getRandomWord() {
        return faker.word.noun({length: {min : 5, max : 8}}).toUpperCase()
    }

    function resetGame() {
        setMessage({heading: 'Let Set Go!', description: 'Save your favorite programming languages'});
        setLanguages(getInitialLanguages)
        setWord(Array.from({length: 8}, () => ''))
        setSelectedCharacters([])
        setSolution(getRandomWord)
    }

    function getKeyState(key){
        return !selectedCharacters.includes(key) ? 'not-selected' : solution.includes(key) ? 'correct' : 'wrong'
    }

    const onType = useCallback((event) => {
        if (gameStatus !== 'in-progress') return;

        const typedLetter = event.key.toUpperCase()
        if (typedLetter.length === 1 && typedLetter.charCodeAt(0) > 64 && typedLetter.charCodeAt(0) < 91) {
            onCharSelect(undefined, typedLetter)
        }
    }, [gameStatus,onCharSelect,solution]);

    useEffect(() => {
        if (selectedCharacters.length && !solution.includes(selectedCharacters.toReversed()[0])) {
            setLanguages(prevLanguages => prevLanguages.map((language, index) => {
                if (index === 8 - numberOfAttemptsLeft) {
                    return {...language, isDead: true}
                } else {
                    return language;
                }
            }))
        }
    }, [selectedCharacters])

    useEffect(() => {
        if (gameStatus !== 'in-progress') {
            setMessage(prevMessage => ({
                heading: gameStatus === 'won' ? 'You win!' : 'Game Over!',
                description: gameStatus === 'won' ? 'Well done! 🎉' : 'You lose! Better start learning Assembly 😭 Correct answer : '+solution
            }))
            document.removeEventListener("keyup", onType)
        } else if (numberOfAttemptsLeft < 8) {
            setMessage(function(prevMessage){
                let deadLanguages = languages.reduce((accumulator, language, index) => {
                    accumulator += language.isDead ? language.name + ', ' : ''
                    return accumulator
                },'')
                deadLanguages = deadLanguages.substring(0,deadLanguages.length - 2)
                return{
                    heading: 'Farewell! 🫡',
                    description: 'RIP ' + deadLanguages
                }
            })
        }
    }, [languages,gameStatus])

    useEffect(() => {
        setWord(Array.from({length: solution.length}, () => ''))
    }, [solution])

    useEffect(() => {
        document.addEventListener("keyup", onType)
        return () => document.removeEventListener("keyup", onType)
    }, [onType])


    const contextValue = {gameStatus, onCharSelect}

    return (
        <main>
            {gameStatus === "won" && <ReactConfetti></ReactConfetti>}
            <Message desc={message.description} heading={message.heading} gameStatus={gameStatus}></Message>
            <Attempts languages={languages}></Attempts>
            <Word word={word}></Word>
            <KeyContext.Provider value={contextValue}>
                <Keyboard getKeyState={getKeyState}></Keyboard>
            </KeyContext.Provider>
            {gameStatus !== 'in-progress' && <NewGameButton onClick={resetGame}></NewGameButton>}
        </main>
    )
}