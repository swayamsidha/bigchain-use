const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const API_PATH = 'https://localhost:9984/api/v1/'
const conn = new BigchainDB.Connection(API_PATH)
//use of divisible assets to create tokens
const Ntoken = 1000
let tokensLeft
const tokenCreator = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
function tokenLaunch(){
  //construct a transaction payload
  const tx = BigchainDB.Transaction.makeCreateTransaction({
      token: 'TOKEN (demo token)',
      number_token: Ntoken
    },
    //metadata(opt)
    {
      planet: 'earth',
      time: new Date().toString()
    },
    [BigchainDB.Transaction.makeOutput(BigchainDB.Transaction.makeEd25519Condition(tokenCreator.publicKey), Ntoken.toString())], tokenCreator.publicKey
  )
  //sign the transaction
  const txSigned = BigchainDB.Transaction.signTransaction(tx, tokenCreator.privateKey)
  //send the transaction off to bigchain
  conn.postTransactionCommit(txSigned)
    .then(res => {
      tokensLeft = Ntoken
      console.log('transaction created');
      
    })
}
   
  
const amountToSend = 200
const bob = new BigchainDB.Ed25519Keypair 
