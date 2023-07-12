<script lang="ts">
  export let id: string = ""
  export let className: string = ""
  export let loading: boolean = false
  export let onClick = () => {}
</script>

<button
  {id}
  class={`Button ${className}`}
  on:click={!loading ? onClick : () => {}}
>
  {#if loading}
    <div class="Button-loader">
      <img src="/spinner.svg" alt="Loading..." />
    </div>
  {/if}
  <slot />
</button>

<style>
  .Button {
    border: none;
    width: 100%;
    padding: 16px 24px;
    color: white;
    background: linear-gradient(107.8deg, #4c49e4 11.23%, #26c2f3 78.25%);
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
    transition: all 150ms ease 0s;
    margin: 16px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Button:hover {
    transform: scale(1.01);
  }

  .Button-loader {
    margin: 0px 8px;
  }

  .Button-loader img {
    width: 14px;
    height: 14px;
    animation: spin 1s linear infinite;
  }
</style>
