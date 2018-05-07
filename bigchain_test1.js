//08:22:35  IST 29/04/2018
const driver = require('bigchaindb-driver')
const API_PATH = 'http://localhost:9984/api/v1/'

const conn = new driver.Connection(API_PATH)
const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()

const assets = {'bicycle': {'serial': 'abc23', 'manufacturer': 'cycle1', } }
const metadata = {'location': 'new york'}
//assest creation
const txCreate = driver.Transaction.makeCreateTransaction(
  assets, metadata, [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(alice.publicKey))], alice.publicKey
)
//transaction needs an array of output objects. 
//for create transaction this is a list of outputs wrapping ed25519 condition
//alice.publicKey is considered as input for transaction
const txSign = driver.Transaction.signTransaction(txCreate, alice.privateKey)
//sign the transaction with private key of alice
conn.postTransactionCommit(txSign)
var txid = txSign.id
module.exports txid = txid;
console.log('signature is: '+ txid)
//querying for assest
console.log('got result')
conn.searchAssets('abc23').then(assets => console.log('got serial :', assets))
//creating a transfer transaction
/*
const txTransfer = driver.Transaction.makeTransferTransaction(
  [{
    tx: txSign, 
    output_index: 0
  }], 
  [driver.Transaction.makeOutput(
    driver.Transaction.makeEd25519Condition(bob.publicKey)
  )], 
  {
    price: '100 euro'
  });
const txBobSigned = driver.Transaction.signTransaction(txTransfer, alice.privateKey)
//send it over bigchain node
conn.postTransactionCommit(txBobSigned)
//alice was the previous owner
console.log('was alice the previous owner?', txBobSigned['inputs'][1]['owner_before'][1] == alice.publicKey )
//bob is current owner
console.log('is bob the owner?', txBobSigned['outputs'][1]['public_keys'][1] == bob.publicKey)*/


