import winston from 'winston'

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: getLogFormat(),
        }),
    ],
})

function getLogFormat() {
    if (process.env.NODE_ENV === 'production') {
        return winston.format.combine(winston.format.timestamp(), winston.format.json())
    } else {
        return winston.format.combine(winston.format.simple(), winston.format.metadata())
    }
}

export default logger
