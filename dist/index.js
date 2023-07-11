var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-commission-fee-setup/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-commission-fee-setup/utils.ts", ["require", "exports", "@ijstech/eth-wallet"], function (require, exports, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SupportedNetworks = exports.isWalletAddress = exports.formatNumberWithSeparators = exports.formatNumber = void 0;
    const formatNumber = (value, decimals) => {
        let val = value;
        const minValue = '0.0000001';
        if (typeof value === 'string') {
            val = new eth_wallet_1.BigNumber(value).toNumber();
        }
        else if (typeof value === 'object') {
            val = value.toNumber();
        }
        if (val != 0 && new eth_wallet_1.BigNumber(val).lt(minValue)) {
            return `<${minValue}`;
        }
        return (0, exports.formatNumberWithSeparators)(val, decimals || 4);
    };
    exports.formatNumber = formatNumber;
    const formatNumberWithSeparators = (value, precision) => {
        if (!value)
            value = 0;
        if (precision) {
            let outputStr = '';
            if (value >= 1) {
                outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
            }
            else {
                outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
            }
            if (outputStr.length > 18) {
                outputStr = outputStr.substr(0, 18) + '...';
            }
            return outputStr;
        }
        else {
            return value.toLocaleString('en-US');
        }
    };
    exports.formatNumberWithSeparators = formatNumberWithSeparators;
    function isWalletAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    exports.isWalletAddress = isWalletAddress;
    exports.SupportedNetworks = [
        {
            chainName: "BSC Testnet",
            chainId: 97
        },
        {
            chainName: "Avalanche FUJI C-Chain",
            chainId: 43113
        }
    ];
});
define("@scom/scom-commission-fee-setup/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableStyle = exports.customStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.customStyle = components_1.Styles.style({
        $nest: {
            'input': {
                paddingLeft: '10px'
            },
            '.nft-network-select': {
                $nest: {
                    '.os-modal .modal': {
                        background: Theme.combobox.background
                    },
                    '.modal > i-panel': {
                        borderRadius: 8
                    },
                    'i-label': {
                        fontSize: '1rem !important'
                    },
                    '.list-item': {
                        padding: '0.5rem 1rem !important'
                    }
                }
            }
        }
    });
    exports.tableStyle = components_1.Styles.style({
        $nest: {
            '.i-table-header>tr>th': {
                fontSize: '0.875rem !important',
                opacity: 0.6
            }
        }
    });
});
define("@scom/scom-commission-fee-setup", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-commission-fee-setup/utils.ts", "@scom/scom-commission-fee-setup/index.css.ts"], function (require, exports, components_2, eth_wallet_2, utils_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    const CommissionFeeTooltipText = "For each transaction, you'll receive a 1% commission fee based on the total amount. This fee will be transferred to a designated commission contract within the corresponding blockchain network.";
    let ScomCommissionFeeSetup = class ScomCommissionFeeSetup extends components_2.Module {
        async init() {
            this.isReadyCallbackQueued = true;
            super.init();
            if (!this.lbCommissionShare.isConnected)
                await this.lbCommissionShare.ready();
            if (!this.tableCommissions.isConnected)
                await this.tableCommissions.ready();
            const fee = this.getAttribute('fee', true);
            const commissions = this.getAttribute('commissions', true);
            const networks = this.getAttribute('networks', true);
            if (fee)
                this.fee = fee;
            if (commissions)
                this.commissions = commissions;
            if (networks)
                this.networks = networks;
            this.setTableColumns();
            this.toggleVisible();
            this.isReadyCallbackQueued = false;
            this.executeReadyCallback();
        }
        setTableColumns() {
            console.log(this.networks);
            if (!this.tableCommissions)
                return;
            this.tableCommissions.columns = [
                {
                    title: 'Network',
                    fieldName: 'chainId',
                    key: 'chainId',
                    textAlign: 'left',
                    onRenderCell: (source, columnData, rowData) => {
                        var _a;
                        const network = this.networks.find(net => net.chainId === columnData);
                        if (!network)
                            return this.$render("i-panel", null);
                        const imgUrl = ((_a = eth_wallet_2.Wallet.getClientInstance().getNetworkInfo(columnData)) === null || _a === void 0 ? void 0 : _a.image) || '';
                        const hstack = new components_2.HStack(undefined, {
                            verticalAlignment: 'center',
                            gap: 5
                        });
                        const imgEl = new components_2.Icon(hstack, {
                            image: { url: imgUrl, width: 16, height: 16 }
                        });
                        const lbName = new components_2.Label(hstack, {
                            caption: network.chainName || '',
                            font: { size: '0.875rem' }
                        });
                        hstack.append(imgEl, lbName);
                        return hstack;
                    }
                },
                {
                    title: 'Wallet',
                    fieldName: 'walletAddress',
                    key: 'walletAddress',
                    onRenderCell: function (source, columnData, rowData) {
                        const replaced = columnData.slice(6, columnData.length - 9);
                        const caption = ((columnData === null || columnData === void 0 ? void 0 : columnData.length) < 15) ? columnData : columnData.replace(replaced, '...');
                        return new components_2.Label(undefined, {
                            caption: caption || '',
                            font: { size: '0.875rem' },
                            tooltip: {
                                content: columnData
                            }
                        });
                    }
                },
                {
                    title: '',
                    fieldName: '',
                    key: '',
                    textAlign: 'center',
                    onRenderCell: async (source, data, rowData) => {
                        const icon = new components_2.Icon(undefined, {
                            name: "edit",
                            fill: Theme.text.primary,
                            height: 14,
                            width: 14
                        });
                        icon.onClick = async (source) => {
                            this.currentCommission = {
                                walletAddress: rowData.walletAddress,
                                chainId: rowData.chainId,
                                share: ''
                            };
                            this.networkPicker.setNetworkByChainId(rowData.chainId);
                            this.inputWalletAddress.value = rowData.walletAddress;
                            this.modalAddCommission.visible = true;
                        };
                        icon.classList.add('pointer');
                        return icon;
                    }
                },
                {
                    title: '',
                    fieldName: '',
                    key: '',
                    textAlign: 'center',
                    onRenderCell: async (source, data, rowData) => {
                        const icon = new components_2.Icon(undefined, {
                            name: "times",
                            fill: Theme.colors.primary.main,
                            height: 14,
                            width: 14
                        });
                        icon.onClick = async (source) => {
                            const index = this.commissions.findIndex(v => v.walletAddress == rowData.walletAddress && v.chainId == rowData.chainId);
                            if (index >= 0) {
                                this.commissions.splice(index, 1);
                                if (this.tableCommissions)
                                    this.tableCommissions.data = this.commissions;
                                this.toggleVisible();
                                if (this.onChanged)
                                    await this.onChanged({ commissions: this.commissions });
                            }
                        };
                        icon.classList.add('pointer');
                        return icon;
                    }
                }
            ];
        }
        constructor(parent, options) {
            super(parent, options);
            this._commissions = [];
            this._fee = '0';
            this._networks = [];
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get commissions() {
            var _a;
            return ((_a = this.tableCommissions) === null || _a === void 0 ? void 0 : _a.data) || this._commissions || [];
        }
        set commissions(value) {
            this._commissions = value || [];
            if (this.tableCommissions)
                this.tableCommissions.data = this.commissions;
            this.toggleVisible();
        }
        get fee() {
            var _a;
            return (_a = this._fee) !== null && _a !== void 0 ? _a : '0';
        }
        set fee(value) {
            this._fee = value !== null && value !== void 0 ? value : '0';
            if (this.lbCommissionShare)
                this.lbCommissionShare.caption = `${(0, utils_1.formatNumber)(new eth_wallet_2.BigNumber(this._fee).times(100).toFixed(), 4)} %`;
        }
        get networks() {
            var _a;
            return (_a = this._networks) !== null && _a !== void 0 ? _a : [];
        }
        set networks(value) {
            this._networks = value !== null && value !== void 0 ? value : [];
            if (this.networkPicker)
                this.networkPicker.networks = [...this.networks];
        }
        onModalAddCommissionClosed() {
            this.networkPicker.clearNetwork();
            this.inputWalletAddress.value = '';
            this.lbErrMsg.caption = '';
        }
        onAddCommissionClicked() {
            this.modalAddCommission.visible = true;
        }
        async onConfirmCommissionClicked() {
            var _a, _b;
            const currentChainId = (_a = this.networkPicker.selectedNetwork) === null || _a === void 0 ? void 0 : _a.chainId;
            const currentWalletAddress = this.inputWalletAddress.value;
            if (this.currentCommission) {
                const { chainId, walletAddress } = this.currentCommission;
                const commission = this.commissions.find(com => com.chainId === chainId && com.walletAddress === walletAddress);
                commission.chainId = currentChainId;
                commission.walletAddress = currentWalletAddress;
                this.currentCommission = null;
            }
            else {
                const hasCommission = this.commissions.find(com => com.chainId === currentChainId && com.walletAddress === currentWalletAddress);
                if (!hasCommission) {
                    this.commissions.push({
                        chainId: (_b = this.networkPicker.selectedNetwork) === null || _b === void 0 ? void 0 : _b.chainId,
                        walletAddress: this.inputWalletAddress.value,
                        share: this.fee
                    });
                }
            }
            this.tableCommissions.data = this.commissions;
            this.toggleVisible();
            this.modalAddCommission.visible = false;
            if (this.onChanged)
                await this.onChanged({ commissions: this.commissions });
        }
        validateModalFields() {
            if (!this.networkPicker.selectedNetwork) {
                this.lbErrMsg.caption = 'Please select network';
            }
            else if (this.commissions.find(v => v.chainId == this.networkPicker.selectedNetwork.chainId)) {
                this.lbErrMsg.caption = 'This network already exists';
            }
            else if (!this.inputWalletAddress.value) {
                this.lbErrMsg.caption = 'Please enter wallet address';
            }
            else if (!(0, utils_1.isWalletAddress)(this.inputWalletAddress.value)) {
                this.lbErrMsg.caption = 'Please enter valid wallet address';
            }
            else {
                this.lbErrMsg.caption = '';
            }
            if (this.lbErrMsg.caption) {
                this.btnConfirm.enabled = false;
                return false;
            }
            else {
                this.btnConfirm.enabled = true;
                return true;
            }
        }
        onNetworkSelected() {
            this.validateModalFields();
        }
        onInputWalletAddressChanged() {
            this.validateModalFields();
        }
        async toggleVisible() {
            var _a, _b;
            if (!this.pnlEmptyWallet.isConnected)
                await this.pnlEmptyWallet.ready();
            if (!this.btnAddWallet.isConnected)
                await this.btnAddWallet.ready();
            const hasData = !!((_b = (_a = this.tableCommissions) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.length);
            this.tableCommissions.visible = hasData;
            this.pnlEmptyWallet.visible = !hasData;
            this.btnAddWallet.visible = hasData;
        }
        render() {
            return (this.$render("i-vstack", { gap: '0.5rem', padding: { top: '1rem', bottom: '1rem' }, class: index_css_1.customStyle },
                this.$render("i-vstack", { gap: "5px" },
                    this.$render("i-hstack", { horizontalAlignment: "space-between", verticalAlignment: "center", gap: "4px" },
                        this.$render("i-hstack", { gap: "4px" },
                            this.$render("i-label", { caption: "Commission Fee: ", opacity: 0.6, font: { size: '1rem' } }),
                            this.$render("i-label", { id: "lbCommissionShare", font: { size: '1rem' }, caption: '0%' }),
                            this.$render("i-icon", { name: "question-circle", fill: Theme.background.modal, width: 20, height: 20, tooltip: { content: CommissionFeeTooltipText } })),
                        this.$render("i-button", { id: "btnAddWallet", caption: "Add Wallet", border: { radius: '58px' }, padding: { top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, size: '0.75rem', weight: 400 }, visible: false, onClick: this.onAddCommissionClicked.bind(this) })),
                    this.$render("i-vstack", { id: "pnlEmptyWallet", border: { radius: '8px' }, background: { color: Theme.background.modal }, padding: { top: '1.875rem', bottom: '1.875rem', left: '1.563rem', right: '1.563rem' }, gap: "1.25rem", width: "100%", class: "text-center" },
                        this.$render("i-label", { caption: "To receive commission fee please add your wallet address", font: { size: '1rem' } }),
                        this.$render("i-panel", null,
                            this.$render("i-button", { caption: "Add Wallet", border: { radius: '58px' }, padding: { top: '0.75rem', bottom: '0.75rem', left: '2.5rem', right: '2.5rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 400 }, onClick: this.onAddCommissionClicked.bind(this) })))),
                this.$render("i-table", { id: 'tableCommissions', visible: false, class: index_css_1.tableStyle }),
                this.$render("i-modal", { id: 'modalAddCommission', maxWidth: '600px', closeIcon: { name: 'times-circle' }, onClose: this.onModalAddCommissionClosed },
                    this.$render("i-grid-layout", { width: '100%', verticalAlignment: 'center', gap: { row: '1rem' }, padding: { top: '1rem', bottom: '1rem', left: '2rem', right: '2rem' }, templateColumns: ['1fr', '3fr'], templateRows: ['auto', 'auto', 'auto', 'auto'], templateAreas: [
                            ['title', 'title'],
                            ['lbNetwork', 'network'],
                            ["lbWalletAddress", "walletAddress"],
                            ["lbErrMsg", "errMsg"],
                            ['btnConfirm', 'btnConfirm']
                        ] },
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'title' }, margin: { bottom: '1.5rem' } },
                            this.$render("i-label", { caption: "Add Wallet", font: { size: '1.5rem' } })),
                        this.$render("i-label", { caption: "Network", grid: { area: 'lbNetwork' }, font: { size: '1rem' } }),
                        this.$render("i-scom-network-picker", { id: 'networkPicker', grid: { area: 'network' }, display: "block", type: 'combobox', background: { color: Theme.combobox.background }, border: { radius: 8, width: '1px', style: 'solid', color: Theme.input.background }, onCustomNetworkSelected: this.onNetworkSelected, class: "nft-network-select" }),
                        this.$render("i-label", { caption: "Wallet Address", grid: { area: 'lbWalletAddress' }, font: { size: '1rem' } }),
                        this.$render("i-input", { id: 'inputWalletAddress', grid: { area: 'walletAddress' }, width: '100%', height: 45, border: { radius: 8, width: '1px', style: 'solid', color: Theme.divider }, onChanged: this.onInputWalletAddressChanged }),
                        this.$render("i-label", { id: 'lbErrMsg', font: { color: '#ed5748' }, grid: { area: 'errMsg' } }),
                        this.$render("i-hstack", { width: '100%', horizontalAlignment: 'center', grid: { area: 'btnConfirm' }, margin: { top: '1.25rem' } },
                            this.$render("i-button", { id: "btnConfirm", enabled: false, caption: "Add Wallet", border: { radius: '58px' }, padding: { top: '0.75rem', bottom: '0.75rem', left: '2.5rem', right: '2.5rem' }, background: { color: Theme.colors.primary.main }, font: { color: Theme.colors.primary.contrastText, size: '0.875rem', weight: 400 }, onClick: this.onConfirmCommissionClicked.bind(this) }))))));
        }
    };
    ScomCommissionFeeSetup = __decorate([
        components_2.customModule,
        (0, components_2.customElements)("i-scom-commission-fee-setup")
    ], ScomCommissionFeeSetup);
    exports.default = ScomCommissionFeeSetup;
});
