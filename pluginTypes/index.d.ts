/// <amd-module name="@scom/scom-commission-fee-setup/interface.ts" />
declare module "@scom/scom-commission-fee-setup/interface.ts" {
    export interface ICommissionInfo {
        chainId: number;
        walletAddress: string;
        share: string;
    }
}
/// <amd-module name="@scom/scom-commission-fee-setup/utils.ts" />
declare module "@scom/scom-commission-fee-setup/utils.ts" {
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export function isWalletAddress(address: string): boolean;
    export const SupportedNetworks: {
        chainName: string;
        chainId: number;
    }[];
}
/// <amd-module name="@scom/scom-commission-fee-setup/index.css.ts" />
declare module "@scom/scom-commission-fee-setup/index.css.ts" {
    export const customStyle: string;
    export const tableStyle: string;
}
/// <amd-module name="@scom/scom-commission-fee-setup" />
declare module "@scom/scom-commission-fee-setup" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import { ICommissionInfo } from "@scom/scom-commission-fee-setup/interface.ts";
    import { INetworkConfig } from '@scom/scom-network-picker';
    interface ScomCommissionFeeElement extends ControlElement {
        commissions?: ICommissionInfo[];
        fee?: string;
        networks?: INetworkConfig[];
        onChanged?: (data: any) => Promise<void>;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-commission-fee-setup']: ScomCommissionFeeElement;
            }
        }
    }
    export default class ScomCommissionFeeSetup extends Module {
        private tableCommissions;
        private modalAddCommission;
        private networkPicker;
        private inputWalletAddress;
        private lbCommissionShare;
        private btnAddWallet;
        private pnlEmptyWallet;
        private _commissions;
        private _fee;
        private _networks;
        private commissionsTableColumns;
        private btnConfirm;
        private lbErrMsg;
        onChanged: (data: any) => Promise<void>;
        init(): Promise<void>;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomCommissionFeeElement, parent?: Container): Promise<ScomCommissionFeeSetup>;
        get commissions(): ICommissionInfo[];
        set commissions(value: ICommissionInfo[]);
        get fee(): string;
        set fee(value: string);
        get networks(): INetworkConfig[];
        set networks(value: INetworkConfig[]);
        private onModalAddCommissionClosed;
        private onAddCommissionClicked;
        private onConfirmCommissionClicked;
        private validateModalFields;
        private onNetworkSelected;
        private onInputWalletAddressChanged;
        private toggleVisible;
        render(): any;
    }
}
