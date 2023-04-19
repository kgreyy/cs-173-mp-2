# Escrow - Example for illustrative purposes only.

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret, admin):
        self.init(fromOwner           = fromOwner,
                  fromCounterparty    = fromCounterparty,
                  balanceOwner        = sp.tez(0),
                  balanceCounterparty = sp.tez(0),
                  hashedSecret        = hashedSecret,
                  epoch               = epoch,
                  owner               = owner,
                  counterparty        = counterparty,
                  admin               = admin,
                  adminInit           = sp.bool(False),
                  ownerInit           = sp.bool(False),
                  counterInit           = sp.bool(False))

    @sp.entry_point
    def addBalanceOwner(self):
        sp.verify(self.data.balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.fromOwner)
        self.data.balanceOwner = self.data.fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        sp.verify(self.data.balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.fromCounterparty)
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        sp.if self.data.admin == identity:
            sp.verify(sp.sender == self.data.admin)
            sp.send(self.data.owner, self.data.balanceOwner)
            self.data.balanceOwner = sp.tez(0)
            sp.send(self.data.counterparty, self.data.balanceCounterparty)
            self.data.balanceCounterparty = sp.tez(0)
        sp.else:
            sp.verify(sp.sender == identity)
            sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
            self.data.balanceOwner = sp.tez(0)
            self.data.balanceCounterparty = sp.tez(0)
        

    @sp.entry_point
    def claimCounterparty(self, params):
        sp.verify(sp.now < self.data.epoch)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        sp.verify(self.data.epoch < sp.now)
        self.claim(self.data.owner)
    
    @sp.entry_point
    def initiateOwnerWithdraw(self):
        sp.verify(self.data.adminInit)
        sp.verify(sp.sender == self.data.owner)
        self.data.ownerInit = sp.bool(True)
    
    @sp.entry_point
    def initiateCounterpartyWithdraw(self):
        sp.verify(self.data.adminInit)
        sp.verify(sp.sender == self.data.counterparty)
        self.data.counterInit = sp.bool(True)
    
    @sp.entry_point
    def initiateAdminRefund(self):
        sp.verify(sp.sender == self.data.admin)
        self.data.adminInit = sp.bool(True)
    
    @sp.entry_point
    def finalizeAdminRefund(self):
        sp.verify(sp.sender == self.data.admin)
        sp.verify(self.data.counterInit)
        sp.verify(self.data.ownerInit)
        self.claim(self.data.admin)
        self.data.adminInit = sp.bool(False)
        self.data.ownerInit = sp.bool(False)
        self.data.counterInit = sp.bool(False)

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    alice = sp.address("tz1SHC1xaNZsZ19K4nJYoLutQYt5J3qJhUBc")
    bob = sp.address("tz1UyzaiJhQyNNTDfBBz8mUXkBMvatBqmKgn")
    admin = sp.address("tz1PnJgp9381soVcfRKnpL5tgNh8NEsxym61")
    c1 = Escrow(alice, sp.tez(50), bob, sp.tez(4), sp.timestamp(1577836800), hashSecret, sp.address("tz1PnJgp9381soVcfRKnpL5tgNh8NEsxym61"))
    scenario += c1
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    scenario.h3("Erronous secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223343")).run(sender = bob, valid = False)
    scenario.h3("Correct secret")
    c1.initiateAdminRefund().run(sender = admin)
    c1.initiateOwnerWithdraw().run(sender = alice)
    c1.initiateCounterpartyWithdraw().run(sender = bob)
    c1.finalizeAdminRefund().run(sender = admin)
    # c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob)

sp.add_compilation_target("escrow", Escrow(sp.address("tz1SHC1xaNZsZ19K4nJYoLutQYt5J3qJhUBc"), sp.tez(50), sp.address("tz1UyzaiJhQyNNTDfBBz8mUXkBMvatBqmKgn"), sp.tez(4), sp.timestamp(1577836800), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e"), sp.address("tz1PnJgp9381soVcfRKnpL5tgNh8NEsxym61")))
