import EventEmitter from 'events';

const events = [
    'connect',
    'ready',
    'error',
    'close',
    'reconnecting',
    'end',
    'wait',
];

export const forwardEvents = (from: EventEmitter, to: EventEmitter): void =>
    events.forEach((event) =>
        from.on(event, (...eventArgs) =>
            to.emit(event, ...(eventArgs as [Error]))
        )
    );
