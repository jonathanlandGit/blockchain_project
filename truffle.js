module.exports = {
  //We need to be sure to route this to the correct IP 
  //We are just using localhost IP here on port 7545
  //this is just our developmental network, and this needs to be the same
  //as what are using on Ganache for RPC
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      //we need to match any network id
      network_id: "*" 
    }
  }
};
