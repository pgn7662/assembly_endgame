export default function Language(props) {
    return (

        <div style={{backgroundColor: props.color}}
             className={`language ${(props.name === 'Javascript' || props.name === 'Python') ? 'dark-text' : ''}`}>
            <span>{props.name}</span>
            {
                props.isDead &&
                <span className="dead">💀</span>
            }
        </div>
    )
}