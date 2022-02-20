const fetch = require("node-fetch");
const path = require("path");
const basePath = process.cwd();
const fs = require("fs");
const request = require('request');

const AUTH = process.env.API_KEY;
const TIMEOUT = 1000; 



async function mintNFTs(user_name, mint_to_address, chain, contract_id, api_key) {

    if (!fs.existsSync(path.join(`${basePath}/${user_name}/build`, "/minted"))) {
        fs.mkdirSync(path.join(`${basePath}/${user_name}/build`, "minted"));
    }

    const ipfsMetas = JSON.parse(
        fs.readFileSync(`${basePath}/${user_name}/build/ipfsMetas/_ipfsMetas.json`)
    );

    for (const meta of ipfsMetas) {
        const mintFile = `${basePath}/${user_name}/build/minted/${meta.custom_fields.edition}.json`;

        try {
        fs.accessSync(mintFile);
        const mintedFile = fs.readFileSync(mintFile)
        if(mintedFile.length > 0) {
            const mintedMeta = JSON.parse(mintedFile)
            if(mintedMeta.mintData.response !== "OK") throw 'not minted'
        }
        console.log(`${meta.name} already minted`);
        } catch(err) {
        try {
            let mintData = await fetchWithRetry(meta, mint_to_address, chain, contract_id, api_key)
            const combinedData = {
            metaData: meta,
            mintData: mintData
            }
            writeMintData(meta.custom_fields.edition, combinedData, user_name)
            console.log(`Minted: ${meta.name}!`);
        } catch(err) {
            console.log(`Catch: ${err}`)
        }
        }
    }
}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(meta, mint_to_address, chain, contract_id, api_key)  {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_meta) => {
      let url = "https://api.nftport.xyz/v0/mints/customizable";

      const mintInfo = {
        chain: chain,
        contract_address: contract_id,
        metadata_uri: _meta.metadata_uri,
        mint_to_address: mint_to_address,
        token_id: _meta.custom_fields.edition,
      };

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: api_key,
        },
        body: JSON.stringify(mintInfo),
      };

      return fetch(url, options).then(async (res) => {
        const status = res.status;

        if(status === 200) {
          return res.json();
        }            
        else {
          console.error(`ERROR STATUS: ${status}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_meta)
        }            
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_meta)
        }
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_meta)
      });
    }          
    return fetch_retry(meta);
  });
}

const writeMintData = (_edition, _data, user_name) => {
  fs.writeFileSync(`${basePath}/${user_name}/build/minted/${_edition}.json`, JSON.stringify(_data, null, 2));
};

async function deployNFTContract(mint_to_address, chain, collection_name, api_key) {
    
    return new Promise((resolve, reject) => {
        let contract_options = {
            method: 'POST',
            url: 'https://api.nftport.xyz/v0/contracts',
            headers: {
                'Content-Type': 'application/json',
                Authorization: api_key
            },
            body: {
                chain: chain,
                name: collection_name,
                symbol: 'C',
                owner_address: mint_to_address,
                type: 'erc721'
            },
            json: true
        };
        request(contract_options, function (error, response, body) {
            if (error) return reject(error);
      
            let transaction_hash = body.transaction_hash;
            return resolve(transaction_hash);
            
        });
    });
}

async function getContractAddress(transaction_hash, chain, api_key) {
    return new Promise((resolve, reject) => {

        let options = {
        method: 'GET',
        url: 'https://api.nftport.xyz/v0/contracts/'+ transaction_hash,
        qs: {chain: chain},
        headers: {
            'Content-Type': 'application/json',
            Authorization: api_key
        }
        };

        request(options, function (error, response, body) {
            if (error) return reject(error);

            console.log(body, JSON.parse(body).contract_address)

            return resolve(JSON.parse(body).contract_address)
        });
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

module.exports = {mintNFTs, deployNFTContract, getContractAddress, sleep};