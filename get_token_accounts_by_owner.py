from pprint import pprint
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from spl.token.client import Token
from solana.rpc.types import TokenAccountOpts

token_addr = "EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q"
owner_addr = "EXqYZtA1d4Nx2WjYuQ1GvdeujFM8VbvmjfdmJBJj7guc"
free_node = 'https://docs-demo.solana-mainnet.quiknode.pro/'

solana_client = Client(free_node)

response = solana_client.get_token_accounts_by_owner_json_parsed(Pubkey.from_string(owner_addr), TokenAccountOpts(mint=Pubkey.from_string(token_addr)))
pprint(response.value)