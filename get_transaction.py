from pprint import pprint
from solana.rpc.api import Client
from solders.signature import Signature

solana_client = Client("https://docs-demo.solana-mainnet.quiknode.pro/")

sig = Signature.from_string("D13jTJYXoQBcRY9AfT5xRtsew7ENgCkNs6mwwwAcUCp4ZZCEM7YwZ7en4tVsoDa7Gu75Jjj2FgLXNUz8Zmgedff")
pprint(solana_client.get_transaction(sig, "jsonParsed", max_supported_transaction_version=0))