import React, { useState } from 'react';

interface ISignInWithEmailModal {
  title?: string,
  showModal: boolean,
  handleClose: () => void,
  handleEmailSignIn: (email: string) => void;
}

const SignInWithEmailModal = ({ title = 'Sign-In with Email', showModal, handleClose, handleEmailSignIn }: ISignInWithEmailModal) => {

  const [email, setEmail] = useState<string>('');

  return (
    <>
      {
        showModal && (
          <div className='Modal-container'>
            <div className='Modal'>
              <h3 className='Modal-title'>{title}</h3>
              <button
                className='Modal-button--close'
                onClick={handleClose}
              >
                &#x2715;
              </button>
              <div>
                <div>
                  <input
                    type='email'
                    id='email'
                    placeholder='email@example.com'
                    className='Modal-input'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
                <button
                  className='Button'
                  onClick={() => handleEmailSignIn(email)}
                >
                  SIGN IN WITH EMAIL
                </button>
              </div>
          </div>
        )}
    </>
  );
};

export default SignInWithEmailModal;