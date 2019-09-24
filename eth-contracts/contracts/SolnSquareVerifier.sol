pragma solidity ^0.5.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./SquareVerifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

    Verifier public verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 tokenId;
        address owner;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 tokenId, address owner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 tokenId, address owner, bytes32 key) public {
        Solution memory solution = Solution({tokenId: tokenId, owner: owner});
        solutions.push(solution);
        uniqueSolutions[key] = solution;
        emit SolutionAdded(tokenId, owner);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewToken(
                uint tokenId,
                address owner,
                uint[2] memory a,
                uint[2][2] memory b,
                uint[2] memory c,
                uint[2] memory input) public
    {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[key].owner == address(0), "Solution has already been used");
        require(verifier.verifyTx(a, b, c, input), "Solution verification failed");
        addSolution(tokenId, owner, key);
        super.mint(owner, tokenId);
    }

}