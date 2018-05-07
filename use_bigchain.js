//12:34:02  IST 25/04/2018


const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
/*{
	app_id: '65cd8cf4',
    	app_key: 'deee3f631ae43326cecea31374aed266'
})
*/

const conn = new BigchainDB.Connection('https://test.bigchaindb.com/api/v1/', 
  {
    app_id: 'bfc4ddd3',
    app_key: '655b683010b058c59d09d81b9f239a0e'
  })
//creating a key pair
const alice = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
const bob = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
//digitally regesering our asset
const painting = {name: 'Meninas', artist: 'Diego Rodríguez de Silva y Velázquez', place: 'Madrid', year: '1656'}


//defining create asset to link our asset with owner
    // Construct a transaction payload
    const txCreatePaint = BigchainDB.Transaction.makeCreateTransaction(
        // Asset field
        {
            painting
        },
        // Metadata field, contains information about the transaction itself
        // (can be `null` if not needed)
        {
            datetime: new Date().toString(),
            location: 'Madrid',
            value: {
                value_eur: '25000000€',
                value_btc: '2200',
            }
        },
        // Output. For this case we create a simple Ed25519 condition
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(alice.publicKey))],
        // Issuers
        alice.publicKey
    )
    // The owner of the painting signs the transaction
    const txSigned = BigchainDB.Transaction.signTransaction(txCreatePaint,
        alice.privateKey)

    // Send the transaction off to BigchainDB
    conn.postTransactionSync(txSigned)
        .then(res => {
            document.body.innerHTML += '<h3>Transaction created</h3>';
            document.body.innerHTML += txSigned.id
            // txSigned.id corresponds to the asset id of the painting
        })
/*Now Alice has digitally registered her painting on BigchainDB. Alice’s public key appears in the output, specifying that she is the owner of the painting.*/
console.log(txSigned.id);

const txTransID = txSigned.id
conn.getTransaction(txTransID)
  .then((txCreatePaint) =>{
    const createTransfer = BigchainDB.Transaction.makeTransferTransaction([{tx: txCreatePaint, output_index: 0}]    [BigchainDB.Transaction.makeOutput(BigchainDB.Transaction.makeEd25519Condition(bob.publicKey))], 
    {datetime: new Date().toString(), 
      value: {value_eur: '30000000€', value_btc: '2100',}, })
    const signedTransfer = BigchainDB.Transaction.signTransaction(createTransfer, alice.privateKey)
    const signVal = conn.postTransactionCommit(signedTransfer)
  })





//querying for assest
conn.searchAssets('Madrid').then(painting => console.log('got serial :', painting))
