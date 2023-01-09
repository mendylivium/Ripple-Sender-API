## Ripple Simple Sender API
#### Modify this, to your Address and Secret Key
```
const main_address	= 'r4SyTtmHZT8MkxEGxQX1vuU55vjFnoR9oL'; //this is your address
const main_secret	= 'shqADn4T9PQuefGKdwJQxSyHWN5PL'; //this is your secret key
```
#### Run this using node or pm2
### How to use ?
#### Call this API using 'GET' method.
##### Use PING to check if API is reachable
> /ping
  - Returns in JSON format - Checks if the API is reachable
  
> /get_transaction?hash=RIPPLE_TRANSACTION_HASH
  - Returns in JSON format - Get the transaction detail in Ripple Ledger 
  
> /send_payment?address=RECIPIENT_ADDR&amount=AMOUNT_IN_DROPS&dst=DESTINATION_TAG&src=SOURCE_TAG
  - Sends payment to the given recipient`s details.
    - RECIPIENT_ADDR: Recipient XRP Address
    - AMOUNT_IN_DROPS: This is 1/1MILLION - Means 1 Drops = 0.000001 XRP
    - DESTINATION_TAG: Recipient Destination Tag / Other Wallet call this Memo
    - SOURCE_TAG: Optional but useful to Identify the user who sending a payment
