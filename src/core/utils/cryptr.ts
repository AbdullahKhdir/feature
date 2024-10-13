import becrypt from "bcryptjs";
import Cryptr from "cryptr";
import * as config from "../config";

const cryptr = new Cryptr(config.configurations().encryptionKey);

export const encrypt = (string: string) => {
	return cryptr.encrypt(string);
};

export const decrypt = (string: string) => {
	return cryptr.decrypt(string);
};

export const enBecrypt = async (password: string, saltRound: number = 10): Promise<string> => {
	if (!password) {
		return "";
	}

	const salt = await becrypt.genSalt(saltRound);
	const hashedPassword = await becrypt.hash(password, salt);
	return hashedPassword;
};

export const isBecryptMatch = async (
	password: string,
	hashedPassword: string = config.configurations().mongoAdminPassword
): Promise<boolean> => {
	try {
		return await becrypt.compare(password, hashedPassword);
	} catch (error) {
		throw error;
	}
};
