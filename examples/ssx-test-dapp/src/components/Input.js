const Input = ({ label, value, onChange }) => {
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
    </div>
};

export default Input;