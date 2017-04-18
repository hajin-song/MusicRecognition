/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


function __findPos(obj) {
  var curleft = 0,
      curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
};

function __getPoint(e) {
  console.log(this);
  var pos = __findPos(this);
  var x = e.pageX - pos.x;
  var y = e.pageY - pos.y;
  return [x, y];
}

function initialiseCropper(imageID) {
  var imageDOM = $('#' + imageID);
  imageDOM.on('src-updated', function (e) {
    imageDOM.cropper({
      crop: function crop(e) {
        // Output the result data for cropping image.
        console.log(e.x, e.y);
        console.log(e.width, e.height);
        console.log(e.scaleX, e.scaleY);
      }
    });
  });
}

exports.initialiseCropper = initialiseCropper;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function __reloadCropperImage(imageSource, imageID) {
  var img = new Image();
  var imageDOM = $("#" + imageID);
  imageDOM.attr('src', imageSource);
  imageDOM.cropper({
    crop: function crop(e) {
      // Output the result data for cropping image.
      console.log(e.x, e.y);
      console.log(e.width, e.height);
      console.log(e.scaleX, e.scaleY);
    }
  });
  $(".cropper-canvas img").attr('src', imageSource);
  $(".cropper-view-box img").attr('src', imageSource);
  var imageData = $("#image").cropper('getImageData');
  var canvasData = $("#image").cropper('getCanvasData');
  console.log(imageData);
  console.log(canvasData);
}

function initialiseCanvasPreview(inputID, imageID) {
  $("#" + inputID).on("change", function (e) {
    $("#image-preview").html("");
    $("#image-preview").append($('<img id="image" style="max-width:100%;"></img>'));
    var reader = new FileReader();
    reader.onload = function (e) {
      __reloadCropperImage(e.target.result, imageID);
    };
    reader.readAsDataURL(this.files[0]);
  });
};

function loadImageFromServer() {
  __reloadCropperImage("/sheet_without_staves.png", "image");
}

exports.initialiseCanvasPreview = initialiseCanvasPreview;
exports.loadImageFromServer = loadImageFromServer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _preview = __webpack_require__(1);

var _canvasCropper = __webpack_require__(0);

$(document).ready(function () {
  (0, _preview.initialiseCanvasPreview)("musicSheet", "image");
  (0, _canvasCropper.initialiseCropper)("image");

  $("#form").on("submit", function (e) {
    e.preventDefault();
    $(this).ajaxSubmit({
      success: function success(res) {
        console.log("?!?!?!");
        console.log(res);
        (0, _preview.loadImageFromServer)();
      },
      error: function error(err) {
        console.log(err);
      }
    });
    console.log(":D");
  });
});

/***/ })
/******/ ]);