/*
	Smart contract to read/write data to blockchain and retrieve the ipfhash
	So we get a hash, this returns the file we sent, because they are correlated/mapped
*/


//as there are updates, this versioning will need to change.
//check which solidity version you are using and then change accordingly
//to check this, type truffle version and then it will show the solidity version
//Type in the exact version
pragma solidity 0.4.24;
//this is the basis for storing the IPSFhash ref on the blockchain
contract SimpleStorage {
  string ipfsHash;

  //setter function to accept a String 
  //This will update the state to the blockchain as this is set
  function set(string x) public {
    ipfsHash = x;
  }

  //getter function to read the data and return the ipfsHash
  function get() public view returns (string) {
    return ipfsHash;
  }
}
