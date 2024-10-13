"use strict";

import MongoModel from "../../core/model/MongoModel";
import {
	MongoTypeIdAutoIncrement,
	MongoTypeIdBinary,
	MongoTypeIdUUID
} from "../../core/model/interfaces/mongoDb/column_types/MongoTypes";
import {
	Decimal128,
	Binary,
	MinKey,
	Timestamp,
	BSONSymbol,
	Code,
	UUID,
	Double,
	Int32,
	BSONRegExp,
	ObjectId,
	Filter,
	OptionalId,
	ChangeStreamDocument
} from "mongodb";
import MongoException from "../../core/exception/types/MongoException";

/**
 * @class TestModel
 * @constructor
 * @extends MongoModel
 * @description Defining Model TestModel
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class TestModel extends MongoModel {
	constructor() {
		super();
		this.initializeModel();
	}

	protected override canCreate: boolean = true;
	protected override canUpdate: boolean = true;
	protected override canDelete: boolean = true;
	protected override collection: string = "test_collection";
	protected override primaryKey: { _id: MongoTypeIdUUID | MongoTypeIdBinary | MongoTypeIdAutoIncrement } = {
		_id: "AUTO_INCREMENT"
	};

	public override modelColumns = {
		title: String as unknown as string,
		number: Int32 as Filter<{ number: Int32 }>,
		double: Double as Filter<{ double: Double }>,
		bool: Boolean as unknown as boolean,
		null: null,
		array: Array<any> as Filter<{ array: Array<any> }>,
		object: Object as Filter<{ object: Object }>,
		undefined: undefined,
		date: Date as Filter<{ date: Date }>,
		binaryDate: Binary as Filter<{ binaryDate: Binary }>,
		objectId: ObjectId as Filter<{ objectId: ObjectId }>,
		minKey: MinKey as Filter<{ minKey: MinKey }>,
		symbol: BSONSymbol as Filter<{ symbol: BSONSymbol }>,
		regEx: BSONRegExp as Filter<{ regEx: BSONRegExp }>,
		js: Code as Filter<{ js: Code }>,
		timestamp: Timestamp as Filter<{ timestamp: Timestamp }>,
		decimal128: Decimal128 as Filter<{ decimal128: Decimal128 }>,
		uuid: UUID as Filter<{ uuid: UUID }>
	};

	protected override columns(): {
		[key: string]:
			| String
			| Int32
			| Double
			| Boolean
			| null
			| Array<any>
			| Object
			| undefined
			| Date
			| Binary
			| ObjectId
			| MinKey
			| BSONSymbol
			| BSONRegExp
			| Code
			| Timestamp
			| UUID
			| Decimal128;
	} {
		return this.modelColumns;
	}

	//************************************************************\\
	//********************Usage In Controller*********************\\
	async exampleUsageOfMongoModelFunctions() {
		const testModel = new TestModel();
		//******************************************************************************\\
		//******************************************************************************\\
		const getUsers = await testModel.getUsers();
		console.log(getUsers);
		//******************************************************************************\\
		//******************************************************************************\\
		const localRoles1 = await testModel.getRoles({}, undefined, "myDatabase", {}, "dbAdminUser");
		console.log("Database-Specific Roles:", localRoles1);
		const localRoles2 = await testModel.getRoles({}, undefined, "myDatabase", {}, "dbAdminUser");
		console.log("Database-Specific Roles:", localRoles2);
		//******************************************************************************\\
		//******************************************************************************\\
		const dropRoleResult2 = await testModel.dropRole(
			"readWriteAnyDatabase", // The role to drop
			{}, // Optional command options
			undefined, // Client session (use default)
			"admin", // Use the 'admin' database
			{}, // Optional database options
			"userAdminAnyDatabaseUser" // User role with the right permissions
		);

		console.log("Role dropped:", dropRoleResult2);

		const dropRoleResult = await testModel.dropRole(
			"customRole", // The role to drop
			{}, // Optional command options
			undefined, // Client session (use default)
			"myDatabase", // Target a specific database
			{}, // Optional database options
			"dbAdminUser" // User role with permissions in the database
		);

		console.log("Database-specific role dropped:", dropRoleResult);
		//******************************************************************************\\
		//******************************************************************************\\
		const createViewPipeline = [
			{ $match: { status: "active" } }, // Only include documents with status 'active'
			{ $project: { _id: 0, name: 1, total: { $sum: "$amount" } } } // Project selected fields
		];

		const createViewResult = await testModel.createView(
			"activeUsersView", // Name of the view
			"users", // The source collection
			createViewPipeline, // Aggregation pipeline for the view
			{}, // Optional command options
			undefined, // Client session (use default)
			"myDatabase", // Database name
			{}, // Optional database options
			"dbAdminUser" // Role with necessary privileges
		);

		console.log("View created:", createViewResult);
		//******************************************************************************\\
		//******************************************************************************\\
		const siblingDb = await testModel.getSiblingDB(
			"otherDatabase", // The name of the sibling database
			{}, // Optional database options
			undefined, // Client session (use default)
			"myCurrentDatabase", // The current database
			"dbAdminUser" // The role with necessary permissions
		);

		console.log("Connected to sibling database:", siblingDb.databaseName);

		// You can now perform operations on the sibling database, like listing collections:
		const collections = await siblingDb.listCollections().toArray();
		console.log("Collections in sibling database:", collections);
		//******************************************************************************\\
		//******************************************************************************\\
		const currentOperations = await testModel.currentOp(
			{}, // Command options (e.g., filtering on specific operations)
			{}, // Additional command options
			undefined, // Use default client/session
			"admin", // Run this on the admin database
			{}, // Default dbOptions
			"clusterMonitorUser" // A role suitable for monitoring cluster operations
		);
		//******************************************************************************\\
		//******************************************************************************\\
		const operationIdToKill = 12345; // Replace with the actual operation ID you want to terminate
		const killResult = await testModel.killOp(
			operationIdToKill, // ID of the operation to kill
			{}, // Additional command options
			undefined, // Use default client/session
			"admin", // Run this on the admin database
			{}, // Default dbOptions
			"clusterManagerUser" // Role suitable for managing cluster operations
		);
		//******************************************************************************\\
		//******************************************************************************\\
		const repairResult = await testModel.repairDatabase(
			{}, // Optional additional command options
			undefined, // Use default client/session
			"yourDatabaseName", // The database to repair, defaults to 'admin'
			{}, // Default dbOptions
			"dbAdminUser" // Role suitable for managing the database
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.createUser({
			user: "johnDoe",
			pwd: "securePassword",
			roles: [{ role: "read" }, { role: "userAdmin" }]
		});
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.runCommand({ ping: 1 });
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.dropCollection("collection_to_drop");
		//******************************************************************************\\
		//******************************************************************************\\
		//? dropTarget: By default, if a collection with the new name already exists, the operation will throw an error. If you set { dropTarget: true }, MongoDB will drop the existing collection before renaming.
		await testModel.renameCollection("old_collection_name", "new_collection_name", { dropTarget: true });
		await testModel.renameCollection("old_collection_name", "new_collection_name");
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.getCollectionNames();
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.stats();
		//******************************************************************************\\
		//******************************USING TRANSACTION*******************************\\
		const { client } = await testModel.getConnection("readWriteUser");
		const session = client.startSession();
		try {
			session.startTransaction();

			const document = {
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			};

			// Pass session to insertOne operation
			await testModel.insertOne(document, {}, { clientFromSession: client, session: session });

			await session.commitTransaction();
		} catch (error) {
			await session.abortTransaction();
			throw new MongoException(`An error occurred during the transaction! \n Error: ${error}`);
		} finally {
			await session.endSession();
		}
		//******************************************************************************\\
		//******************************************************************************\\
		//? findAndModify to add
		await testModel.findAndModify(
			{ title: "Non-Existent Title" },
			{ $set: { title: new String("Upserted Title"), number: new Int32(123) } } as any,
			{ returnDocument: "after", upsert: true }
		);
		//******************************************************************************\\
		//******************************************************************************\\
		//? findAndModify to edit
		await testModel.findAndModify(
			{
				title: "Old Title" // Find the document with this title
			},
			{
				title: "New Title" // Update the title to this new value
			},
			{
				returnDocument: "after", // Return the document after the modification
				upsert: false // Don't insert if no document matches the filter
			}
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.findOneAndDelete(
			{ title: "To Be Deleted" }, // Filter to match the document
			{} // No additional options in this case
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.findOneAndReplace(
			{ title: "Old Title" }, // Filter to match the document
			{ title: "Replaced Title", number: new Int32(123) }, // The replacement document
			{ returnDocument: "after", upsert: true } // Options to return the new document after replacement
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.findOneAndUpdate(
			{ title: "Old Title" }, // Filter to match the document
			{ uuid: new UUID().toBinary() }, // The update to apply
			{ returnDocument: "after", upsert: true } // Options to return the new document after the update
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.countDocuments({
			title: "Document Title", // Count documents where 'title' matches this value
			bool: true // Count documents where 'bool' is true
		});
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.listCollections();
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.listIndexes();
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.listSearchIndexes();
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.dbAggregate([
			{ $match: { bool: true } }, // Match documents where 'bool' is true
			{ $group: { _id: "$title", count: { $sum: 1 } } }, // Group by 'title' and count occurrences
			{ $sort: { count: -1 } } // Sort by count in descending order
		]);
		//******************************************************************************\\
		//******************************************************************************\\
		const pipeline = [
			{ $match: { bool: true } }, // Match documents where 'bool' is true
			{ $group: { _id: "$title", count: { $sum: 1 } } }, // Group by 'title' and count occurrences
			{ $sort: { count: -1 } } // Sort by count in descending order
		];

		await testModel.aggregate(pipeline);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.findOne({
			title: "Document Title", // Find a document where title matches this value
			number: new Int32(1) // Filter where number equals 1
		});
		//******************************************************************************\\
		//******************************************************************************\\
		const query = {
			title: "Document Title", // Partial query to find documents with this title
			number: new Int32(1) // Find documents where number equals 1
		};

		await testModel.find(query);
		//******************************************************************************\\
		//******************************************************************************\\
		const document = {
			title: "test",
			number: new Int32(123),
			double: new Double(123.45),
			bool: true,
			null: null,
			array: [1, 2, 3],
			object: { key: "value" },
			undefined: undefined,
			date: new Date("2024-09-28T16:12:14.510Z"),
			binaryDate: new Binary(Buffer.from("binary")),
			objectId: new ObjectId("66f82adea393a4c09db65217"),
			minKey: new MinKey(),
			symbol: new BSONSymbol("symbol"),
			regEx: new BSONRegExp("pattern", "i"),
			js: new Code("function() { return true; }"),
			timestamp: new Timestamp(BigInt(0)),
			decimal128: Decimal128.fromString("123.456"),
			uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
		};

		await testModel.insertOne(document);
		//******************************************************************************\\
		//******************************************************************************\\
		const documents = [
			{
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			},
			{
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			}
		];

		await testModel.insertMany(documents);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.bulkWrite(
			[
				// Insert operation
				{
					insertOne: {
						document: {
							title: "New Title",
							number: new Int32(123)
						} as OptionalId<any>
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
			],
			{}
		);
		await testModel.bulkWrite(
			[
				{
					updateMany: {
						filter: { title: { $in: ["Title1", "Title2"] } },
						update: { $set: { number: new Int32(456) } }
					}
				}
			],
			{}
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.deleteOne(
			{ title: { $in: ["Title1", "Title2"] }, bool: { $in: [false, false] } } as any, // Using MongoDB operator `$in` to match multiple titles
			{}
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.deleteMany(
			{ title: { $in: ["Title1", "Title2"] } as any, js: new Code("() => {}") }, // Using MongoDB operator `$in`
			{}
		);
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.updateOne({ title: "Old Title", bool: false }, { timestamp: new Timestamp(BigInt(0)) }, {});
		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.updateMany(
			{ title: "test", bool: true, number: new Int32(22) },
			{ title: "Adventure", null: null }
		);

		//******************************************************************************\\
		//******************************************************************************\\
		const result = await testModel.replaceOne(
			{
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			},
			{
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			}
		);

		if (result.modifiedCount > 0) {
			console.log("Document replaced successfully.");
		} else {
			console.log("No document matched the filter.");
		}

		//******************************************************************************\\
		//******************************************************************************\\
		const changeStream = await testModel.watch([], { fullDocument: "updateLookup" });

		// Handle each change in the collection
		changeStream.on("change", (change: ChangeStreamDocument<Filter<{}>>) => {
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
		setTimeout(() => {
			changeStream.close();
			console.log("Change stream closed");
		}, 60000); // Close after 1 minute
		//******************************************************************************\\
		//******************************************************************************\\

		await testModel.distinct("title", { title: "test" });

		//******************************************************************************\\
		//******************************************************************************\\
		await testModel.updateOne(
			{
				title: "",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			},
			{
				title: "test",
				number: new Int32(123),
				double: new Double(123.45),
				bool: true,
				null: null,
				array: [1, 2, 3],
				object: { key: "value" },
				undefined: undefined,
				date: new Date("2024-09-28T16:12:14.510Z"),
				binaryDate: new Binary(Buffer.from("binary")),
				objectId: new ObjectId("66f82adea393a4c09db65217"),
				minKey: new MinKey(),
				symbol: new BSONSymbol("symbol"),
				regEx: new BSONRegExp("pattern", "i"),
				js: new Code("function() { return true; }"),
				timestamp: new Timestamp(BigInt(0)),
				decimal128: Decimal128.fromString("123.456"),
				uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
			}
		);
		//******************************************************************************\\
		//******************************************************************************\\
	}

	allMongoDbDataTypes():
		| String
		| Int32
		| Double
		| Boolean
		| null
		| Array<any>
		| Object
		| undefined
		| Date
		| Binary
		| ObjectId
		| MinKey
		| BSONSymbol
		| BSONRegExp
		| Code
		| Timestamp
		| UUID
		| Decimal128 {
		return {
			title: "string",
			number: new Int32(123),
			double: new Double(123.45),
			bool: true,
			null: null,
			array: [1, 2, 3],
			object: { key: "value" },
			undefined: undefined,
			date: new Date("2024-09-28T16:12:14.510Z"),
			binaryDate: new Binary(Buffer.from("binary")),
			objectId: new ObjectId("66f82adea393a4c09db65217"),
			minKey: new MinKey(),
			symbol: new BSONSymbol("symbol"),
			regEx: new BSONRegExp("pattern", "i"),
			js: new Code("function() { return true; }"),
			timestamp: new Timestamp(BigInt(0)),
			decimal128: Decimal128.fromString("123.456"),
			uuid: new UUID("4ec7fc46-0735-41a1-9665-882140180a54")
		};
	}
};
