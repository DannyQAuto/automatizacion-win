// utilities/logs.ts
export class Logs {
    static info(message: string, ...args: any[]): void {
        console.log(`[INFO] ${new Date().toISOString()}: ${this.formatMessage(message, args)}`);
    }

    static debug(message: string, ...args: any[]): void {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${this.formatMessage(message, args)}`);
    }

    static error(message: string, ...args: any[]): void {
        console.error(`[ERROR] ${new Date().toISOString()}: ${this.formatMessage(message, args)}`);
    }

    static warn(message: string, ...args: any[]): void {
        console.warn(`[WARN] ${new Date().toISOString()}: ${this.formatMessage(message, args)}`);
    }

    private static formatMessage(message: string, args: any[]): string {
        if (args.length === 0) return message;

        return message.replace(/%s/g, () => {
            return args.length > 0 ? String(args.shift()) : '%s';
        });
    }
}