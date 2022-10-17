import prompts from "prompts";

async function run(env, onCancel) {
    await ask(env, onCancel);
}

async function ask(env, onCancel) {
    const { ssxMetricsServer } = await prompts([
        {
            type: "text",
            name: "ssxMetricsServer",
            message: "Provide the SSX enabled server URL (leave blank if none)"
        }
    ],
        { onCancel }
    );

    if (ssxMetricsServer) {
        env.REACT_APP_SSX_METRICS_SERVER = ssxMetricsServer;
    }
}

export default {
    run
};