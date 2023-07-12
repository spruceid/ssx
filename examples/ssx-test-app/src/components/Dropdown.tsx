import { useEffect, useState } from 'react';

interface IDropdown {
    id: string;
    label: string;
    children: React.ReactNode;
}

const Dropdown = ({ id, label, children }: IDropdown) => {

    const [open, setOpen] = useState(false);

    const verifyClickOutside = (e: any) => {
        if (!document.getElementById('dropdown')?.contains(e.target)) {
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
            id={id}
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