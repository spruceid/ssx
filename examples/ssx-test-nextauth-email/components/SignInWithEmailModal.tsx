import React, { useState } from 'react';

interface ISignInWithEmailModal {
  showModal: boolean,
  handleClose: () => void,
  handleEmailSignIn: (email: string) => void;
}

const SignInWithEmailModal = ({ showModal, handleClose, handleEmailSignIn }: ISignInWithEmailModal) => {

  const [email,setEmail] = useState<string>('');

  return (
    <>
      {
        showModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)"
          }}>
            <div style={{
              background: "black",
              padding: "1rem",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%"
            }}>
              <h3>Add an email to your account</h3>
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
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