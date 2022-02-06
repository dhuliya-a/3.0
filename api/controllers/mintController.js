const fs = require('fs');
const uploadMetaDataHelper = require('../helpers/uploadMetaDataHelper');
const mintNFTHelper = require('../helpers/mintNFTHelper');

module.exports = {
    async mintAssets(req, res) {
        let model = req.body;
        let user_name = model.user_name;
        let mint_to_address = model.mint_to_address;
        let chain = model.chain;
        let collection_name = model.collection_name;
        
        try {
            // upload metadata to IPFS
            await uploadMetaDataHelper.uploadMetadataToIPFS(user_name);
            console.log(new Date(), ' Sucessfully uploaded metadata to IPFS');

            //create contract
            let transaction_hash = await mintNFTHelper.deployNFTContract(mint_to_address, chain, collection_name)
            console.log(new Date(), ' created contract with transaction hash: ', transaction_hash);

            // 5 seconds delay
            console.log(new Date(), '5 seconds delay ...')
            await mintNFTHelper.sleep(5000);

            contract_id = await mintNFTHelper.getContractAddress(transaction_hash, chain);
            console.log(new Date(), ' created contract with address: ', contract_id)

            //mint the images as NFTs
            await mintNFTHelper.mintNFTs(user_name, mint_to_address, chain, contract_id);

            // Delete the users data
            let buildDirImages = `${process.cwd()}/${user_name}/`
            if (fs.existsSync(buildDirImages)) {
                fs.rmdirSync(buildDirImages, { recursive: true });
            }

            res.send({"status":true, "message":"NFTs successfully minted"})
            res.end();

        } catch (err) {
            console.log(err);
            res.status(500).send({"status":false, "message":"Error minting NFTs"})
            res.end();

        }
        
                
    }
}