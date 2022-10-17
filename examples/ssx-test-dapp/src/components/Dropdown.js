import { useEffect, useState } from 'react';

const Dropdown = ({ label, children }) => {

    const [open, setOpen] = useState(false);

    const verifyClickOutside = (e) => {
        if (!document.getElementById('dropdown').contains(e.target)) {
            setOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', verifyClickOutside);
        return () => {
            window.removeEventListener('click', verifyClickOutside);
        }
    })

    return <div
        id='dropdown'
        className='Dropdown no-select'
    >
        <div
            className='Dropdown-input'
            onClick={() => setOpen(!open)}
        >
            <p className='Dropdown-label'>
                {label}
            </p>
            <div className='Dropdown-icon'>
                {
                    open ?
                        <img src='/arrow-up.svg' alt='open menu' /> :
                        <img src='/arrow-down.svg' alt='close menu' />
                }
            </div>
        </div>
        {
            open ?
                <div className='Dropdown-popover'>
                    {children}
                </div> :
                null
        }
    </div>
};

export default Dropdown;