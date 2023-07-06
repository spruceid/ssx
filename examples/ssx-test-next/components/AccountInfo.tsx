
interface IAccountInfo {
  address?: string;
  session?: Record<string, any>;
}

const AccountInfo = ({ address, session }: IAccountInfo) => {
  return (
    <div className='AccountInfo'>
      <h2 className='AccountInfo-h2'>
        Account Info
      </h2>
      {
        session?.ens &&
          (
            session?.ens.domain || session?.ens.avatarUrl ||
            session?.ens.ensName || session?.ens.ensAvatarUrl
          ) ?
          <div>
            <b className='AccountInfo-label'>
              ENS
            </b>
            <br />
            <div className='AccountInfo-container'>
              {
                session.ens.avatarUrl || session.ens.ensAvatarUrl ?
                  <img
                    id='ensAvatar'
                    className='AccountInfo-avatar'
                    src={session.ens.avatarUrl ?? session.ens.ensAvatarUrl}
                    alt='ENS avatar'
                  /> :
                  null
              }
              {
                session.ens.domain || session.ens.ensName ?
                  <code
                    id='ensDomain'
                    className='AccountInfo-value'
                  >
                    {session.ens.domain || session.ens.ensName}
                  </code> :
                  null
              }
            </div>
          </div> :
          null
      }
      {
        session?.lens ?
          typeof session.lens !== 'string' ?
            session.lens.items.length > 0 ?
              (
                <div>
                  <b className='AccountInfo-label'>
                    Lens
                    {session.lens.pageInfo.totalCount > 10 ? <small>&nbsp;(listing first 10)</small> : null}
                  </b>
                  <br />
                  {
                    session.lens.items.map((profile: Record<string, any>, i: number) => (
                      <div key={i} className='AccountInfo-container'>
                        {
                          profile.picture?.original?.url ?
                            <img
                              className='AccountInfo-avatar'
                              src={profile.picture?.original?.url}
                              alt='Lens avatar'
                            /> :
                            null
                        }
                        {
                          profile.handle ?
                            <code className='AccountInfo-value'>
                              {profile.handle}
                            </code> :
                            null
                        }
                      </div>
                    ))
                  }
                </div>
              ) :
              null :
            <div>
              <b className='AccountInfo-label'>
                Lens
              </b>
              <div className='AccountInfo-container'>
                <code className='AccountInfo-value'>
                  {session.lens}
                </code>
              </div>
            </div>
          :
          null
      }
      <p>
        <b className='AccountInfo-label'>
          Address
        </b>
        <br />
        <code
          id='userAddress'
          className='AccountInfo-value'
        >
          {address?.toLowerCase()}
        </code>
      </p>
    </div>
  );
};

export default AccountInfo;