const express = require('express')
const router = express.Router()
const transaction = require('../model/db')

//get all transactions
router.get('/', async (req,res)=>{
    try{
        const trans = await transaction.find()
        res.json(trans); 
    }catch(e){
        res.send('Something Went Wrong ' + e)
    }
});

//get transactions by wallet address
router.post('/address', async (req,res)=>{
    try{
        var address = req.body.address;
        console.log(address)
        const tran = await transaction.findOne({address: address});
        console.log(tran);
        res.json(tran); 
    }catch(e){
        res.send('Something Went Wrong ' + e)
    }
});

//post the transaction to database
router.post('/', async(req,res)=>{
    var address = req.body.address
    const tran = await transaction.findOne({address: address});
    //console.log(tran.address)
    console.log(req.body.address + "body")
        const trans = new transaction({
            address: req.body.address,
            balance: req.body.balance
        })
        //update the transaction
        if(tran == req.body.address){
            const filter = {address: trans.address}
            const update = {balance: trans.balance + tran.balance}
            let doc = await transaction.findOneAndUpdate(filter, update,{
            new:true
            });
        }
        else{
        try{
            const trans1 = await trans.save()
            res.json(trans1)
        }catch(e){
            res.send('Something Went Wrong ' + e)
        }
    }
        });

//delete the transcation
router.post('/delete', async(req,res)=>{
    var address = req.body.address
        console.log(address)
        const tran = await transaction.deleteOne({address: address});
        res.json(tran)
        res.send(`Transaction with the Address ${req.params.address}`)
})

module.exports = router;