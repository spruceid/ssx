<script lang="ts">
  import AccountInfo from "../components/AccountInfo.svelte"
  import Button from "../components/Button.svelte"
  import { SSX } from "@spruceid/ssx"

  let ssxProvider = null
  $: ssxProvider

  const ssxHandler = async () => {
    const ssx = new SSX({
      providers: {
        server: {
          host: "http://localhost:5173/api"
        }
      },
    })
    await ssx.signIn()
    ssxProvider = ssx
  }

  const ssxLogoutHandler = async () => {
    ssxProvider?.signOut()
    ssxProvider = null
  }
</script>

{#if ssxProvider}
  <Button onClick={ssxLogoutHandler}>SIGN-OUT</Button>
  <AccountInfo address={ssxProvider?.address()} session={ssxProvider?.session()} />
{:else}
  <Button onClick={ssxHandler}>SIGN-IN WITH ETHEREUM</Button>
{/if}
