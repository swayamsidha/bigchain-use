const driver = require('bigchaindb-driver')

// BigchainDB server instance or testnetwork (e.g. https://test.bigchaindb.com/api/v1/)
const API_PATH = 'https://test.bigchaindb.com/api/v1/'

// Create a new keypair for Alice and Bob
const alice = new driver.Ed25519Keypair()
const bob = new driver.Ed25519Keypair()

console.log('Alice: ', alice.publicKey)
console.log('Bob: ', bob.publicKey)

// Define the asset to store, in this example
// we store a bicycle with its serial number and manufacturer
const assetdata = {
        'bicycle': {
                'serial_number': 'cde',
                'manufacturer': 'Bicycle Inc.',
        }
}

// Metadata contains information about the transaction itself
// (can be `null` if not needed)
// E.g. the bicycle is fabricated on earth
const metadata = {'planet': 'earth'}

// Construct a transaction payload
const txCreateAliceSimple = driver.Transaction.makeCreateTransaction(
        assetdata,
        metadata,

        // A transaction needs an output
        [ driver.Transaction.makeOutput(
                        driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
)

// Sign the transaction with private keys of Alice to fulfill it
const txCreateAliceSimpleSigned = driver.Transaction.signTransaction(txCreateAliceSimple, alice.privateKey)
module.exports.txid = txCreateAliceSimpleSigned.id
// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH,{
  app_id: 'bfc4ddd3',
  app_key: '655b683010b058c59d09d81b9f239a0e'
})

conn.postTransactionCommit(txCreateAliceSimpleSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
        // With the postTransactionCommit if the response is correct, then the transaction
        // is valid and commited to a block

        // Transfer bicycle to Bob
        .then(() => {
                const txTransferBob = driver.Transaction.makeTransferTransaction(
                        // signedTx to transfer and output index
                        [{ tx: txCreateAliceSimpleSigned, output_index: 0 }],
                        [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(bob.publicKey))],
                        // metadata
                        {price: '100 euro'}
                )

                // Sign with alice's private key
                let txTransferBobSigned = driver.Transaction.signTransaction(txTransferBob, alice.privateKey)
                console.log('Posting signed transaction: ', txTransferBobSigned)

                // Post with commit so transaction is validated and included in a block
                return conn.postTransactionCommit(txTransferBobSigned)
        })
        .then(res => {
                console.log('Response from BDB server:', res)
                return res.id
        })
        .then(tx => {
                console.log('************************************************************************************')
                console.log('Is Bob the owner?', tx['outputs'][0]['public_keys'][0] == bob.publicKey)
                console.log('Was Alice the previous owner?', tx['inputs'][0]['owners_before'][0] == alice.publicKey )
        })
        // Search for asset based on the serial number of the bicycle
        conn.searchAssets('Bicycle Inc.').then(assets => console.log('Found assets with serial number Bicycle Inc.:', assets))
