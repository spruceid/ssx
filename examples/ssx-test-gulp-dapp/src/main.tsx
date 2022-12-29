import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MouseEventHandler } from 'react';
import { SSX } from "@spruceid/ssx";

class MyReactApp extends React.Component<any, any> {
    handleClick: MouseEventHandler;
    constructor(props: any) {
        super(props);

        this.handleClick = (event: React.MouseEvent) => {
            alert(props.alertMessage);
        };
    }

    signIn = async () => {
        const ssx = new SSX({
            enableDaoLogin: true,
            resolveEns: true,
            providers: {
                web3: { driver: (window as any).ethereum },
            },
        });
        const session = await ssx.signIn();
        console.log(session)
        const { address, siwe, signature, ens: { domain } } = session;
    };

    render() {

        return (
            <div>
                <button onClick={this.signIn}>Sign in</button>
            </div>
        );
    }
}

ReactDOM.render(<MyReactApp alertMessage='Hello World' />, document.getElementById('app'));