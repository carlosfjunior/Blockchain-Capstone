var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('CustomERC721Token', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2]
    const account_four = accounts[3]
    const account_five = accounts[4]
    const account_six = accounts[5]

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, { from: account_one })
            await this.contract.mint(account_three, 2, { from: account_one })
            await this.contract.mint(account_four, 3, { from: account_one })
            await this.contract.mint(account_five, 4, { from: account_one })
            await this.contract.mint(account_six, 5, { from: account_one })
        })

        it('should return total supply', async function () { 
            let count = await this.contract.totalSupply.call()
            const expectedCount = 5
            assert.equal(count.toNumber(), expectedCount,`Total tokens should be ${expectedCount}`)
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf.call(account_four, {from: account_one})
            const expectedBalance = 1
            assert.equal(balance.toNumber(), expectedBalance, `Account balance should be ${expectedBalance}`)
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let _tokenURI = await this.contract.tokenURI.call(1, {from: account_one})
            const expectedTokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1'
            assert(_tokenURI == expectedTokenURI,`TokenURI of the token must be ${expectedTokenURI}`)
        })

        it('should transfer token from one owner to another', async function () { 
            const tokenId = 1
            const ownerBeforeTransfer = await this.contract.ownerOf(tokenId, {from: account_four})
            await this.contract.transferFrom(account_two, account_four, tokenId, {from: account_two})
            const ownerAfterTransfer = await this.contract.ownerOf(tokenId)
            assert.equal(ownerBeforeTransfer, account_two, 'Owner before transfer should be account_two')
            assert.equal(ownerAfterTransfer, account_four, 'Owner after transfer should be account_four')  
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let tokenMintedFailed = true
            try {
                await this.contract.mint(account_three, 20, { from: account_two })
            } catch (e) {
                tokenMintedFailed = false
            }
      
            assert.equal(tokenMintedFailed, false, 'Token minted when sending a message from account that does not own contract')
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.contractOwner.call({ from: account_one })
            assert.equal(owner, account_one, 'account_one should be contract owner')
        })

    });
})