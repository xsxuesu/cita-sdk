import { Get,Post,Param,BodyParam, JsonController,ContentType} from 'routing-controllers';
import * as Peer from '../config/Peer';
import * as config from 'config';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';
import * as web3 from 'web3-utils';
import * as abi from 'web3-eth-abi';
import * as web3_acc from 'web3-eth-accounts';
import { UV_UDP_REUSEADDR } from 'constants';

@JsonController("/sys")
export class SysController {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
      }

    async getConTx(abi:string,addr:string){
      // logger.info(`contractname : ${contractname}`);
      const contractPath = path.join("./contract",abi);
      // logger.info(`contractinfo : ${fs.readFileSync(contractPath).toString()}`);
      const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
      // logger.info(`contractinfo : ${abiJson}`);
      const con = new this.peer.base.Contract(abiJson, addr);
      const privateKey = config.get('adminPrivateKey').toString();
      const from = config.get('adminAddress').toString();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      const blockNumber = await this.peer.base.getBlockNumber();
      logger.info(`from : ${from}`);
      const transaction = {
        from: from,
        privateKey:privateKey,
        nonce: 999999,
        quota: 999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };
      return {"con":con,"tx":transaction};
    }

    @Post('/permissiontx')
    @ContentType("application/json")
    async txContract(@BodyParam("address") address: string) {
      const contx = this.getConTx("PermissionManagement.abi","0xffffffffffffffffffffffffffffffffff020004");
      const con = (await contx).con;
      const transaction = (await contx).tx;
      const receipt = await con.methods.setAuthorizations(address,["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
      return {"receipt":receipt};
    }


    @Post('/permissioncontract')
    @ContentType("application/json")
    async deployContract(@BodyParam("address") address: string) {
        const contx = this.getConTx("PermissionManagement.abi","0xffffffffffffffffffffffffffffffffff020004");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        const receipt = await con.methods.setAuthorizations(address,["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
        return {"receipt":receipt};
    }

    @Post('/cancelpermissiontx')
    @ContentType("application/json")
    async canceltxContract(@BodyParam("address") address: string) {
        const contx = this.getConTx("PermissionManagement.abi","0xffffffffffffffffffffffffffffffffff020004");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        const receipt = await con.methods.cancelAuthorizations(address,["ffffffffffffffffffffffffffffffffff021000"]).send(transaction);
        return {"receipt":receipt};
    }

    @Post('/cancelpermissioncontract')
    @ContentType("application/json")
    async cancelContract(@BodyParam("address") address: string) {
        const contx = this.getConTx("PermissionManagement.abi","0xffffffffffffffffffffffffffffffffff020004");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        const receipt = await con.methods.cancelAuthorizations(address,["ffffffffffffffffffffffffffffffffff021001"]).send(transaction);
        return {"receipt":receipt};
    }
    
    @Post('/multitx')
    @ContentType("application/json")
    async multitxContract(
      @BodyParam("address") address: string,
      @BodyParam("values") _values:Number[]
    ) {

        const contx = this.getConTx("BatchTx.abi","0xffffffffffffffffffffffffffffffffff02000e");
        const con = (await contx).con;
        const transaction = (await contx).tx;
       
        var receipts = [];
        var body = [] ;
        var _addrFun ;
        for (let index = 0; index < _values.length; index++) {
          const _value = web3.utils.hexToBytes(web3.utils.toHex(_values[index]));
          var _encode = abi.encodeFunctionCall({
            name: 'set',
            type: 'function',
            inputs: [{
              "internalType": "uint256",
              "name": "x",
              "type": "uint256"
            }]
          }, [_value]);
          logger.info(`_value : ${_value}`);
          logger.info(`_encode : ${_encode}`);
          logger.info(`_encode : ${web3.utils.hexToBytes(_encode).length}`);
          const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
          logger.info(`rlplength : ${rlplength}`);
          const left_rlp_length = web3.utils.padLeft(rlplength, 8);
          logger.info(`left_rlp_length : ${left_rlp_length}`);
          //${left_rlp_length.replace("0x","")}
          if (_addrFun == undefined){
            _addrFun = `0x${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }else{
            _addrFun = `${_addrFun}${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }
        }
        logger.info(`_addrFun : ${_addrFun}`);
        const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
        const receipt = await con.methods.multiTxs(_addrFunBytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }



    @Post('/multitx3')
    @ContentType("application/json")
    async multitxContract3(
      @BodyParam("address") address: string,
      @BodyParam("ids") _ids:String[],
      @BodyParam("stages") _stages:String[],
      @BodyParam("values") _values:String[]
    ) {

        const contx = this.getConTx("BatchTx.abi","0xffffffffffffffffffffffffffffffffff02000e");
        const con = (await contx).con;
        const transaction = (await contx).tx;
       
        var _addrFun;
        for (let index = 0; index < _ids.length; index++) {
          const _id = web3.utils.hexToBytes(web3.utils.utf8ToHex(_ids[index]));
          const _stage = web3.utils.hexToBytes(web3.utils.utf8ToHex(_stages[index]));
          var _encode = abi.encodeFunctionCall({
            name: 'setLists',
            type: 'function',
            inputs: [{
            "internalType": "bytes",
            "name": "_id",
            "type": "bytes"
            },{
              "internalType": "bytes",
              "name": "_v",
              "type": "bytes"
              }]}, [_id,_stage]);
          logger.info(`_encode : ${_encode}`);
          const rlplength = web3.utils.toHex(web3.utils.hexToBytes(_encode).length);
          logger.info(`rlplength : ${rlplength}`);
          const left_rlp_length = web3.utils.padLeft(rlplength, 8);
          logger.info(`left_rlp_length : ${left_rlp_length}`);
          if (_addrFun == undefined){
            _addrFun = `0x${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }else{
            _addrFun = `${_addrFun}${address.replace("0x","")}${left_rlp_length.replace("0x","")}${_encode.replace("0x","")}`;
          }
        }
        logger.info(`_addrFun:${_addrFun}`)
        const _addrFunBytes = web3.utils.hexToBytes(_addrFun);
        const receipt = await con.methods.multiTxs(_addrFunBytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }


    @Post('/setwebsite')
    @ContentType("application/json")
    async websiteContract3(
      @BodyParam("website") _website:string
    ) {

        const contx = this.getConTx("SysConfig.abi","0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        
        const receipt = await con.methods.setWebsite(_website).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }

    @Post('/setchainname')
    @ContentType("application/json")
    async chainnameContract(
      @BodyParam("chainname") _chainname:string
    ) {

        const contx = this.getConTx("SysConfig.abi","0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
        const con = (await contx).con;
        const transaction = (await contx).tx;
       
        const receipt = await con.methods.setChainName(_chainname).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }
    
    @Post('/setoperator')
    @ContentType("application/json")
    async operatorContract(
      @BodyParam("operator") _operator:string
    ) {

        const contx = this.getConTx("SysConfig.abi","0xFFfffFFfFfFffFFfFFfffFffFfFFFffFFf020000");
        const con = (await contx).con;
        const transaction = (await contx).tx;
       
        const receipt = await con.methods.setOperator(_operator).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }

    @Post('/setversion')
    @ContentType("application/json")
    async versionContract(
      @BodyParam("version") _version:Number
    ) {

        const contx = this.getConTx("VersionManager.abi","0xFffFffFffFfFFfFfffFffffffffFffFfFF021028");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        
        const receipt = await con.methods.setVersion(_version).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }

    @Post('/newrole')
    @ContentType("application/json")
    async roleContract(
      @BodyParam("role") _role:string,
      @BodyParam("addresses") _addrs:string[]
    ) {

      const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
      const con = (await contx).con;
      const transaction = (await contx).tx;
      const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
      // const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
      const receipt = await con.methods.newRole(role_bytes,_addrs).send(transaction);
      logger.info(`receipt:${JSON.stringify(receipt)}`)
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    @Post('/deleterole')
    @ContentType("application/json")
    async delroleContract(
      @BodyParam("role") _role:string
    ) {

        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
     
        const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.deleteRole(role_bytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }
    //updateRoleName

    @Post('/updaterole')
    @ContentType("application/json")
    async updateroleContract(
      @BodyParam("addrole") _addr_role:string,
      @BodyParam("role") _role:string
    ) {

        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
      
        const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.updateRoleName(_addr_role,role_bytes).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    //addPermissions

    @Post('/addpermission')
    @ContentType("application/json")
    async addPermissionContract(
      @BodyParam("addrole") _addr_role:string,
      @BodyParam("addrs") _addrs:string[]
    ) {

        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
      
        //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.addPermissions(_addr_role,_addrs).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    //deletePermissions
    @Post('/delpermission')
    @ContentType("application/json")
    async delPermissionContract(
      @BodyParam("addrole") _addr_role:string,
      @BodyParam("addrs") _addrs:String[]
    ) {

        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
      
        //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.deletePermissions(_addr_role,_addrs).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }


    //deletePermissions
    @Post('/canclerole')
    @ContentType("application/json")
    async cancelRoleContract(
      @BodyParam("account") _account:string,
      @BodyParam("role") _role:string
    ) {
        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.cancelRole(_account,_role).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }


    //clearRole
    @Post('/clearrole')
    @ContentType("application/json")
    async clearRoleContract(
      @BodyParam("account") _account:string
    ) {
        const contx = this.getConTx("RoleManager.abi","0xffffffffffffffffffffffffffffffffff020007");
        const con = (await contx).con;
        const transaction = (await contx).tx;
        //const role_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_role));
        const receipt = await con.methods.clearRole(_account).send(transaction);
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
        return {"listener":listeners};
    }
}