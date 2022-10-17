const RadioGroup = ({ name, options, value, onChange, inline = true }) => {
    return <div className={'RadioGroup' + (inline ? ' inline' : '')}>
        {
            options.map((option, i) => (
                <div
                    className='RadioGroup-option'
                    key={i}
                >
                    <input
                        type='radio'
                        id={`${name}-${option}`}
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(option)}
                    />
                    <label htmlFor={`${name}-${option}`}>
                        {option}
                    </label>
                </div>
            ))
        }
    </div>
};

export default RadioGroup;