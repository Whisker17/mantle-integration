"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var account_1 = require("@biconomy/account");
var core_types_1 = require("@biconomy/core-types");
var bundler_1 = require("@biconomy/bundler");
var paymaster_1 = require("@biconomy/paymaster");
var dotenv_1 = require("dotenv");
var modules_1 = require("@biconomy/modules");
(0, dotenv_1.config)();
var rpcUrl = "https://rpc.testnet.mantle.xyz/";
var biconomyPaymasterApiKey = "https://paymaster.biconomy.io/api/v1/5001/yfbLWhoN8.375a1da0-6b1b-4b1f-bebc-63c278e08a67";
var bundlerUrl = "https://bundler.biconomy.io/api/v2/5001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
var provider = new ethers_1.ethers.providers.JsonRpcProvider(rpcUrl);
var signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
// Configure the Biconomy Bundler
var bundler = new bundler_1.Bundler({
    bundlerUrl: bundlerUrl, // URL to the Biconomy bundler service
    chainId: core_types_1.ChainId.MANTLE_TESTNET, // Chain ID for Polygon Mumbai test network
    entryPointAddress: account_1.DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address for the bundler
});
// Configure the Biconomy Paymaster
var paymaster = new paymaster_1.BiconomyPaymaster({
    paymasterUrl: biconomyPaymasterApiKey, // URL to the Biconomy paymaster service
});
function createModule() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, modules_1.ECDSAOwnershipValidationModule.create({
                        signer: signer, // The wallet acting as the signer
                        moduleAddress: modules_1.DEFAULT_ECDSA_OWNERSHIP_MODULE, // Address of the default ECDSA ownership validation module
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function createSmartAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var module, smartAccount, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createModule()];
                case 1:
                    module = _d.sent();
                    return [4 /*yield*/, account_1.BiconomySmartAccountV2.create({
                            chainId: core_types_1.ChainId.MANTLE_TESTNET, // Chain ID for the Mantle Testnet
                            bundler: bundler, // The configured bundler instance
                            paymaster: paymaster, // The configured paymaster instance
                            entryPointAddress: account_1.DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address
                            defaultValidationModule: module, // The default validation module
                            activeValidationModule: module, // The active validation module
                        })];
                case 2:
                    smartAccount = _d.sent();
                    _b = (_a = console).log;
                    _c = ["Smart Account Address: "];
                    return [4 /*yield*/, smartAccount.getAccountAddress()]; // Logging the address of the created smart account
                case 3:
                    _b.apply(_a, _c.concat([_d.sent() // Logging the address of the created smart account
                    ]));
                    return [2 /*return*/, smartAccount];
            }
        });
    });
}
createSmartAccount();
