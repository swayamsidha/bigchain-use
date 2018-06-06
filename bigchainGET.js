var ex = require('express')
var app = ex()
var ax = require('axios')
var big = require('./bigchain_test2')
//var mongoose = require('mongodb').Client;
//mongoose.connect('mongodb://root:toor@ds159489.mlab.com:59489/nihaldb')
//var bigchainRouter = function(app){
  var query="spark55"
  var id
  var meta=[]
  var pubK
  var assetData=[]
  //getting the asset data
  
  
app.set('view engine', 'ejs'); 
var abc = "http://10.42.0.1:32809/api/v1/"
app.listen(9191, function(){
        console.log("app is running")
})
//creating asset and transfering it
/*app.get("/send", function(req, res){
  res.render('post.ejs')
})*/
app.post("/send", function(req, res){
  var assetdata = {
    'bicycle': {
                'serial_number': 'spark55',
                'manufacturer': 'TI india',
                'type': 'trans roader',
                'color': 'red'
        }
  
  }
  var metadata = {
    'network' : 'blockchain'
  }
  big.createAndTransfer(assetdata, metadata)
})
app.get("/", function(req, res){
    ax.get(abc+"assets?search="+query).then(x =>{
    if(assetData == []){
      res.status("200").send("no data")
    }
    res.send(x.data)
    assetData.push(x.data[0])
    console.log(assetData)
    })
  })
//getting transaction data
app.get("/transaction", function(req, res){
  ax.get(abc+"transactions/"+assetData[0].id).then(y =>{
    res.send(y.data)
    meta.push(y.data.metadata)
    console.log(meta[0])
  })
})
//accessing metadata
app.get("/metadata", function(req, res){
  ax.get(abc+"metadata?search="+meta[0].quantity).then(a => {
    res.send(a.data)
  })
})
//getting validators in local node
app.get("/valid", function(req, res){
  ax.get(abc+"validators/").then(b => {
    res.send(b.data)
  })
})
//

