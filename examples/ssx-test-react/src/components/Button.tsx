interface IButton {
    id?: string;
    className?: string;
    children: React.ReactNode;
    onClick: (e: any) => void;
    loading?: boolean;
}

const Button = ({ id, className, children, onClick, loading }: IButton) => {
    return <button
        id={id}
        className={`Button ${className}`}
        onClick={!loading ? onClick : () => { }}
    >
        {
            loading ?
                <div className='Button-loader'>
                    <img
                        src='/spinner.svg'
                        alt='Loading...'
                    />
                </div> :
                null
        }
        {children}
    </button>
};

export default Button;