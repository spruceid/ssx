import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSSX } from "@spruceid/ssx-react";
import { signIn } from 'next-auth/react';
import SignInWithEmailModal from '../components/SignInWithEmailModal';
import Header from '../components/Header';
import Title from '../components/Title';

const Home: NextPage = () => {
  const { ssx, ssxLoaded } = useSSX();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>();
  const [emailSent, setEmailSent] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setEmailSent(undefined);
    setModalTitle(undefined);
  }

  const handleOpenModal = (title?: string) => {
    setModalTitle(title);
    setShowModal(true);
  }

  const handleSignIn = async () => {
    const response: any = await ssx?.signIn();
    if (response?.status === 200) {
      router.push('/protected');
    } else if (response?.status === 401) {
      // link not found -> open email modal
      handleOpenModal('Add an email to your account');
    } else if (response?.status === 403) {
      // sign in error 
      window.alert(response?.error);
    }
  };

  const handleEmailSignIn = async (email: string) => {
    setLoading(true);
    const callbackUrl = "/protected";
    const response = await signIn("email", { email, redirect: false, callbackUrl });
    if (response?.error) {
      setEmailSent(false);
    } else {
      setEmailSent(true);
      setTimeout(() => {
        handleCloseModal();
      }, 5000);
    }
    setLoading(false);
  };

  return (
    <>
      <div className='App'>
        <Header connectButton />
        <Title
          title='NextAuth Email + SSX Example'
          subtitle='Let users log in using their email first, associate an Ethereum account, and then start signing in with Ethereum.'
        />

        <div className='Content'>
          <div className='Content-container'>
            <button
              className='Button no-select'
              onClick={() => handleOpenModal()}
            >
              SIGN IN WITH EMAIL
            </button>
            <button
              className='Button no-select'
              onClick={handleSignIn}
              disabled={!ssxLoaded}
            >
              SIGN IN WITH ETHEREUM
            </button>
          </div>
        </div>

        <SignInWithEmailModal
          title={modalTitle}
          showModal={showModal}
          success={emailSent}
          loading={loading}
          handleClose={handleCloseModal}
          handleEmailSignIn={handleEmailSignIn}
        />

      </div>
    </>
  );
};

export default Home;
