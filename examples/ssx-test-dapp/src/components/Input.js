const Input = ({ label, value, onChange, helperText }) => {
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