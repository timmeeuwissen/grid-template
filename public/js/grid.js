(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/index.d.ts" />
"use strict";
const controller_1 = require("./grid/controller");
$('.grid').each(function (index, elem) {
    // separation of config from logic, since it might come from elsewhere
    var gridConfig = JSON.parse(elem.getAttribute('data-grid-config'));
    var mainGrid = new controller_1.default(window, elem, gridConfig);
});

},{"./grid/controller":2}],2:[function(require,module,exports){
"use strict";
class GridController {
    constructor(window, elem, config) {
        this.window = window;
        this.elem = elem;
        this.config = config;
        this.height = 0;
        this.width = 0;
        this.update();
        this.observe();
    }
    observe() {
        this.window.addEventListener('resize', this.monitorResizes);
    }
    monitorResizes(evt) {
        this.updateSizes();
    }
    updateSizes() {
        this.width = this.elem.clientWidth;
        this.height = this.elem.clientHeight;
    }
    getItemsOnLine() {
        return Math.floor(this.width / this.config.minItemWidth);
    }
    update() {
        this.updateSizes();
        this.elem.setAttribute(GridController.ATTR_DIM_X, String(this.getItemsOnLine()));
    }
}
GridController.ATTR_DIM_X = 'data-grid-dim-x';
GridController.ATTR_DIM_Y = 'data-grid-dim-y';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GridController;

},{}]},{},[1]);
