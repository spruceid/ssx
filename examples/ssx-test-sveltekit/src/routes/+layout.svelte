<div class="App">
  <div class="Header">
    <span class="Header-span"> SSX </span>
  </div>
  <div class="Title">
    <h1 class="Title-h1">SSX Test App</h1>
    <h2 class="Title-h2">Connect and sign in with your Ethereum account</h2>
  </div>
  <div class="Content">
    <div class="Content-container">
      <slot />
    </div>
  </div>
</div>

<style>
  :global(body) {
    background-color: #1b1b1b;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(code) {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  /* App */
  .App {
    margin-top: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  }

  /* Header */
  .Header {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    text-align: left;
    padding: 16px 64px;
    display: flex;
    align-items: center;
    background-color: #212121;
  }

  .Header-span {
    font-weight: 600;
    font-size: 32px;
  }

  /* Title */
  .Title {
    margin: 24px auto;
  }

  .Title-h1 {
    font-weight: 500;
    font-size: 36px;
  }

  .Title-h2 {
    font-weight: 400;
    font-size: 16px;
    color: #667080;
  }

  /* Content */
  .Content {
    width: 480px;
    max-width: 100%;
    background-color: rgba(39, 39, 39, 0.7);
    backdrop-filter: blur(2px);
    border-radius: 12px;
    text-align: left;
  }

  .Content-container {
    padding: 30px;
  }

  /*  */
  :global(.no-select) {
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Old versions of Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
    supported by Chrome, Edge, Opera and Firefox */
  }

  /* Animation Spin */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
