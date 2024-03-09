from pprint import pprint
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from spl.token.client import Token

token_addr = "EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q"
paid_node = 'https://thrumming-evocative-bird.solana-mainnet.quiknode.pro/XXX/'
free_node = 'https://docs-demo.solana-mainnet.quiknode.pro/'
#endpoint = 'https://api.devnet.solana.com'    # probably for `developing`
#endpoint = 'https://api.testnet.solana.com'   # probably for `testing`
#endpoint = 'https://api.mainnet-beta.solana.com'
#endpoint = 'https://solana-api.projectserum.com'

solana_client = Client(free_node)

# find largest holder
largest_accounts = solana_client.get_token_largest_accounts(Pubkey.from_string(token_addr))

if len(largest_accounts.value) == 0:
    print("No account")
    exit(1)

largest_account = largest_accounts.value[0].address
print("First largest holder's token account:", largest_account, largest_accounts.value[0].amount.ui_amount)

# find owner
pprint(solana_client.get_account_info(largest_account).value)

for account in largest_accounts.value:
    print("Others:", account.address)