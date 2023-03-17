'use strict';

import i18next from 'i18n';

/**
 * @author Khdir, Abdullah
 * @see github.com/mashpie/i18n-node
 * @copyright Copyright (c) 2011-present Marcus Spiegel <marcus.spiegel@gmail.com>
*/
export = class I18next{
    private static i18next: I18next;
    private i18next: typeof import('i18n');
    private constructor() {
        this.i18next = i18next;
    }

    /**
     * @function getI18nextInstance
     * @description Inits or gives back an instance for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    static getI18nextInstance () : typeof import('i18n'){
        if (this.i18next) {
            return this.i18next.getI18next;
        }
        this.i18next = new I18next();
        return this.i18next.getI18next
    }

    /**
     * @function getLodash
     * @description Getter method for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    private get getI18next() : typeof import('i18n'){
        return this.i18next;
    }
}