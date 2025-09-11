/**
 * Proto Loader for V2 API (JSON-only implementation)
 *
 * This is a simplified version that works with JSON payloads only.
 * Protobuf support has been removed.
 */
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
/**
 * ProtoLoader handles loading and validation of message definitions.
 * This implementation uses JSON exclusively instead of protobuf.
 */
var ProtoLoader = /** @class */ (function () {
    function ProtoLoader() {
    }
    /**
     * Get singleton instance of ProtoLoader
     */
    ProtoLoader.getInstance = function () {
        if (!ProtoLoader.instance) {
            ProtoLoader.instance = new ProtoLoader();
        }
        return ProtoLoader.instance;
    };
    /**
     * Mock load protos - returns immediately since we're using JSON
     */
    ProtoLoader.prototype.loadProtos = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // No-op for JSON implementation
                return [2 /*return*/, {}];
            });
        });
    };
    /**
     * Mock get message type - not needed for JSON
     */
    ProtoLoader.prototype.getMessageType = function (_packageName, _messageName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Return a mock type object that satisfies the interface
                return [2 /*return*/, {
                        create: function (data) { return data; },
                        verify: function (_data) { return null; }, // No errors in JSON mode
                        encode: function (_message) { return ({
                            finish: function () { return new Uint8Array(0); },
                        }); },
                        decode: function (_buffer) { return ({}); },
                        toObject: function (message, _options) { return message; },
                    }];
            });
        });
    };
    /**
     * Create and validate a message - just returns the data for JSON
     */
    ProtoLoader.prototype.createMessage = function (packageName, messageName, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // In JSON mode, just return the data as-is
                return [2 /*return*/, data];
            });
        });
    };
    /**
     * Encode a message - converts to JSON string then to Uint8Array
     */
    ProtoLoader.prototype.encodeMessage = function (_packageName, _messageName, data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonString, encoder;
            return __generator(this, function (_a) {
                jsonString = JSON.stringify(data);
                encoder = new TextEncoder();
                return [2 /*return*/, encoder.encode(jsonString)];
            });
        });
    };
    /**
     * Decode a message - converts from Uint8Array to JSON
     */
    ProtoLoader.prototype.decodeMessage = function (_packageName, _messageName, buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var decoder, jsonString;
            return __generator(this, function (_a) {
                decoder = new TextDecoder();
                jsonString = decoder.decode(buffer);
                return [2 /*return*/, JSON.parse(jsonString)];
            });
        });
    };
    /**
     * Convert a message to JSON
     */
    ProtoLoader.prototype.messageToJson = function (_packageName, _messageName, _data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, JSON.stringify(_data)];
            });
        });
    };
    /**
     * Parse JSON to a message
     */
    ProtoLoader.prototype.jsonToMessage = function (_packageName, _messageName, json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, JSON.parse(json)];
            });
        });
    };
    /**
     * Clear the cached proto definitions
     * No-op for JSON implementation
     */
    ProtoLoader.prototype.clearCache = function () {
        // No cache to clear in JSON mode
    };
    return ProtoLoader;
}());
export { ProtoLoader };
// Export singleton instance
export var protoLoader = ProtoLoader.getInstance();
//# sourceMappingURL=proto-loader.js.map