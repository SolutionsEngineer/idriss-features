import { ServiceWorker } from 'infrastructure/service-worker';

/*  Chromium Wallets
    nkbihfbeogaeaoehlefnkodbefgpgknn - MetaMask
    hnfanknocfeofbddgcijnmhnfnkdnaad - Coinbase
    bfnaelmomeimhlpmgjnjophhpkkoljpa - Phantom
    eajafomhmkipbjmfmhebemolkcicgfmd - Tally
    bhhhlbepdkbapadjdnnojkbgioiodbic - Solflare
    bgpipimickeadkjlklgciifhnalhdjhe - GeroWallet
    fhbohimaelbohpjbbldcngcnapndodjp - Binance Wallet
    aiifbnbfobpmeekipheeijimdpnlpgpp - TerraStation Wallet
    ogcmjchbmdichlfelhmceldndgmgpcem - Bob Extension
    hmeobnfnfcmdkdcmlblgagmfpfboieaf - XDEFI Wallet
    dlcobpjiigpikoobohmabehhmhfoodbb - Argent X StarkNet Wallet
    fnjhmkhhmkbjkkabndcnnogagogbneec - Ronin Wallet
*/
const onInstalled = () => {
  chrome.contextMenus.create({
    title: 'Open IDriss',
    contexts: ['page'],
    id: 'idriss-crypto-1',
    documentUrlPatterns: [
      'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/*',
      'chrome-extension://hnfanknocfeofbddgcijnmhnfnkdnaad/*',
      'chrome-extension://bfnaelmomeimhlpmgjnjophhpkkoljpa/*',
      'chrome-extension://eajafomhmkipbjmfmhebemolkcicgfmd/*',
      'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/*',
      'chrome-extension://bgpipimickeadkjlklgciifhnalhdjhe/*',
      'chrome-extension://fhbohimaelbohpjbbldcngcnapndodjp/*',
      'chrome-extension://aiifbnbfobpmeekipheeijimdpnlpgpp/*',
      'chrome-extension://ogcmjchbmdichlfelhmceldndgmgpcem/*',
      'chrome-extension://hmeobnfnfcmdkdcmlblgagmfpfboieaf/*',
      'chrome-extension://dlcobpjiigpikoobohmabehhmhfoodbb/*',
      'chrome-extension://fnjhmkhhmkbjkkabndcnnogagogbneec/*',
    ],
  });
  chrome.contextMenus.onClicked.addListener(() => {
    chrome.windows
      .create({
        url: '/standalone.html',
        width: 450,
        height: 640,
        type: 'popup',
      })
      .catch(console.error);
  });
};

ServiceWorker.run(chrome, onInstalled);
