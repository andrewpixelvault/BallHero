async function loadABI() {
    const response = await fetch('path/to/MetaHeroABI.json');
    const abi = await response.json();
    return abi;
}

async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                console.log("accounts[0]");
                SendMessage('WalletManager', 'ReceiveAccount', accounts[0]);
            } else {
                console.log("No accounts received.");
            }
        } catch (error) {
            console.error('User denied account access or an error occurred:', error);
        }
    } else {
        console.error('MetaMask is not installed!');
    }
}


async function getContract() {
    const abi = await loadABI();
    const contractAddress = "0x6dc6001535e15b9def7b0f6a20a2111dfa9454e2";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    return contract;
}


async function fetchAllNFTsAndSendToUnity() {
    try {
        const contract = await getContract();
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const accountAddress = accounts[0];
        const nftCount = await contract.balanceOf(accountAddress);
        let nftIds = [];

        for (let i = 0; i < nftCount; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(accountAddress, i);
            nftIds.push(tokenId.toString());
        }

        SendMessage('WalletManager', 'ReceiveNFTIds', JSON.stringify(nftIds));
    } catch (error) {
        console.error('Failed to fetch NFTs or send data to Unity:', error);
    }
}


ethereum.on('accountsChanged', (accounts) => {

        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
        } else {
            console.log("accounts[0]");
            SendMessage('WalletManager', 'ReceiveAccount', accounts[0]);
        }

});

ethereum.on('chainChanged', (_chainId) => window.location.reload());
