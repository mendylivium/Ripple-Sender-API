/*******************************************
 * Created by Rommel A, Mendiola
 * Ripple Simple Send API
*******************************************/

//Added when Ripple SSL expired, causing error to API
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


const version 		= 1.0;

//Configure this to you Address and Secret Key
const main_address	= 'r4SyTtmHZT8MkxEGxQX1vuU55vjFnoR9oL';
const main_secret	= 'shqADn4T9PQuefGKdwJQxSyHWN5PL';

const http			= 	require('http');
const url 			= 	require('url');

 
var data = { result:"error", text:"Not Modified" };

http.createServer(async function (req, res) {
	
	const RippleAPI 	=	require('ripple-lib').RippleAPI;
	//const api 			=	new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'}); 
	const api = new RippleAPI({server: 'wss://s1.ripple.com'});	
	const query			=	url.parse(req.url,true).query;	
	const paths			= 	url.parse(req.url).pathname;	
	const api_method 	= 	paths.split("/")[1];
	
	if(api_method.length<1) {
		data = { 'result':'error', 'text':'No Method Specified'};
	} else {
		

		
			await api.connect();
			try {
			
				switch(api_method) {
					
					case "ping":
						data = { 'result':'success', 'text':'Online!'};
					break;
					
					case "get_account":
						if(typeof query['address']==='undefined') {
							data = { 'result':'error', 'text':'XRP Address is not Defined'};
						} else {
							
							const address 		= query['address'];
							const info = await api.getAccountInfo(address);
							
							data = info;
							data['result'] 	= 'success';
							data['text']	= 'Validation Success';
						}
					break;
					
					case "get_transaction":
						if(typeof query['hash']==='undefined') {
							data = { 'result':'error', 'text':'XRP Address is not Defined'};
						} else {
							const hash	= query['hash'];
							const info = await api.getTransaction(hash);
							
							data = info;
							data['result'] = 'success';
						}	
					break;
					
					case "send_payment":
						if(typeof query['address']==='undefined') {
							data = { 'result':'error', 'text':'XRP Address is not Defined'};
						} else if(typeof query['amount']==='undefined') {
							data = { 'result':'error', 'text':'Ammount is not Defined'};
						} else if(isNaN(query['amount'])) {
							data = { 'result':'error', 'text':'Ammount must be numeric'};
						} else {
							const address 		= query['address'];
							const destination_tag = (typeof query['dst']==='undefined') ? 0 : parseInt(query['dst']);
							const source_tag = 	(typeof query['src']==='undefined') ? 0 : parseInt(query['src']);
							const amount 			= query['amount']+'';
							const instructions = {maxLedgerVersionOffset: 5};
							const payment = {
								source: {
									address: main_address, tag: source_tag,
									maxAmount: { value: amount, currency: 'XRP' }
								},
								destination: {
									address: address, tag: destination_tag,
									amount: { value: amount, currency: 'XRP' }
								}
							};
							
							const prepared = await api.preparePayment(main_address, payment, instructions);
							const {signedTransaction, id} = api.sign(prepared.txJSON, main_secret);
							
							const result = await api.submit(signedTransaction);
							data = result;
						}
					break;
					
					default:
						data = { 'result':'error', 'text':'No Method' };
					break;
				}
			
			} catch(e) {
				data = { 'result':'error', 'text':e['name'] };
			}
			
			api.disconnect();
	}
	
	data['api_method']	= api_method;
	data['version'] = version;
	
	res.end(JSON.stringify(data));
	
	
}).listen(3035);