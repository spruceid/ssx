interface IRadioGroup {
    label?: string;
    name: string;
    options: Array<string>;
    value: string;
    onChange: (option: string) => void;
    inline?: boolean;
}

const RadioGroup = ({ label, name, options, value, onChange, inline = true }: IRadioGroup) => {
    return <>
        {
            label ?
                <label
                    className='RadioGroup-label'
                    htmlFor={name}
                >
                    {label}
                </label> :
                null
        }
        <div className={'RadioGroup' + (inline ? ' inline' : '') + (label ? ' margin' : '')}>
            {
                options.map((option, i) => (
                    <div
                        className='RadioGroup-option'
                        key={i}
                    >
                        <input
                            type='radio'
                            id={`${name}-${option.replace(/\s+/g, '')}`}
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={() => onChange(option)}
                        />
                        <label htmlFor={
                            `${name}-${option.replace(/\s+/g, '')}`
                        }>
                            {option}
                        </label>
                    </div>
                ))
            }
        </div>
    </>
};

export default RadioGroup;