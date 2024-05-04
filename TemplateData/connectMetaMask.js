async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            SendMessage('WalletConnetButton', 'ReceiveAccount', accounts[0]);
        } catch (error) {
            console.error('User denied account access');
        }
    } else {
        console.error('MetaMask is not installed!');
    }
}


ethereum.on('accountsChanged', (accounts) => {
    SendMessage('WalletConnetButton', 'ReceiveAccount', accounts[0]);
});

ethereum.on('chainChanged', (_chainId) => window.location.reload());
