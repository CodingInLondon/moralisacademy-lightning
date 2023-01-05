var express = require('express');
var router = express.Router();
const BTCPAY_PRIV_KEY = "4df8e0f77ff262fee5eb436ca0c9b0dac21581ea2ed71925dbd2b9f75e76b545";
const BTCPAY_MERCHANT_KEY = "2iaAU2ZpYFoBXVE67mjN9eEC7ueEEoZ2hu3zZvKspuUT";

// Initialize the client
const btcpay = require('btcpay')
const keypair = btcpay.crypto.load_keypair(new Buffer.from(BTCPAY_PRIV_KEY, 'hex'));
const client = new btcpay.BTCPayClient('https://lightning.filipmartinsson.com', keypair, {merchant: BTCPAY_MERCHANT_KEY})


/* get & verify invoice. */
router.get('/:id', async function(req, res, next) {
    var invoiceId = req.params.id;
    client.get_invoice(invoiceId)
        .then(invoice => {
            if ((invoice.status == "complete" ) || (invoice.status == "paid)")){
                res.end("<html>thankz</html>");
            
            }
            else
                res.end("<html>Not paid</html>");

        }).catch(error =>{console.log(error);})

});

/* Create invoice. */
router.post('/', function(req, res, next) {
    var dollarAmount = req.body.product;
    console.log('Amount: ' + dollarAmount);

    client.create_invoice({price: dollarAmount, currency: "USD"})
    .then(invoice => {
        console.log(invoice);
        res.render("invoice", {invoiceId: invoice.id});
    })
    .catch(err => {console.log(err)});
});


module.exports = router;
