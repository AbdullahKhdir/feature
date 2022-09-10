import Cryptr from 'cryptr';
import * as config from '../config'

const cryptr = new Cryptr(config.configurations().encryption_key);

export const encrypt = (string: string) => {
    return cryptr.encrypt(string);
}

export const decrypt = (string: string) => {
    return cryptr.decrypt(string);
}