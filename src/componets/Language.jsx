export default function Language(props) {
    return (
            <div style={{backgroundColor: props.color}} className={`language ${(props.name === 'Javascript' || props.name === 'Python') ? 'dark-text' : '' }`}>
            {props.isDead && <span className="dead">Dead</span>}
            <span>{props.name}</span>
        </div>
    )
}