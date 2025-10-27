// wdio.conf.ts
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
runner: 'local',
specs: [
'./test/specsapp/**/*.ts'
],
exclude: [],
maxInstances: 1,

// CORREGIDO: Configuración para forzar apertura de la app Win
capabilities: [{
platformName: 'Android',
'appium:deviceName': 'emulator-5554',
'appium:platformVersion': '11.0',
'appium:automationName': 'UiAutomator2',
// 'appium:app': './test/apps/win.apk', // ← COMENTADA porque ya está instalada
'appium:appPackage': 'com.win.miwin_app',
'appium:appActivity': 'com.win.miwin_app.MainActivity',
'appium:autoGrantPermissions': true,
'appium:noReset': false, // ← CAMBIADO A false para reiniciar la app
'appium:fullReset': false,
'appium:newCommandTimeout': 300,
'appium:avd': 'mobile_emulator1',
// NUEVOS PARÁMETROS PARA FORZAR APERTURA:
'appium:appWaitPackage': 'com.win.miwin_app',
'appium:appWaitActivity': 'com.win.miwin_app.*',
'appium:appWaitDuration': 30000,
'appium:autoLaunch': true, // ← FORZAR AUTO LAUNCH
'appium:androidInstallTimeout': 90000,
'appium:uiautomator2ServerLaunchTimeout': 90000
}],

logLevel: 'info',
bail: 0,
baseUrl: 'http://localhost',
waitforTimeout: 10000,
connectionRetryTimeout: 120000,
connectionRetryCount: 3,

services: [
['appium', {
command: 'appium',
args: {
relaxedSecurity: true,
logLevel: 'debug'
}
}]
],

framework: 'mocha',
reporters: ['spec'],

mochaOpts: {
ui: 'bdd',
timeout: 300000
},

autoCompileOpts: {
autoCompile: true,
tsNodeOpts: {
transpileOnly: true
}
},

// AGREGAR HOOKS PARA DEBUG
onPrepare: function (config, capabilities) {
        console.log('🚀 Iniciando Appium - Forzando apertura de app Win...');
    },

    beforeSession: function (config, capabilities, specs) {
        console.log('📱 Configurando sesión para app Win...');
    }
};