<script lang="ts">
  export let session: Record<string, any> = {}
  export let address: string = ""
</script>

<div class="AccountInfo">
  <h2 class="AccountInfo-h2">Account Info</h2>
  {#if session?.ens && (session?.ens.domain || session?.ens.avatarUrl || session?.ens.ensName || session?.ens.ensAvatarUrl)}
    <div>
      <b class="AccountInfo-label"> ENS </b>
      <br />
      <div class="AccountInfo-container">
        {#if session.ens.avatarUrl || session.ens.ensAvatarUrl}
          <img
            id="ensAvatar"
            class="AccountInfo-avatar"
            src={session.ens.avatarUrl ?? session.ens.ensAvatarUrl}
            alt="ENS avatar"
          />
        {/if}
        {#if session.ens.domain || session.ens.ensName}
          <code id="ensDomain" class="AccountInfo-value">
            {session.ens.domain || session.ens.ensName}
          </code>
        {/if}
      </div>
    </div>
  {/if}
  <p>
    <b class="AccountInfo-label"> Address </b>
    <br />
    <code id="userAddress" class="AccountInfo-value">
      {address?.toLowerCase()}
    </code>
  </p>
</div>

<style>
  .AccountInfo {
    margin-top: 16px;
    padding: 16px 8px;
    border: 1px solid #555555;
    border-radius: 12px;
  }

  .AccountInfo-h2 {
    font-weight: 500;
    font-size: 24px;
  }

  .AccountInfo-avatar {
    width: 35px;
    height: 35px;
    border-radius: 100%;
    margin-top: 4px;
    margin-right: 4px;
  }

  .AccountInfo-container {
    display: flex;
    align-items: center;
  }

  .AccountInfo-label {
    font-size: 14px;
    color: #667080;
  }

  .AccountInfo-value {
    color: #fff;
    word-break: break-all;
    font-size: 15px;
  }
</style>
