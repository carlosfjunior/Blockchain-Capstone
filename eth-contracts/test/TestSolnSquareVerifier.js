const Verifier = artifacts.require('SquareVerifier')
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')

const proof = require('../../zokrates/code/square/proof')

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0]
    const account_two = accounts[1]
 
    beforeEach(async function () {
        const verifier = await Verifier.new({ from: account_one })
        this.contract = await SolnSquareVerifier.new(verifier.address, {from: account_one})
    })
    
    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('A new solution can be added', async function () {
        let solutionAdded = true
        try {
            // get a byte32 type key
            let key = "0x2a1acd26847576a128e3dba3aa984feafffdf81f7c7b23bdf51e7bec1c15944c";
            await this.contract.addSolution(2, account_two, key);
        } catch (e) {
            console.log(e);
            solutionAdded = false
        }
        assert.equal(solutionAdded, true, 'Solution should have been added')
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('An ERC721 token can be minted', async function () {
        let tokenMinted = true
        try {
            await this.contract.mintNewToken(
                20,
                account_two,
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                proof.inputs,
                { from: account_one }
            )
        } catch (e) {
            console.log(e);
            tokenMinted = false
        }

        assert.equal(tokenMinted, true, 'Token should be minted')
    })

    it('An ERC721 token can not be minted with incorrect proof', async function () {
        let tokenMinted = true
        try {
            const input = [
                '0x0000000000000000000000000000000000000000000000000000000000012345',
                '0x0000000000000000000000000000000000000000000000000000000000032100'
            ]

            await this.contract.mintToken(
                account_two,
                2,
                proof.proof.a,
                proof.proof.b,
                proof.proof.c,
                input,
                { from: account_one }
            )
        } catch (e) {
            tokenMinted = false
        }

        assert.equal(tokenMinted, false, 'Token should not be minted with incorrect proof')
    })

})
