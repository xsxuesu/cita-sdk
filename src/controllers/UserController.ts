import {Post,BodyParam ,JsonController,ContentType, Get} from 'routing-controllers';
import * as config from 'config';
import * as Peer from '../config/Peer';
import { logger } from '../common/logging';
import * as path from 'path';
import * as fs from 'fs';
import * as web3 from 'web3-utils';

@JsonController("/personal")
export class Users {
    peer: any;
    constructor() {
        let SDK = new Peer.Peer();
        this.peer = SDK.peer;
        logger.info(`had connected on peer : ${config.get('Peer.Url').toString()}`);
    }

    async getTransaction(abiName:String,addr :String){
        const contractPath = path.join("./contract",abiName);
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const con = new this.peer.base.Contract(abiJson, addr);
        const privateKey = config.get('adminPrivateKey').toString();
        const from = config.get('adminAddress').toString();
        const metaData = await this.peer.base.getMetaData();
        logger.info(`metaData : ${JSON.stringify(metaData)}`);
        const blockNumber = await this.peer.base.getBlockNumber();

        const transaction = {
          from: from,
          privateKey:privateKey,
          nonce: 999999,
          quota: 99999999,
          version: metaData.version,
          validUntilBlock: blockNumber+30,
          value: '0x0',
        };
        return {"con":con,"tx":transaction};
    }


    //queryGroups
    @Get('/querygroups')
    @ContentType("application/json")
    async getGroups() {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      // const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.queryGroups().call();
      return {"receipt":receipt};
    }

    //0x12707fDE828feD188970a5Bb06f8F5B507A6f735
    //0xf809356dc8b9dd8f445906726ee30b898b4302854f219e4a5c053acc0b5eee23
    @Post('/sign')
    @ContentType("application/json")
    async signMessage(@BodyParam("address") address: string,@BodyParam("message") message: string, @BodyParam("password") password: string) {
        let singedMessage = await this.peer.base.personal.sign(message, address,password);
        return {"singedMessage":singedMessage}; 
    }

    @Post('/create')
    @ContentType("application/json")
    async createAddress(@BodyParam("password") password: string) {
        let result = await this.peer.base.accounts.create(password);
        logger.info(`create address : ${JSON.stringify(result)}`);
        return {"address":result.address,"privateKey":result.privateKey}; 
    }

    @Post('/unlock')
    @ContentType("application/json")
    async unlockAddress(@BodyParam("address") address: string, @BodyParam("password") password: string) {
        const result = this.peer.base.accounts.unlockAccount(address, password);
        logger.info(`create address : ${JSON.stringify(result)}`);
        return {"result":result}; 
    }

    // admin
    @Post('/admin')
    @ContentType("application/json")
    async queryadminContract(
      @BodyParam("address") address: string
    ) {
        const contractPath = path.join("./contract","Admin.abi");
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const BatchContract = "0xffffffffffffffffffffffffffffffffff02000c";
       
        const con = new this.peer.base.Contract(abiJson, BatchContract);

        const receipt = await con.methods.admin().call()
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }
    //common/Admin.sol
    //0xffffffffffffffffffffffffffffffffff02000c
    @Post('/isadmin')
    @ContentType("application/json")
    async adminContract(
      @BodyParam("address") address: string
    ) {
        const contractPath = path.join("./contract","Admin.abi");
        const abiJson = JSON.parse(fs.readFileSync(contractPath).toString());
        logger.info(`contractinfo : ${abiJson}`);
        const BatchContract = "0xffffffffffffffffffffffffffffffffff02000c";
       
        const con = new this.peer.base.Contract(abiJson, BatchContract);

        const receipt = await con.methods.isAdmin(address).call()
        logger.info(`receipt:${JSON.stringify(receipt)}`)
        return {"receipts":receipt};
    }
    //update
    @Post('/updateadmin')
    @ContentType("application/json")
    async updateadminContract(
        @BodyParam("from") from: string,
        @BodyParam("privatekey") privatekey: string,
        @BodyParam("address") address: string
    ) {
      const contractPath = path.join("./contract","Admin.abi");
      const contractinfo = JSON.parse(fs.readFileSync(contractPath).toString());
      const BatchContract = "0xffffffffffffffffffffffffffffffffff02000c";
      const con = new this.peer.base.Contract(contractinfo, BatchContract);

      const blockNumber = await this.peer.base.getBlockNumber();
      const metaData = await this.peer.base.getMetaData();
      logger.info(`metaData : ${JSON.stringify(metaData)}`);
      // const privateKey = '0xf97a6a9cfeade639d798f005ad9d8a43241f5799cddad7bb331de89ae297dbe1';

      const transaction = {
        from: from,
        privateKey:privatekey,
        nonce: 999999,
        quota: 9999999,
        version: metaData.version,
        validUntilBlock: blockNumber+30,
        value: '0x0',
      };

      const receipt = await con.methods.update(address).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    // 
    //new group
    @Post('/newgroup')
    @ContentType("application/json")
    async newGroupContract(
        @BodyParam("origin") _origin: string,
      @BodyParam("name") _name: string,
      @BodyParam("accounts") _accounts: string[]
    ) {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      const transaction = (await conTx).tx;
      const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.newGroup(_origin,name_bytes,_accounts).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    // deleteGroup
    @Post('/delgroup')
    @ContentType("application/json")
    async delGroupContract(
        @BodyParam("origin") _origin: string,
        @BodyParam("target") _target: string
    ) {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      const transaction = (await conTx).tx;
  
      const receipt = await con.methods.deleteGroup(_origin,_target).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    // updateGroupName
    @Post('/upgradegroup')
    @ContentType("application/json")
    async upgradeContract(
        @BodyParam("origin") _origin: string,
        @BodyParam("target") _target: string,
        @BodyParam("name") _name: string
    ) {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      const transaction = (await conTx).tx;
      const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.updateGroupName(_origin,_target,name_bytes).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }
    
    //add account to group
    @Post('/addaccountsgroup')
    @ContentType("application/json")
    async addgroupContract(
        @BodyParam("origin") _origin: string,
        @BodyParam("target") _target: string,
        @BodyParam("accounts") _accounts: string[]
    ) {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      const transaction = (await conTx).tx;
      // const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.addAccounts(_origin,_target,_accounts).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    //delete accounts from group
    @Post('/delaccountsgroup')
    @ContentType("application/json")
    async delaccountsGroupContract(
        @BodyParam("origin") _origin: string,
        @BodyParam("target") _target: string,
        @BodyParam("accounts") _accounts: string[]
    ) {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      const transaction = (await conTx).tx;
      // const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.deleteAccounts(_origin,_target,_accounts).send(transaction);
      const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"listener":listeners};
    }

    // updateGroupName
    @Post('/querygroups')
    @ContentType("application/json")
    async queryGroupContract() {
      const conTx = this.getTransaction("GroupManagement.abi","0xFFFffFFfffffFFfffFFffffFFFffFfFffF02000a");
      const con = (await conTx).con;
      // const transaction = (await conTx).tx;
      // const name_bytes = web3.utils.hexToBytes(web3.utils.utf8ToHex(_name));
      const receipt = await con.methods.queryGroups().call();
      // const listeners = await this.peer.listeners.listenToTransactionReceipt(receipt.hash);
      return {"receipt":receipt};
    }

//     name	permission
// sendTx	表示发交易权限
// createContract	表示创建合约权限
// newPermission	表示创建一个新的权限权限
// deletePermission	表示删除一个权限权限
// updatePermission	表示更新一个权限权限
// setAuth	表示对账号进行授权权限
// cancelAuth	表示对帐号取消授权权限
// newRole	表示创建一个新的角色权限
// deleteRole	表示删除一个角色权限
// updateRole	表示更新一个角色权限
// setRole	表示对账号授予角色权限
// cancelRole	表示对帐号取消授予角色权限
// newGroup	表示创建一个新组权限
// deleteGroup	表示删除一个组权限
// updateGroup	表示更新一个组权限
// newNode	表示增加普通节点权限
// deleteNode	表示删除节点权限
// updateNode	表示更新节点权限
// accountQuota	表示账户配额设置权限
// blockQuota	表示块配额设置权限
// batchTx	表示批量交易权限
// ermergencyBrake	表示紧急制动权限
// quotaPrice	表示设置 quotaPrice 权限
// version	表示设置版本权限
}