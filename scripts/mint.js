const HDWalletProvider = require("truffle-hdwallet-provider")
const zokratesProof = require("../zokrates/code/square/proof.json");
const web3 = require('web3')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const MINT_COUNT = 12

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const contract = require('../eth-contracts/build/contracts/SolnSquareVerifier.json'); //(with path)
const ABI = contract.abi;

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (CONTRACT_ADDRESS) {
        const lutoken = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, { gasLimit: "1000000" })
        // Creatures issued directly to the owner.
        for (let i = 20; i < MINT_COUNT + 20; i++) {
            try {
                let proofs = Object.values(zokratesProof.proof);
                let inputs = zokratesProof.inputs;
                let tx = await lutoken.methods.addSolution(OWNER_ADDRESS, i, ...proofs, inputs).send({ from: OWNER_ADDRESS });
                console.log("Solution added. Transaction: " + tx.transactionHash);
                tx = await lutoken.methods.mint(OWNER_ADDRESS, i).send({ from: OWNER_ADDRESS });
                console.log("Minted item. Transaction: " + tx.transactionHash);
            } catch (e) {
                console.log(e);

            }
        }
    }
}

main()