
import mysql from 'mysql2';
import Application from "../../app/Application";
import Constants from "../../app/utils/Constants";
import Lodash from "../../app/utils/Lodash";
import Db from "../database/Db";
import { Express } from "../framework/Express";
import BodyParser from "../node/Bodyparser";
import FileSystem from "../node/FileSystem";
import Path from "../node/Path";
import Workerpool from "../worker_pool/workerpool";

/**
 * @class Singleton
 * @constructor
 * @description 
 * Class Singleton is used to get instances of all singleton classes and plugins
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export class Singleton{

    private static instance: Singleton;
    private constructor() {
    }

    //*****************************\\
    //* Database getter functions *\\
    //*****************************\\
    public static getDb() : Db {
        return Db.getDbInstance();
    }

    public static getDbSession() : typeof mysql {
        return Db.getDbInstance().getMysqlInstance;
    }

    //**************************************************\\
    //* Database and Express Sessions getter functions *\\
    //**************************************************\\
    public static getExpressSession() {
        // return ExpressSession.getExpressSessionInstance();
    }

    public static getExpressMysqlSession() {
        // return ExpressMysqlSession.getExpressMysqlSessionInstance();
    }

    
    //****************************\\
    //* Express getter functions *\\
    //****************************\\
    public static getExpress() : Express {
        return Express.getExpressInstance();
    }

    public static getWorkerPool() : Workerpool {
        return Express.getExpressInstance().getWorkerPool();
    }

    //*******************************\\
    //* Application getter function *\\
    //*******************************\\
    public static getApplication() : Application {
        return Application.getAppInstance;
    }

    public static getExpressApp() {
        return Application.getAppInstance.getActiveExpress;
    }

    //**************************\\
    //* Lodash getter function *\\
    //**************************\\
    public static getLodash() : typeof import('lodash'){
        return Lodash.getLodashInstance();
    }

    //*****************************\\
    //* Constants getter function *\\
    //*****************************\\
    public static getConstants() {
        return Constants.getConstantsInstance();
    }

    //************************\\
    //* Path getter function *\\
    //************************\\
    public static getPath() : typeof import('path'){
        return Path.getPathInstance();
    }

    //******************************\\
    //* FileSystem getter function *\\
    //******************************\\
    public static getFileSystem() : typeof import('fs'){
        return FileSystem.getFileSystemInstance();
    }

    //******************************\\
    //* BodyParser getter function *\\
    //******************************\\
    public static getBodyParser() : typeof import('body-parser'){
        return BodyParser.getBodyParserInstance();
    }

    //******************************\\
    //* Singleton getter function *\\
    //******************************\\
    static get getSingletonInstance() : Singleton {
        if (this.instance) {
            return this.instance
        }
        return this.instance = new Singleton();
    }
}