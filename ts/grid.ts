/// <reference path="../typings/index.d.ts" />

import GridConfig from "./grid/config"
import GridController from "./grid/controller"

$('.grid').each(function(index, elem){
  // separation of config from logic, since it might come from elsewhere
  var gridConfig:GridConfig = JSON.parse(elem.getAttribute('data-grid-config'));
  var mainGrid = new GridController(window, elem, gridConfig);
});
