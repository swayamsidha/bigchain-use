var ex = require('express')
var app = ex()
var ax = require('axios')
//var bigchainRouter = function(app){
  var query="cde"
  var id
  var meta=[]
  var pubK
  var assetData=[]
  //getting the asset data
  
  
 
var abc = "https://test.bigchaindb.com/api/v1/"
app.get("/", function(req, res){
    ax.get(abc+"assets?search="+query).then(x =>{
    if(assetData == []){
      res.status("200").send("no data")
    }
    res.send(x.data)
    assetData.push(x.data[0])
    //console.log(assetData)
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
  ax.get(abc+"metadata?search="+meta[0].planet).then(a => {
    res.send(a.data)
  })
})
app.listen(8080, function(){
        console.log("app is running")
})
