"use strict";
// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
var map = {
    // angular bundles
    '@angular/core': 'vendor/@angular/core/bundles/core.umd.js',
    '@angular/common': 'vendor/@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'vendor/@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'vendor/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'vendor/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'vendor/@angular/http/bundles/http.umd.js',
    '@angular/router': 'vendor/@angular/router/bundles/router.umd.js',
    '@angular/forms': 'vendor/@angular/forms/bundles/forms.umd.js',
    // dependencies
    'angular2-highcharts': 'vendor/angular2-highcharts/dist',
    'highcharts/highstock.src': 'vendor/angular2-highcharts/dist/highstock.js',
    'ng2-bootstrap/ng2-bootstrap': 'vendor/ng2-bootstrap',
    'moment': 'vendor/moment/moment.js'
};
/** User packages configuration. */
var packages = {
    'angular2-highcharts': { main: 'index', format: 'cjs', defaultExtension: 'js' },
    'ng2-bootstrap/ng2-bootstrap': { main: 'ng2-bootstrap', format: 'cjs', defaultExtension: 'js' },
    'moment': { format: 'cjs' }
};
////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
var barrels = [
    // Thirdparty barrels.
    'rxjs',
    // App specific barrels.
    'app',
    'app/fptest',
    'app/common',
    'app/dashboard',
    'app/navbar',
    'app/watchlist'
];
var cliSystemConfigPackages = {};
barrels.forEach(function (barrelName) {
    cliSystemConfigPackages[barrelName] = { main: 'index' };
});
// Apply the CLI SystemJS configuration.
System.config({
    map: {
        'rxjs': 'vendor/rxjs',
        'main': 'main.js'
    },
    packages: cliSystemConfigPackages
});
// Apply the user's configuration.
System.config({ map: map, packages: packages });
//# sourceMappingURL=system-config.js.map