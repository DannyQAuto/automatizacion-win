// utilities/DriverProvider.ts
export class DriverProvider {
    private static currentDriver: any = null;

    public static set(driver: any): void {
        this.currentDriver = driver;
        console.log('✅ Driver configurado en DriverProvider');
    }

    public static get(): any {
        if (!this.currentDriver) {
            throw new Error('❌ Driver no ha sido inicializado. Llama a DriverProvider.set() primero.');
        }
        return this.currentDriver;
    }

    public static clear(): void {
        if (this.currentDriver) {
            console.log('🔄 Limpiando driver del Provider');
            this.currentDriver = null;
        }
    }

    public static hasDriver(): boolean {
        return this.currentDriver !== null;
    }
}