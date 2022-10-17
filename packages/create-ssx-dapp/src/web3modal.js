import prompts from "prompts";

async function run(env, onCancel) {
    await ask(env, onCancel);
}

async function ask(env, onCancel) {
    const { enableWalletConnect, infuraId } = await prompts([
        {
            type: "toggle",
            name: "enableWalletConnect",
            message: "Would you like to enable WalletConnect?",
            active: "yes",
            inactive: "no",
            initial: true,
        },
        {
            type: prev => prev == true ? 'text' : null,
            name: "infuraId",
            message: "WalletConnect requires an infuraId. What is yours?"
        }
    ],
        { onCancel }
    );

    if (enableWalletConnect) {
        env.REACT_APP_SSX_INFURA_ID = infuraId;
    }

}

export default {
    run
};