import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry';

(async () => {
    await new TokenListProvider().resolve().then((tokens) => {
        const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();
        tokenList.forEach(function(el) {
            if (el.address.toUpperCase() == 'EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q'.toUpperCase())
                console.log(el)
        })
    });    
})()