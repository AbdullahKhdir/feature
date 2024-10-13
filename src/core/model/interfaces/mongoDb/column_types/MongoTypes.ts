export type MongoTypeIdAutoIncrement = "AUTO_INCREMENT";
export type MongoTypeIdBinary = "BINARY";
export type MongoTypeIdUUID = "UUID";
export type StrictFilter<T> = {
	[K in keyof T]?: T[K] extends string
		? string
		: T[K] extends number
		? number
		: T[K] extends boolean
		? boolean
		: T[K];
};
