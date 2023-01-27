function AccountInfo({ address, delegator }: { address: string, delegator?: string }) {
    return (
      <div className="App-account-info">
        <h2>
          Account Info
        </h2>
        {
          address &&
          <p>
            <b>
              Address
            </b>
            <br />
            <code>
              {address}
            </code>
          </p>
        }
      </div>
    );
  };

export default AccountInfo;