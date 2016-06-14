/// <reference path='_BackendTypes.ts' />

import * as winston from 'winston';
import * as morgan from 'morgan';
import * as api from './ram/ServerAPI';

/* tslint:disable:no-var-requires */
const conf:api.IRamConf = require(`${process.env.RAM_CONF}`);

const lpad = (value:Object, size:number, char:string) => {
    let s = value + '';
    while (s.length < size) {
        s = char + s;
    }
    return s;
};

const rpad = (value:Object, size:number, char:string) => {
    let s = value + '';
    while (s.length < size) {
        s = s + char;
    }
    return s;
};

const formatNow = () => {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const strTime = lpad(hours, 2, ' ') + ':' + lpad(minutes, 2, '0') + ':' + lpad(seconds, 2, '0');
    return '[' +
        lpad(date.getDate(), 2, '0') + '/' +
        lpad(date.getMonth() + 1, 2, '0') +  '/' +
        date.getFullYear().toString().substr(2, 2) +
        '  ' +
        strTime +
        ']';
};

export const logger = new (winston.Logger)({
    exitOnError: false,
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            humanReadableUnhandledException: true,
            colorize: true,
            timestamp: formatNow,
            formatter: function (options:{timestamp:() => string, level:string, message:string}) {
                return options.timestamp() + ' ' +
                    rpad('[' + options.level + ']', 7, ' ') + ' ' +
                    (undefined !== options.message ? options.message : '');
            }
        }),
        new (winston.transports.File)({
            level: 'debug',
            filename: `${conf.logDir}/ram.log`,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: (1024 * 1024), //1MB
            maxFiles: 5,
            colorize: false,
            timestamp: formatNow,
            formatter: function (options:{timestamp:() => string, level:string, message:string}) {
                return options.timestamp() + ' ' +
                    rpad('[' + options.level + ']', 7, ' ') + ' ' +
                    (undefined !== options.message ? options.message : '');
            }
        })
    ]
});

class ConsoleLogWriter implements morgan.StreamOptions {
    public write(message:string) {
        logger.info(message);
    }
}

export const logStream:morgan.StreamOptions = new ConsoleLogWriter();
