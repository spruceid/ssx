import React, { useState } from 'react';

interface ISignInWithEmailModal {
  title?: string,
  success?: boolean,
  loading?: boolean,
  showModal: boolean,
  handleClose: () => void,
  handleEmailSignIn: (email: string) => void;
}

const SignInWithEmailModal = ({ title = 'Sign-In with Email', success, loading = false, showModal, handleClose, handleEmailSignIn }: ISignInWithEmailModal) => {

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
              {
                !success ?
                  <>
                    {
                      success === false ?
                        <p>Error trying to send the email. Verify your SMTP settings.</p> :
                        null
                    }
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
                    <button
                      disabled={loading}
                      className='Button'
                      onClick={() => handleEmailSignIn(email)}
                    >
                      {loading ? <img src='/spinner.svg' alt='loading...' /> : null}
                      SIGN IN WITH EMAIL
                    </button>
                  </> :
                  <>
                    <p>Check your email for sign in instructions</p>
                    <button
                      className='Button Button-loading'
                      onClick={handleClose}
                    >
                      CLOSE
                    </button>
                  </>
              }
            </div>
          </div>
        )}
    </>
  );
};

export default SignInWithEmailModal;