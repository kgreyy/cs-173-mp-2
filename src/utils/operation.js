// TODO 6 - Call buy_ticket entrypoint in the Lottery contract by completing buyTicketOperation

import { contract_address, tezos } from "./tezos";


export const addBalanceOwnerOperation = async (amount_out) => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.addBalanceOwner().send({
            amount: amount_out,
            mutez: false,
        })
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const addBalanceCounterpartyOperation = async (amount_out) => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.addBalanceCounterparty().send({
            amount: amount_out,
            mutez: false,
        })
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const claimCounterpartyOperation = async (secret) => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.claimCounterparty(secret).send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};


export const claimOwnerOperation = async () => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.claimOwner().send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const initiateOwnerWithdrawOperation = async () => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.initiateOwnerWithdraw().send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const initiateCounterpartyWithdrawOperation = async () => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.initiateCounterpartyWithdraw().send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const initiateAdminRefundOperation = async () => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.initiateAdminRefund().send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const finalizeAdminRefundOperation = async () => {
    try{
        const contract = await tezos.wallet.at(contract_address);
        const op = await contract.methods.finalizeAdminRefund().send();
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};