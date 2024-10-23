"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MongoModel_1 = __importDefault(require("../../core/model/MongoModel"));
var mongodb_1 = require("mongodb");
var MongoException_1 = __importDefault(require("../../core/exception/types/MongoException"));
module.exports = /** @class */ (function (_super) {
    __extends(TestModel, _super);
    function TestModel() {
        var _this = _super.call(this) || this;
        _this.canCreate = true;
        _this.canUpdate = true;
        _this.canDelete = true;
        _this.collection = "test_collection";
        _this.primaryKey = {
            _id: "AUTO_INCREMENT"
        };
        _this.modelColumns = {
            title: String,
            number: mongodb_1.Int32,
            double: mongodb_1.Double,
            bool: Boolean,
            null: null,
            array: (Array),
            object: Object,
            undefined: undefined,
            date: Date,
            binaryDate: mongodb_1.Binary,
            objectId: mongodb_1.ObjectId,
            minKey: mongodb_1.MinKey,
            symbol: mongodb_1.BSONSymbol,
            regEx: mongodb_1.BSONRegExp,
            js: mongodb_1.Code,
            timestamp: mongodb_1.Timestamp,
            decimal128: mongodb_1.Decimal128,
            uuid: mongodb_1.UUID
        };
        _this.initializeModel();
        return _this;
    }
    TestModel.prototype.columns = function () {
        return this.modelColumns;
    };
    //************************************************************\\
    //********************Usage In Controller*********************\\
    TestModel.prototype.exampleUsageOfMongoModelFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testModel, getUsers, localRoles1, localRoles2, dropRoleResult2, dropRoleResult, createViewPipeline, createViewResult, siblingDb, collections, currentOperations, operationIdToKill, killResult, repairResult, client, session, document_1, error_1, pipeline, query, document, documents, result, changeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testModel = new TestModel();
                        return [4 /*yield*/, testModel.getUsers()];
                    case 1:
                        getUsers = _a.sent();
                        console.log(getUsers);
                        return [4 /*yield*/, testModel.getRoles({}, undefined, "myDatabase", {}, "dbAdminUser")];
                    case 2:
                        localRoles1 = _a.sent();
                        console.log("Database-Specific Roles:", localRoles1);
                        return [4 /*yield*/, testModel.getRoles({}, undefined, "myDatabase", {}, "dbAdminUser")];
                    case 3:
                        localRoles2 = _a.sent();
                        console.log("Database-Specific Roles:", localRoles2);
                        return [4 /*yield*/, testModel.dropRole("readWriteAnyDatabase", // The role to drop
                            {}, // Optional command options
                            undefined, // Client session (use default)
                            "admin", // Use the 'admin' database
                            {}, // Optional database options
                            "userAdminAnyDatabaseUser" // User role with the right permissions
                            )];
                    case 4:
                        dropRoleResult2 = _a.sent();
                        console.log("Role dropped:", dropRoleResult2);
                        return [4 /*yield*/, testModel.dropRole("customRole", // The role to drop
                            {}, // Optional command options
                            undefined, // Client session (use default)
                            "myDatabase", // Target a specific database
                            {}, // Optional database options
                            "dbAdminUser" // User role with permissions in the database
                            )];
                    case 5:
                        dropRoleResult = _a.sent();
                        console.log("Database-specific role dropped:", dropRoleResult);
                        createViewPipeline = [
                            { $match: { status: "active" } },
                            { $project: { _id: 0, name: 1, total: { $sum: "$amount" } } } // Project selected fields
                        ];
                        return [4 /*yield*/, testModel.createView("activeUsersView", // Name of the view
                            "users", // The source collection
                            createViewPipeline, // Aggregation pipeline for the view
                            {}, // Optional command options
                            undefined, // Client session (use default)
                            "myDatabase", // Database name
                            {}, // Optional database options
                            "dbAdminUser" // Role with necessary privileges
                            )];
                    case 6:
                        createViewResult = _a.sent();
                        console.log("View created:", createViewResult);
                        return [4 /*yield*/, testModel.getSiblingDB("otherDatabase", // The name of the sibling database
                            {}, // Optional database options
                            undefined, // Client session (use default)
                            "myCurrentDatabase", // The current database
                            "dbAdminUser" // The role with necessary permissions
                            )];
                    case 7:
                        siblingDb = _a.sent();
                        console.log("Connected to sibling database:", siblingDb.databaseName);
                        return [4 /*yield*/, siblingDb.listCollections().toArray()];
                    case 8:
                        collections = _a.sent();
                        console.log("Collections in sibling database:", collections);
                        return [4 /*yield*/, testModel.currentOp({}, // Command options (e.g., filtering on specific operations)
                            {}, // Additional command options
                            undefined, // Use default client/session
                            "admin", // Run this on the admin database
                            {}, // Default dbOptions
                            "clusterMonitorUser" // A role suitable for monitoring cluster operations
                            )];
                    case 9:
                        currentOperations = _a.sent();
                        operationIdToKill = 12345;
                        return [4 /*yield*/, testModel.killOp(operationIdToKill, // ID of the operation to kill
                            {}, // Additional command options
                            undefined, // Use default client/session
                            "admin", // Run this on the admin database
                            {}, // Default dbOptions
                            "clusterManagerUser" // Role suitable for managing cluster operations
                            )];
                    case 10:
                        killResult = _a.sent();
                        return [4 /*yield*/, testModel.repairDatabase({}, // Optional additional command options
                            undefined, // Use default client/session
                            "yourDatabaseName", // The database to repair, defaults to 'admin'
                            {}, // Default dbOptions
                            "dbAdminUser" // Role suitable for managing the database
                            )];
                    case 11:
                        repairResult = _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.createUser({
                                user: "johnDoe",
                                pwd: "securePassword",
                                roles: [{ role: "read" }, { role: "userAdmin" }]
                            })];
                    case 12:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.runCommand({ ping: 1 })];
                    case 13:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.dropCollection("collection_to_drop")];
                    case 14:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        //? dropTarget: By default, if a collection with the new name already exists, the operation will throw an error. If you set { dropTarget: true }, MongoDB will drop the existing collection before renaming.
                        return [4 /*yield*/, testModel.renameCollection("old_collection_name", "new_collection_name", { dropTarget: true })];
                    case 15:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        //? dropTarget: By default, if a collection with the new name already exists, the operation will throw an error. If you set { dropTarget: true }, MongoDB will drop the existing collection before renaming.
                        _a.sent();
                        return [4 /*yield*/, testModel.renameCollection("old_collection_name", "new_collection_name")];
                    case 16:
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.getCollectionNames()];
                    case 17:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.stats()];
                    case 18:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        return [4 /*yield*/, testModel.getConnection("readWriteUser")];
                    case 19:
                        client = (_a.sent()).client;
                        session = client.startSession();
                        _a.label = 20;
                    case 20:
                        _a.trys.push([20, 23, 25, 27]);
                        session.startTransaction();
                        document_1 = {
                            title: "test",
                            number: new mongodb_1.Int32(123),
                            double: new mongodb_1.Double(123.45),
                            bool: true,
                            null: null,
                            array: [1, 2, 3],
                            object: { key: "value" },
                            undefined: undefined,
                            date: new Date("2024-09-28T16:12:14.510Z"),
                            binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                            objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                            minKey: new mongodb_1.MinKey(),
                            symbol: new mongodb_1.BSONSymbol("symbol"),
                            regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                            js: new mongodb_1.Code("function() { return true; }"),
                            timestamp: new mongodb_1.Timestamp(BigInt(0)),
                            decimal128: mongodb_1.Decimal128.fromString("123.456"),
                            uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                        };
                        // Pass session to insertOne operation
                        return [4 /*yield*/, testModel.insertOne(document_1, {}, { clientFromSession: client, session: session })];
                    case 21:
                        // Pass session to insertOne operation
                        _a.sent();
                        return [4 /*yield*/, session.commitTransaction()];
                    case 22:
                        _a.sent();
                        return [3 /*break*/, 27];
                    case 23:
                        error_1 = _a.sent();
                        return [4 /*yield*/, session.abortTransaction()];
                    case 24:
                        _a.sent();
                        throw new MongoException_1.default("An error occurred during the transaction! \n Error: ".concat(error_1));
                    case 25: return [4 /*yield*/, session.endSession()];
                    case 26:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 27: 
                    //******************************************************************************\\
                    //******************************************************************************\\
                    //? findAndModify to add
                    return [4 /*yield*/, testModel.findAndModify({ title: "Non-Existent Title" }, { $set: { title: new String("Upserted Title"), number: new mongodb_1.Int32(123) } }, { returnDocument: "after", upsert: true })];
                    case 28:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        //? findAndModify to add
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        //? findAndModify to edit
                        return [4 /*yield*/, testModel.findAndModify({
                                title: "Old Title" // Find the document with this title
                            }, {
                                title: "New Title" // Update the title to this new value
                            }, {
                                returnDocument: "after",
                                upsert: false // Don't insert if no document matches the filter
                            })];
                    case 29:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        //? findAndModify to edit
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.findOneAndDelete({ title: "To Be Deleted" }, // Filter to match the document
                            {} // No additional options in this case
                            )];
                    case 30:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.findOneAndReplace({ title: "Old Title" }, // Filter to match the document
                            { title: "Replaced Title", number: new mongodb_1.Int32(123) }, // The replacement document
                            { returnDocument: "after", upsert: true } // Options to return the new document after replacement
                            )];
                    case 31:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.findOneAndUpdate({ title: "Old Title" }, // Filter to match the document
                            { uuid: new mongodb_1.UUID().toBinary() }, // The update to apply
                            { returnDocument: "after", upsert: true } // Options to return the new document after the update
                            )];
                    case 32:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.countDocuments({
                                title: "Document Title",
                                bool: true // Count documents where 'bool' is true
                            })];
                    case 33:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.listCollections()];
                    case 34:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.listIndexes()];
                    case 35:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.listSearchIndexes()];
                    case 36:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.dbAggregate([
                                { $match: { bool: true } },
                                { $group: { _id: "$title", count: { $sum: 1 } } },
                                { $sort: { count: -1 } } // Sort by count in descending order
                            ])];
                    case 37:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        pipeline = [
                            { $match: { bool: true } },
                            { $group: { _id: "$title", count: { $sum: 1 } } },
                            { $sort: { count: -1 } } // Sort by count in descending order
                        ];
                        return [4 /*yield*/, testModel.aggregate(pipeline)];
                    case 38:
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.findOne({
                                title: "Document Title",
                                number: new mongodb_1.Int32(1) // Filter where number equals 1
                            })];
                    case 39:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        query = {
                            title: "Document Title",
                            number: new mongodb_1.Int32(1) // Find documents where number equals 1
                        };
                        return [4 /*yield*/, testModel.find(query)];
                    case 40:
                        _a.sent();
                        document = {
                            title: "test",
                            number: new mongodb_1.Int32(123),
                            double: new mongodb_1.Double(123.45),
                            bool: true,
                            null: null,
                            array: [1, 2, 3],
                            object: { key: "value" },
                            undefined: undefined,
                            date: new Date("2024-09-28T16:12:14.510Z"),
                            binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                            objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                            minKey: new mongodb_1.MinKey(),
                            symbol: new mongodb_1.BSONSymbol("symbol"),
                            regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                            js: new mongodb_1.Code("function() { return true; }"),
                            timestamp: new mongodb_1.Timestamp(BigInt(0)),
                            decimal128: mongodb_1.Decimal128.fromString("123.456"),
                            uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                        };
                        return [4 /*yield*/, testModel.insertOne(document)];
                    case 41:
                        _a.sent();
                        documents = [
                            {
                                title: "test",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            },
                            {
                                title: "test",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            }
                        ];
                        return [4 /*yield*/, testModel.insertMany(documents)];
                    case 42:
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.bulkWrite([
                                // Insert operation
                                {
                                    insertOne: {
                                        document: {
                                            title: "New Title",
                                            number: new mongodb_1.Int32(123)
                                        }
                                    }
                                },
                                // Update operation
                                {
                                    updateOne: {
                                        filter: { title: new String("Old Title"), ss: "" },
                                        update: { $set: { title: "Updated Title", bool: false } }
                                    }
                                },
                                // Delete operation
                                { deleteOne: { filter: { title: "To Be Deleted" } } }
                            ], {})];
                    case 43:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        return [4 /*yield*/, testModel.bulkWrite([
                                {
                                    updateMany: {
                                        filter: { title: { $in: ["Title1", "Title2"] } },
                                        update: { $set: { number: new mongodb_1.Int32(456) } }
                                    }
                                }
                            ], {})];
                    case 44:
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.deleteOne({ title: { $in: ["Title1", "Title2"] }, bool: { $in: [false, false] } }, // Using MongoDB operator `$in` to match multiple titles
                            {})];
                    case 45:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.deleteMany({ title: { $in: ["Title1", "Title2"] }, js: new mongodb_1.Code("() => {}") }, // Using MongoDB operator `$in`
                            {})];
                    case 46:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.updateOne({ title: "Old Title", bool: false }, { timestamp: new mongodb_1.Timestamp(BigInt(0)) }, {})];
                    case 47:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.updateMany({ title: "test", bool: true, number: new mongodb_1.Int32(22) }, { title: "Adventure", null: null })];
                    case 48:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        return [4 /*yield*/, testModel.replaceOne({
                                title: "test",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            }, {
                                title: "test",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            })];
                    case 49:
                        result = _a.sent();
                        if (result.modifiedCount > 0) {
                            console.log("Document replaced successfully.");
                        }
                        else {
                            console.log("No document matched the filter.");
                        }
                        return [4 /*yield*/, testModel.watch([], { fullDocument: "updateLookup" })];
                    case 50:
                        changeStream = _a.sent();
                        // Handle each change in the collection
                        changeStream.on("change", function (change) {
                            console.log("Change detected:", change);
                            // Process the change (e.g., log insert, update, delete events)
                            switch (change.operationType) {
                                case "insert":
                                    console.log("Document inserted:", change.fullDocument);
                                    break;
                                case "update":
                                    console.log("Document updated:", change.updateDescription);
                                    break;
                                case "delete":
                                    console.log("Document deleted, _id:", change.documentKey._id);
                                    break;
                                default:
                                    console.log("Other change detected:", change);
                            }
                        });
                        // Optional: Close the stream after some time (or based on conditions)
                        setTimeout(function () {
                            changeStream.close();
                            console.log("Change stream closed");
                        }, 60000); // Close after 1 minute
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.distinct("title", { title: "test" })];
                    case 51:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        //******************************************************************************\\
                        //******************************************************************************\\
                        return [4 /*yield*/, testModel.updateOne({
                                title: "",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            }, {
                                title: "test",
                                number: new mongodb_1.Int32(123),
                                double: new mongodb_1.Double(123.45),
                                bool: true,
                                null: null,
                                array: [1, 2, 3],
                                object: { key: "value" },
                                undefined: undefined,
                                date: new Date("2024-09-28T16:12:14.510Z"),
                                binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
                                objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
                                minKey: new mongodb_1.MinKey(),
                                symbol: new mongodb_1.BSONSymbol("symbol"),
                                regEx: new mongodb_1.BSONRegExp("pattern", "i"),
                                js: new mongodb_1.Code("function() { return true; }"),
                                timestamp: new mongodb_1.Timestamp(BigInt(0)),
                                decimal128: mongodb_1.Decimal128.fromString("123.456"),
                                uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
                            })];
                    case 52:
                        //******************************************************************************\\
                        //******************************************************************************\\
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TestModel.prototype.allMongoDbDataTypes = function () {
        return {
            title: "string",
            number: new mongodb_1.Int32(123),
            double: new mongodb_1.Double(123.45),
            bool: true,
            null: null,
            array: [1, 2, 3],
            object: { key: "value" },
            undefined: undefined,
            date: new Date("2024-09-28T16:12:14.510Z"),
            binaryDate: new mongodb_1.Binary(Buffer.from("binary")),
            objectId: new mongodb_1.ObjectId("66f82adea393a4c09db65217"),
            minKey: new mongodb_1.MinKey(),
            symbol: new mongodb_1.BSONSymbol("symbol"),
            regEx: new mongodb_1.BSONRegExp("pattern", "i"),
            js: new mongodb_1.Code("function() { return true; }"),
            timestamp: new mongodb_1.Timestamp(BigInt(0)),
            decimal128: mongodb_1.Decimal128.fromString("123.456"),
            uuid: new mongodb_1.UUID("4ec7fc46-0735-41a1-9665-882140180a54")
        };
    };
    return TestModel;
}(MongoModel_1.default));
