import React, { useState } from 'react';
import styles from '../styles/SignInWithEmailModal.module.css'

interface ISignInWithEmailModal {
  title?: string,
  showModal: boolean,
  handleClose: () => void,
  handleEmailSignIn: (email: string) => void;
}

const SignInWithEmailModal = ({ title = 'Sign in with Email', showModal, handleClose, handleEmailSignIn }: ISignInWithEmailModal) => {

  const [email,setEmail] = useState<string>('');

  return (
    <>
      {
        showModal && (
          <div className={styles.container}>
            <div className={styles.modal}>
              <h3>{title}</h3>
              <div>
                <div className={styles.body}>
                  <label htmlFor='email'><b>Email</b></label>
                  <input 
                    type='email' 
                    id='email'
                    className={styles.input}
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                    />
                </div>
              </div>
              <div className={styles.footer}>
                <button onClick={handleClose}>Close</button>
                <button onClick={() => handleEmailSignIn(email)}>Send email</button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default SignInWithEmailModal;