/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const chip = ['Intel i5', 'Intel i6', 'Intel i7', 'AMD Ryzen', 'AMD threadlon'];
//const makes = ['Toyota', 'Ford', 'Hyundai', 'Volkswagen', 'Tesla', 'Peugeot', 'Chery', 'Fiat', 'Tata', 'Holden'];
const quantity = [1, 3, 5, 7, 9];
const verify = ['HZ: 2.9 GHz, Cores: 4, Threads: 8, Cache: 48MB', 'HZ: 3.3 GHz, Cores: 8, Threads: 32, Cache: 86MB', 'HZ: 3.6 GHz, Cores: 12, Threads: 20, Cache: 25MB', 'HZ: 3.4 GHz, Cores: 8, Threads: 16, Cache: 96'];

/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;
        let chipID_ = 'Client' + this.workerIndex + '_CHIP' + this.txIndex.toString();
        let chip_ = chip[Math.floor(Math.random() * chip.length)];
        let qty_ = quantity[Math.floor(Math.random() * quantity.length)];
        let verify_ = verify[Math.floor(Math.random() * verify.length)];
        let txnID = this.txIndex.toString();
        // CreateAsset
        let args1 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'CreateAsset',
            invokerIdentity: 'User1',
            contractArguments: [chipID_, chip_, qty_, verify_],
            timeout: 30
        };
        // Init
        let args2 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'Init',
            invokerIdentity: 'User1',
            contractArguments: [txnID, chipID_, "Org2MSP", "Org3MSP", verify_, "100", "10"],
            timeout: 30
        };
        // StartDelivery
        let args3 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'StartDelivery',
            invokerIdentity: 'User3',
            contractArguments: [txnID, "true"],
            timeout: 30
        };
        // InitiateDelivery
        let args4 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'InitiateDelivery',
            invokerIdentity: 'User1',
            contractArguments: [txnID, "true"],
            timeout: 30
        };
        // ConfirmDelivery
        let args5 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'ConfirmDelivery',
            invokerIdentity: 'User2',
            contractArguments: [txnID, "true"],
            timeout: 30
        };
        // verifyProducts
        let args6 = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'CreateAsset',
            invokerIdentity: 'User3',
            contractArguments: [txnID, verify_],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(args1);
        await this.sutAdapter.sendRequests(args2);
        await this.sutAdapter.sendRequests(args3);
        await this.sutAdapter.sendRequests(args4);
        await this.sutAdapter.sendRequests(args5);
        await this.sutAdapter.sendRequests(args6);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateCarWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
