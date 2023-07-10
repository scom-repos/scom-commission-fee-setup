import { Module, customModule, Container, VStack } from '@ijstech/components';
import ScomCommissionFeeSetup from '@scom/scom-commission-fee-setup';
@customModule
export default class Module1 extends Module {
    private commissionEl: ScomCommissionFeeSetup;
    private mainStack: VStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.commissionEl = await ScomCommissionFeeSetup.create({
          commissions: []
        });
        this.mainStack.appendChild(this.commissionEl);
    }

    render() {
        return (
          <i-panel>
            <i-vstack
              id='mainStack'
              margin={{ top: '1rem', left: '1rem' }}
              gap='2rem'
            >
              <i-scom-commission-fee-setup
                commissions={[
                  {
                    chainId: 97,
                    walletAddress: '0xaA530FC26ee1Be26a27ca2CC001e74b972563a22',
                    share: '1'
                  }
                ]}
                fee="0.01"
              ></i-scom-commission-fee-setup>
            </i-vstack>
          </i-panel>
        )
    }
}