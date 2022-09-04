export enum BookingStatus {
    pending_payment = 'PENDING_PAYMENT',
    pending_approval = 'PENDING_APPROVAL',
    approved = 'APPROVED',
    cancelled = 'CANCELLED',
    active = 'ACTIVE',
    completed = 'COMPLETED',
}

export enum LogTypes {
    info = 'info',
    error = 'error',
    warn = 'warn',
    debug = 'debug',
    log = 'log',
}
