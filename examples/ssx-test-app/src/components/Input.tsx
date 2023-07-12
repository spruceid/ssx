interface IInput {
    label: string;
    value: string;
    onChange: (value: string) => void;
    helperText?: string;
}

const Input = ({ label, value, onChange, helperText }: IInput) => {
    return <div className='Input'>
        <label
            className='Input-label'
            htmlFor={label}
        >
            {label}
        </label>
        <input
            className='Input-input'
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        {helperText}
    </div>
};

export default Input;