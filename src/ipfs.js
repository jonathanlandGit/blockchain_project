/*
	We need to set up the host and port that IPFS runs on which is 5001. This is ssl encrypted
	This is what we're referencing in app.js
*/
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfs;
