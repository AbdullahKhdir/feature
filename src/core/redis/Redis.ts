"use strict";

import { createClient, RedisClientOptions, RedisClientType, SetOptions } from "redis";
import * as config from "../config";
import LogicException from "../exception/types/LogicException";

export = class Redis {
	protected redis: RedisClientType;
	public static instanceCount: number = 0;
	public static instance: Redis;

	private constructor(options?: RedisClientOptions) {
		this.redis = createClient(options) as RedisClientType;
		this.redis.on("error", (err) => {
			console.error("Redis Client Error:", err);
		});
	}

	/**
	 * @static
	 * @function getInstanceCount
	 * @description Returns how many instances are currently initiated.
	 * @returns {number}
	 */
	static getInstanceCount(): number {
		return Redis.instanceCount;
	}

	/**
	 * @static
	 * @function getRedisInstance
	 * @description Inits or returns the Redis client instance
	 * @returns {Redis}
	 */
	static getRedisInstance(
		options: RedisClientOptions = {
			url: config.configurations().redisUrl,
			socket: {
				port: config.configurations().redisSocket.redisSocketPort,
				host: config.configurations().redisSocket.redisSocketHost,
				keepAlive: config.configurations().redisSocket.redisKeepAlive,
				noDelay: config.configurations().redisSocket.redisNoDelay,
				reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
			},
			database: config.configurations().redisDatabase,
			disableOfflineQueue: config.configurations().redisDisableOfflineQueue
		}
	): Redis {
		if (!this.instance) {
			this.instance = new Redis(options);
			Redis.instanceCount++;
		}

		return this.instance;
	}

	/**
	 * @async
	 * @function connect
	 * @description Ensures that the client is connected.
	 * @returns {Promise<void>}
	 */
	async connect(): Promise<void> {
		if (!this.redis.isOpen) {
			await this.redis.connect();
		}
	}

	/**
	 * @async
	 * @description
	 * Forcibly terminates the connection without sending the QUIT command.
	   Typically used when you need to quickly close a connection without waiting for any remaining commands to be processed.
	   This might leave some commands unprocessed, making it less ideal for most use cases.
	 * @returns {Promise<void>}
	 */
	async disconnect(): Promise<void> {
		await this.redis.disconnect();
	}

	/**
	 * @async
	 * @description 
	 * Recommended for a clean shutdown.
	   Gracefully closes the connection to the Redis server.
	   It sends the QUIT command to the Redis server, which allows the server to close the connection cleanly.
	   Ensures that any pending commands are completed before the connection is closed.
	 * @returns {Promise<void>}	 
	 */
	async quit(): Promise<void> {
		if (this.redis.isOpen) {
			await this.redis.quit();
		}
	}

	/**
	 * @async
	 * @function redisSet
	 * @description Sets a key and value for the query.
	 * @returns {Promise<string | null>}
	 */
	async redisSet(
		key: string | Buffer,
		value: number | string | Buffer,
		options?: SetOptions
	): Promise<string | null> {
		try {
			await this.connect();
			return await this.redis.set(key, value, options);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function redisGet
	 * @description Retrieves the value from the Redis cache system of the saved query.
	 * @param {string | Buffer} key - A placeholder as string or Buffer to get the saved query from that key.
	 * @returns {Promise<string | null>}
	 */
	async redisGet(key: string | Buffer): Promise<string | null> {
		try {
			await this.connect();
			return await this.redis.get(key);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function hSet
	 * @description Sets a hash field-value pair or multiple fields at once.
	 * @param {string | Buffer} key - The key of the hash.
	 * @param {string | Buffer | Record<string, string | Buffer | number>} field - The field name or an object containing multiple fields.
	 * @param {string | Buffer | number} [value] - The value for the specified field, required if the field is not an object.
	 * @returns {Promise<number>} - The number of fields that were newly added.
	 * @throws {LogicException} - Throws an error if value is required but not provided.
	 */
	async hSet(
		key: string | Buffer,
		field: string | Buffer | Record<string, string | Buffer | number>,
		value?: string | Buffer | number
	): Promise<number> {
		try {
			await this.connect();

			if (typeof field === "object" && !Buffer.isBuffer(field)) {
				return await this.redis.hSet(key, field);
			}

			if (!value) {
				throw new LogicException("Value is required when setting a single field.");
			}

			return await this.redis.hSet(key, field as string | Buffer, value);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function hGet
	 * @description Retrieves the value of a hash field.
	 * @param {string | Buffer} key - The key of the hash.
	 * @param {string | Buffer} field - The field name within the hash.
	 * @returns {Promise<string | Buffer | null>} - Returns the value of the field as a string or Buffer, or null if the field does not exist.
	 */
	async hGet(key: string | Buffer, field: string | Buffer): Promise<string | Buffer | null> {
		try {
			await this.connect();
			const result = await this.redis.hGet(key, field);
			return result ?? null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function hGetAll
	 * @description Retrieves all fields and values of a hash as an object.
	 * @param {string | Buffer} key - The key of the hash.
	 * @returns {Promise<Record<string, string>>} - Returns an object where each key-value pair corresponds to a field and its value as strings.
	 */
	async hGetAll(key: string | Buffer): Promise<Record<string, string>> {
		try {
			await this.connect();
			return await this.redis.hGetAll(key);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function hGetAllWithBuffers
	 * @description Retrieves all fields and values of a hash as an object, converting values to Buffers if needed.
	 * @param {string | Buffer} key - The key of the hash.
	 * @returns {Promise<Record<string, string | Buffer>>} - Returns an object where each key-value pair corresponds to a field and its value.
	 */
	async hGetAllWithBuffers(key: string | Buffer): Promise<Record<string, string | Buffer>> {
		try {
			await this.connect();
			const result = await this.redis.hGetAll(key);
			//? Manually handle conversion if some fields need to be treated as Buffers.
			const convertedResult: Record<string, string | Buffer> = {};
			for (const [field, value] of Object.entries(result)) {
				convertedResult[field] = value;
			}
			return convertedResult;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function lPush
	 * @description Pushes one or more values to the head of a list.
	 * @param {string | Buffer} key - The key of the list.
	 * @param {...(string | Buffer | number)[]} values - One or more values to push to the list.
	 * @returns {Promise<number>} - Returns the length of the list after the push operation.
	 */
	async lPush(key: string | Buffer, ...values: (string | Buffer | number)[]): Promise<number> {
		try {
			await this.connect();
			const stringValues = values.map((value) => value.toString());
			return await this.redis.lPush(key, stringValues);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function rPush
	 * @description Pushes one or more values to the tail of a list.
	 * @param {string | Buffer} key - The key of the list.
	 * @param {...(string | Buffer | number)[]} values - One or more values to push to the list.
	 * @returns {Promise<number>} - Returns the length of the list after the push operation.
	 */
	async rPush(key: string | Buffer, ...values: (string | Buffer | number)[]): Promise<number> {
		try {
			await this.connect();
			const stringValues = values.map((value) => value.toString());
			return await this.redis.rPush(key, stringValues);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function lPop
	 * @description Removes and returns the first element of the list stored at the specified key.
	 * @param {string | Buffer} key - The key of the list.
	 * @returns {Promise<string | Buffer | null>} - Returns the value of the first element, or null if the list is empty or does not exist.
	 */
	async lPop(key: string | Buffer): Promise<string | Buffer | null> {
		try {
			await this.connect();
			const result = await this.redis.lPop(key);
			return result ?? null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function rPop
	 * @description Removes and returns the last element of the list stored at the specified key.
	 * @param {string | Buffer} key - The key of the list.
	 * @returns {Promise<string | Buffer | null>} - Returns the value of the last element, or null if the list is empty or does not exist.
	 */
	async rPop(key: string | Buffer): Promise<string | Buffer | null> {
		try {
			await this.connect();
			const result = await this.redis.rPop(key);
			return result ?? null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function sAdd
	 * @description Adds one or more members to a set. Automatically serializes objects.
	 * @param {string | Buffer} key - The key of the set.
	 * @param {...(string | Buffer | number | Object)[]} values - One or more values to add to the set.
	 * @returns {Promise<number>} - Returns the number of elements that were added to the set (excluding duplicates).
	 */
	async sAdd(key: string | Buffer, ...values: (string | Buffer | number | Object)[]): Promise<number> {
		try {
			await this.connect();
			const stringValues = values.map((value) =>
				typeof value === "object" && value !== null ? JSON.stringify(value) : value.toString()
			);

			return await this.redis.sAdd(key, stringValues);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function sMembers
	 * @description Retrieves and deserializes all objects from a Redis set.
	 * @param {string | Buffer} key - The key of the set.
	 * @returns {Promise<(Object | string)[]>} - Returns an array of deserialized objects or original strings.
	 */
	async sMembers(key: string | Buffer): Promise<(Object | string)[]> {
		try {
			await this.connect();
			const members = await this.redis.sMembers(key);
			return members.map((member) => {
				try {
					return JSON.parse(member);
				} catch {
					return member;
				}
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function sIsMember
	 * @description Checks if a given value is a member of a set.
	 * @param {string | Buffer} key - The key of the set.
	 * @param {string | Buffer | number | Object} value - The value to check for membership in the set.
	 * @returns {Promise<boolean>} - Returns true if the value is a member of the set, false otherwise.
	 */
	async sIsMember(key: string | Buffer, value: string | Buffer | number | Object): Promise<boolean> {
		try {
			await this.connect();
			//? Serialize the object to a JSON string if necessary.
			const stringValue = typeof value === "object" && value !== null ? JSON.stringify(value) : value.toString();
			const result = await this.redis.sIsMember(key, stringValue);
			return Boolean(result);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function zAdd
	 * @description Adds one or more members with scores to a sorted set.
	 * @param {string | Buffer} key - The key of the sorted set.
	 * @param {...{ score: number, member: string | Buffer | Object }} members - One or more members with scores to add to the sorted set.
	 * @returns {Promise<number>} - Returns the number of new members added to the sorted set (not including updated members).
	 */
	async zAdd(
		key: string | Buffer,
		...members: { score: number; member: string | Buffer | Object }[]
	): Promise<number> {
		type ZMember = {
			score: number;
			value: string | Buffer;
		};

		try {
			await this.connect();
			const formattedMembers: ZMember[] = members.map(({ score, member }) => ({
				score,
				value: typeof member === "object" && member !== null ? JSON.stringify(member) : member.toString()
			}));

			const result = await this.redis.zAdd(
				key,
				formattedMembers.map(({ score, value }) => ({ score, value }))
			);

			return result;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function zRange
	 * @description Retrieves a range of members from a sorted set based on rank or score.
	 * @param {string} key - The key of the sorted set.
	 * @param {number} start - The starting index or score.
	 * @param {number} stop - The ending index or score.
	 * @param {boolean} [withScores=false] - Whether to include scores in the result.
	 * @returns {Promise<string[] | { member: string; score: number }[]>} - Returns an array of members or an array of objects with members and scores.
	 */
	async zRange(
		key: string,
		start: number,
		stop: number,
		withScores: boolean = false
	): Promise<string[] | { member: string; score: number }[]> {
		try {
			await this.connect();
			const result = withScores
				? await this.redis.zRange(key, start, stop, { WITHSCORES: true } as {})
				: await this.redis.zRange(key, start, stop);

			if (withScores && Array.isArray(result)) {
				const membersWithScores: { member: string; score: number }[] = [];
				for (let i = 0; i < result.length; i += 2) {
					const member = result[i];
					const score = parseFloat(result[i + 1]);
					membersWithScores.push({ member, score });
				}
				return membersWithScores;
			}

			return result as string[];
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function zScore
	 * @description Retrieves the score associated with a given member in a sorted set.
	 * @param {string} key - The key of the sorted set.
	 * @param {string | Buffer | number} member - The member whose score is to be retrieved.
	 * @returns {Promise<number | null>} - Returns the score as a number if the member exists, or null if the member does not exist.
	 */
	async zScore(key: string, member: string | Buffer | number): Promise<number | null> {
		try {
			await this.connect();
			const memberStr = typeof member === "number" ? member.toString() : member;
			const result = await this.redis.zScore(key, memberStr);
			return result !== null ? result : null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 // todo useful for chat applications
	 * @async
	 * @function publish
	 * @description Publishes a message to a specified channel.
	 * @param {string} channel - The channel to publish the message to.
	 * @param {string | Object} message - The message to be published. Objects are serialized to JSON.
	 * @returns {Promise<number>} - Returns the number of subscribers that received the message.
	 */
	async publish(channel: string, message: string | Object): Promise<number> {
		try {
			await this.connect();
			const messageStr = typeof message === "object" ? JSON.stringify(message) : message;
			return await this.redis.publish(channel, messageStr);
		} catch (error) {
			throw error;
		}
	}

	/**
	 // todo useful for chat applications
	 * @async
	 * @function subscribe
	 * @description Subscribes to a specified channel and handles incoming messages.
	 * @example
		await subscribe('myChannel', (message) => {
			console.log('Message received from myChannel:', message);
		});
	 * @param {string} channel - The channel to subscribe to.
	 * @param {(message: string) => void} onMessage - Callback function to handle messages.
	 * @returns {Promise<void>} - Resolves when subscription is set up.
	 * @info connection must be quitted after calling unsubscription  
	 */
	async subscribe(channel: string, onMessage: (message: string) => void): Promise<void> {
		try {
			await this.connect();
			await this.redis.subscribe(channel, (message) => {
				onMessage(message);
			});
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function unsubscribe
	 * @description unsubscribe from a channel and quit gracefully
	 * @param {string} channel - channel name
	 * @returns {Promise<void>}
	 */
	async unsubscribe(channel: string): Promise<void> {
		try {
			await this.redis.unsubscribe(channel);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function executeMulti
	 * @description Executes multiple Redis commands atomically using a transaction, with optional WATCH.
	 * @param {string} key - The key to watch if `watch` is true.
	 * @param {Array<(multi: ReturnType<typeof client.multi>) => Promise<void>>} operations - An array of functions that add commands to the multi block.
	 * @param {boolean} watch - Indicates whether to watch the specified key before executing the transaction.
	 * @returns {Promise<any[]>} - Returns an array of results for each command in the transaction.
	 * @example
	 * const results = await executeMulti('user:1', [
	 *   async (multi) => multi.set('user:1:name', 'Alice'),
	 *   async (multi) => multi.incr('user:1:loginCount')
	 * ], true);
	 * console.log(results);
	 */
	async executeMulti(
		key: string,
		operations: Array<(multi: ReturnType<typeof this.redis.multi>) => Promise<void>>,
		watch: boolean = false
	): Promise<any[]> {
		try {
			await this.connect();

			if (watch) {
				//? Watch the specified key.
				await this.redis.watch(key);
			}

			//? Start a multi block.
			const multi = this.redis.multi();

			//? Apply each operation function to the multi block using a for...of loop.
			for (const operation of operations) {
				await operation(multi);
			}

			//? Execute the transaction.
			const results = await multi.exec();

			if (results === null) {
				//? Transaction aborted due to changes on the watched key.
				return [];
			}

			//? Transaction results
			return results;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function expire
	 * @description Sets an expiration time (TTL) for a key.
	 * @param {string} key - The key for which to set the expiration time.
	 * @param {number} seconds - The time-to-live (TTL) in seconds.
	 * @returns {Promise<boolean>} - Returns true if the expiration time was set, false otherwise.
	 * @example
	 * const isExpiredSet = await expire('user:1:session', 3600);
	 * console.log(isExpiredSet); // true if the TTL was successfully set, false otherwise.
	 */
	async expire(key: string, seconds: number): Promise<boolean> {
		try {
			await this.connect();
			await this.redis.connect();
			return Boolean(await this.redis.expire(key, seconds));
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function xAdd
	 * @description Adds an entry to a Redis stream.
	 * @param {string} key - The name of the stream.
	 * @param {string} id - The ID for the entry (use '*' to auto-generate based on time).
	 * @param {Record<string, string | number>} fields - An object containing field-value pairs for the entry.
	 * @returns {Promise<string>} - Returns the ID of the added entry.
	 * @example
	 * const entryId = await xAdd('mystream', '*', { user: 'alice', action: 'login' });
	 * console.log('Entry ID:', entryId);
	 */
	async xAdd(key: string, id: string = "*", fields: Record<string, string | number>, options = {}): Promise<string> {
		try {
			await this.connect();
			//? Prepare the field-value pairs as an array of strings.
			const fieldValues: string[] = [];
			for (const [field, value] of Object.entries(fields)) {
				fieldValues.push(field, value.toString());
			}
			//? Add the entry to the stream.
			const entryId = await this.redis.xAdd(key, id, fieldValues as Record<string, any>, options as {});
			return entryId;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function xRange
	 * @description Retrieves a range of entries from a Redis stream.
	 * @param {string} key - The name of the stream.
	 * @param {string} start - The starting ID of the range (use '0' for the beginning).
	 * @param {string} end - The ending ID of the range (use '+' for the end).
	 * @param {number} [count] - Optional. The maximum number of entries to retrieve.
	 * @returns {Promise<Array<{ id: string, fields: Record<string, string> }>>} - Returns an array of stream entries.
	 * @example
	 * const entries = await xRange('mystream', '0', '+', 10);
	 * console.log(entries);
	 */
	async xRange(
		key: string,
		start: string,
		end: string,
		count?: number
	): Promise<Array<{ id: string; fields: Record<string, string> }>> {
		try {
			await this.connect();
			//? Prepare the options for the XRange command.
			const options = count !== undefined ? { COUNT: count } : undefined;
			//? Retrieve the range of entries from the stream.
			const result = await this.redis.xRange(key, start, end, options);
			//? Transform the result into an array of objects with IDs and field-value pairs.
			const entries = result.map(({ id, message }: { id: string; message: { [key: string]: string } }) => {
				return { id, fields: message };
			});
			return entries;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function del
	 * @description Deletes one or more keys.
	 * @param {...(string | Buffer)[]} keys - One or more keys to delete.
	 * @returns {Promise<number>} - Returns the number of keys that were deleted.
	 */
	async del(...keys: (string | Buffer)[]): Promise<number> {
		try {
			await this.connect();
			return await this.redis.del(keys);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function incr
	 * @description Increments the number stored at the key by one.
	 * @param {string} key - The key of the number to increment.
	 * @returns {Promise<number>} - Returns the new value of the key.
	 */
	async incr(key: string): Promise<number> {
		try {
			await this.connect();
			return await this.redis.incr(key);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function decr
	 * @description Decrements the number stored at the key by one.
	 * @param {string} key - The key of the number to decrement.
	 * @returns {Promise<number>} - Returns the new value of the key.
	 */
	async decr(key: string): Promise<number> {
		try {
			await this.connect();
			return await this.redis.decr(key);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function incrBy
	 * @description Increments the number stored at the key by a specified value.
	 * @param {string} key - The key of the number to increment.
	 * @param {number} increment - The value to increment by.
	 * @returns {Promise<number>} - Returns the new value of the key.
	 */
	async incrBy(key: string, increment: number): Promise<number> {
		try {
			await this.connect();
			return await this.redis.incrBy(key, increment);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function decrBy
	 * @description Decrements the number stored at the key by a specified value.
	 * @param {string} key - The key of the number to decrement.
	 * @param {number} decrement - The value to decrement by.
	 * @returns {Promise<number>} - Returns the new value of the key.
	 */
	async decrBy(key: string, decrement: number): Promise<number> {
		try {
			await this.connect();
			return await this.redis.decrBy(key, decrement);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function setEx
	 * @description Sets a key with an expiration time.
	 * @param {string} key - The key to set.
	 * @param {number} seconds - Time-to-live (TTL) in seconds.
	 * @param {string | Buffer} value - The value to set.
	 * @returns {Promise<string>} - Returns 'OK' if successful.
	 */
	async setEx(key: string, seconds: number, value: string | Buffer): Promise<string> {
		try {
			await this.connect();
			return await this.redis.setEx(key, seconds, value);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function keys
	 * @description Finds all keys matching a pattern.
	 * @param {string} pattern - The pattern to match keys against (e.g., 'user:*').
	 * @returns {Promise<string[]>} - Returns an array of matching keys.
	 */
	async keys(pattern: string): Promise<string[]> {
		try {
			await this.connect();
			return await this.redis.keys(pattern);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function exists
	 * @description Checks if a key exists.
	 * @param {string} key - The key to check.
	 * @returns {Promise<boolean>} - Returns true if the key exists, false otherwise.
	 */
	async exists(key: string): Promise<boolean> {
		try {
			await this.connect();
			return Boolean(await this.redis.exists(key));
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function incrEx
	 * @description Increments a key and sets a TTL if the key does not already exist.
	 * @param {string} key - The key to increment.
	 * @param {number} seconds - Time-to-live (TTL) in seconds if the key is created.
	 * @returns {Promise<number>} - Returns the new value after increment.
	 */
	async incrEx(key: string, seconds: number): Promise<number> {
		try {
			await this.connect();
			const value = await this.redis.incr(key);
			//? Only set the expiration if the increment was the first (value is 1).
			if (value === 1) {
				await this.redis.expire(key, seconds);
			}
			return value;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function cacheResult
	 * @description Stores a result in Redis with an expiry time.
	 * @param {string} key - The key under which to store the result.
	 * @param {any} value - The value to cache.
	 * @param {number} expiration - Expiration time in seconds.
	 * @returns {Promise<void>}
	 */
	async cacheResult(
		key: string,
		value: any,
		expiration: number = config.configurations().redisCacheExpiry
	): Promise<void> {
		try {
			await this.setEx(key, expiration, JSON.stringify(value));
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function getCachedResult
	 * @description Retrieves a cached result from Redis.
	 * @param {string} key - The key of the cached result.
	 * @returns {Promise<any | null>}
	 */
	async getCachedResult(key: string): Promise<any | null> {
		try {
			const result = await this.redisGet(key);
			return result ? JSON.parse(result) : null;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * @async
	 * @function invalidateCacheForCollection
	 * @description Invalidating cache for a collection on wildcard *
	 * @param {string} collectionName
	 * @returns {Promise<void>}
	 */
	async invalidateCacheForCollection(prefix: string, collectionName: string): Promise<void> {
		const pattern = `${prefix}:*:${collectionName}*`;
		const keys = await this.keys(pattern);

		if (keys && keys.length) {
			await this.del(...keys);
		}
	}
};
