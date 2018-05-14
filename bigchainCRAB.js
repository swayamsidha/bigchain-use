"use strict";
var express = require('express');
var app = express();

var _bigchaindbOrm = require("bigchaindb-orm");

var _bigchaindbOrm2 = _interopRequireDefault(_bigchaindbOrm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//connect to bigchaindb

var bdbOrm = new _bigchaindbOrm2.default("http://localhost:9984/api/v1/");

//define model name and aditional info
//model name: represents the name of model you want to store
//aditional inf: extra info releted to model

bdbOrm.define("myModel", "https://schema.org/v1/myModel");

var aliceKeypair = new bdbOrm.driver.Ed25519Keypair();
console.log(aliceKeypair)
//creation of asset
var assetx;

bdbOrm.models.myModel.create({
  keypair: aliceKeypair,
  data: { name: 'coconut crab',
        species: 'crab',
        lives: 'pacific ocean' }

}).then(asset => {
  
  
  console.log(asset.data);
  //asset.data is data of last unspent transaction
  //asset.transactionHistory gives full raw transaction history
  asset.append({
        toPublicKey: aliceKeypair.publicKey,
        keypair: aliceKeypair,
        data: { name: 'red-neck crab',
                species: 'crab',
                lives: 'pacific ocean'
                }
  }).then(updateAsset => {
        console.log(updateAsset.data)
  })
  });
//retrival of asset

bdbOrm.models.myModel.retrieve().then(function (assets) {
  console.log(assets.map(function (asset) {
    return asset.data;
  }));
});
//append transaction
//update(database) => append(blockchain)
/*
bdbOrm.models.myModel.append({
    keypair: aliceKeypair,
    data: { name: 'coconut crab',
            species: 'sweet water crab',
            lives: 'amazoan river' }
  }).then(updateAsset => {
  console.log(updatedAsset.data);
});*/

//delete(database) => burn(blockchain)

bdbOrm.models.myModel.create({
  keypair: aliceKeypair,
  data: { key: 'dataValue' }

}).then(function (asset) {
  return asset.burn({ keypair: aliceKeypair });
}).then(function (burnedAsset) {
  console.log(burnedAsset.data);
});

