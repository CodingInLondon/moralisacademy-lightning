var express = require('express');
var router = express.Router();

const BTCPAY_PRIV_KEY = process.env.BTCPAY_PRIV_KEY;
const BTCPAY_MERCHANT_KEY = process.env.BTCPAY_MERCHANT_KEY;


// Initialize the client
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(BTCPAY_PRIV_KEY, 'hex'));
const client = new btcpay.BTCPayClient('https://lightning.filipmartinsson.com', keypair, {merchant: BTCPAY_MERCHANT_KEY})


/* get & verify invoice. */
router.get('/:id', async function(req, res, next) {
    var invoiceId = req.params.id;
    client.get_invoice(invoiceId)
        .then(invoice => {
            console.log(invoice)

            if ((invoice.status == "complete" ) || (invoice.status == "paid)")){
                res.render("paid", {price: invoice.price, currency: invoice.currency, buyer: invoice.buyer})
            }
            else
                res.render("notpaid", {price: invoice.price, currency: invoice.currency, buyer: invoice.buyer});


        }).catch(error =>{console.log(error);})

});

/* Create invoice. */
router.post('/', function(req, res, next) {
    var dollarAmount = req.body.product;
    var buyerEmail = req.body.email;
    var buyerName = req.body.custname;
    var buyerAddress = req.body.address;

    client.create_invoice({
    price: dollarAmount, currency: "USD", 
    buyer: 
        {
        email: buyerEmail, 
        name: buyerName, 
        address1: buyerAddress}})
    .then(invoice => {
        res.render("invoice", {invoiceId: invoice.id});
    })
    .catch(err => {console.log(err)});
});


module.exports = router;
