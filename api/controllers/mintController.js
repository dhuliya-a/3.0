const fs = require('fs');
const uploadMetaDataHelper = require('../helpers/uploadMetaDataHelper');
const mintNFTHelper = require('../helpers/mintNFTHelper');
const apiKeyHelper = require('../helpers/apiKeyHelper');

module.exports = {
    async mintAssets(req, res) {
        let model = req.body;
        let user_name = model.user_name;
        let mint_to_address = model.mint_to_address;
        let chain = model.chain;
        let collection_name = model.collection_name;
        
        try {

            let apiKey = await apiKeyHelper.generateAPIKey();

            // upload metadata to IPFS
            await uploadMetaDataHelper.uploadMetadataToIPFS(user_name);
            console.log(new Date(), ' Sucessfully uploaded metadata to IPFS');

            //create contract
            let transaction_hash = await mintNFTHelper.deployNFTContract(mint_to_address, chain, collection_name, apiKey)
            console.log(new Date(), ' created contract with transaction hash: ', transaction_hash);

            // 5 seconds delay
            console.log(new Date(), '5 seconds delay ...')
            await mintNFTHelper.sleep(10000);

            contract_id = await mintNFTHelper.getContractAddress(transaction_hash, chain, apiKey);
            console.log(new Date(), ' created contract with address: ', contract_id)

            //mint the images as NFTs
            await mintNFTHelper.mintNFTs(user_name, mint_to_address, chain, contract_id, apiKey);

            // Delete the users data
            let buildDirImages = `${process.cwd()}/${user_name}/`
            if (fs.existsSync(buildDirImages)) {
                fs.rmdirSync(buildDirImages, { recursive: true });
            }

            let openseaURL = chain.toLowerCase() == 'rinkeby' ? 'https://testnets.opensea.io/' : 'https://opensea.io/'
            openseaURL = openseaURL + mint_to_address

            res.send({"status":true, "message":"NFTs successfully minted", "opensea_url": openseaURL})
            res.end();

        } catch (err) {
            console.log(err);
            res.status(500).send({"status":false, "message":"Error minting NFTs"})
            res.end();

        }
        
                
    }
}