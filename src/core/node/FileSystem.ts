"use strict";

import fileSystem from "fs";
import { promises as promisifyfileSystem } from "fs";
import { Singleton } from "../Singleton/Singleton";

/**
 * @class FileSystem
 * @constructor
 * @description Class FileSystem is used to access the file system
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 */
export = class FileSystem {
	private static promisifyInstance: FileSystem;
	private static instance: FileSystem;
	private fileSystem: typeof fileSystem;
	private promisifyfileSystem: typeof promisifyfileSystem;
	private constructor() {
		this.fileSystem = fileSystem;
		this.promisifyfileSystem = promisifyfileSystem;
	}

	/**
	 * @function getPathInstance
	 * @description Inits or gives back an instance for path class
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Path
	 */
	static getPromisifyFileSystemInstance(): typeof promisifyfileSystem {
		if (this.instance) {
			return this.instance.getPromisifyFileSystem;
		}

		this.instance = new FileSystem();
		return this.instance.getPromisifyFileSystem;
	}

	/**
	 * @function getPathInstance
	 * @description Inits or gives back an instance for path class
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns Path
	 */
	static getFileSystemInstance(): typeof fileSystem {
		if (this.instance) {
			return this.instance.getFileSystem;
		}
		this.instance = new FileSystem();
		return this.instance.getFileSystem;
	}

	/**
	 * @function getPromisifyFileSystem
	 * @description Getter method for promisify fs object
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns FileSystem
	 */
	private get getPromisifyFileSystem(): typeof promisifyfileSystem {
		return this.promisifyfileSystem;
	}

	/**
	 * @function getFileSystem
	 * @description Getter method for fs object
	 * @version 1.0.0
	 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
	 * @returns FileSystem
	 */
	private get getFileSystem(): typeof fileSystem {
		return this.fileSystem;
	}

	static getAllSubfolders = (
		dirPath: string,
		recursionDepth: number = 0,
		maxRecursionDepth: number = 0
	): string[] => {
		let subfolders: Set<string> = new Set();
		const path = Singleton.getPath();

		fileSystem.readdirSync(dirPath).forEach((file) => {
			const fullPath = path.join(dirPath, file);

			if (fileSystem.statSync(fullPath).isDirectory()) {
				subfolders.add(`/${file}/`);

				if (recursionDepth < maxRecursionDepth) {
					const nestedSubfolders = this.getAllSubfolders(fullPath, recursionDepth + 1, maxRecursionDepth);
					nestedSubfolders.forEach((folder) => subfolders.add(folder));
				}
			}
		});

		return Array.from(subfolders);
	};
};
