let buildArgsList;

// `modulePromise` is a promise to the `WebAssembly.module` object to be
//   instantiated.
// `importObjectPromise` is a promise to an object that contains any additional
//   imports needed by the module that aren't provided by the standard runtime.
//   The fields on this object will be merged into the importObject with which
//   the module will be instantiated.
// This function returns a promise to the instantiated module.
export const instantiate = async (modulePromise, importObjectPromise) => {
    let dartInstance;

    function stringFromDartString(string) {
        const totalLength = dartInstance.exports.$stringLength(string);
        let result = '';
        let index = 0;
        while (index < totalLength) {
          let chunkLength = Math.min(totalLength - index, 0xFFFF);
          const array = new Array(chunkLength);
          for (let i = 0; i < chunkLength; i++) {
              array[i] = dartInstance.exports.$stringRead(string, index++);
          }
          result += String.fromCharCode(...array);
        }
        return result;
    }

    function stringToDartString(string) {
        const length = string.length;
        let range = 0;
        for (let i = 0; i < length; i++) {
            range |= string.codePointAt(i);
        }
        if (range < 256) {
            const dartString = dartInstance.exports.$stringAllocate1(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite1(dartString, i, string.codePointAt(i));
            }
            return dartString;
        } else {
            const dartString = dartInstance.exports.$stringAllocate2(length);
            for (let i = 0; i < length; i++) {
                dartInstance.exports.$stringWrite2(dartString, i, string.charCodeAt(i));
            }
            return dartString;
        }
    }

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
        const length = dartInstance.exports.$listLength(list);
        const array = new constructor(length);
        for (let i = 0; i < length; i++) {
            array[i] = dartInstance.exports.$listRead(list, i);
        }
        return array;
    }

    buildArgsList = function(list) {
        const dartList = dartInstance.exports.$makeStringList();
        for (let i = 0; i < list.length; i++) {
            dartInstance.exports.$listAdd(dartList, stringToDartString(list[i]));
        }
        return dartList;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
        wrapped.dartFunction = dartFunction;
        wrapped[jsWrappedDartFunctionSymbol] = true;
        return wrapped;
    }

    // Imports
    const dart2wasm = {

_1: (x0,x1,x2) => x0.set(x1,x2),
_2: (x0,x1,x2) => x0.set(x1,x2),
_6: f => finalizeWrapper(f,x0 => dartInstance.exports._6(f,x0)),
_7: x0 => new window.FinalizationRegistry(x0),
_8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
_9: (x0,x1) => x0.unregister(x1),
_10: (x0,x1,x2) => x0.slice(x1,x2),
_11: (x0,x1) => x0.decode(x1),
_12: (x0,x1) => x0.segment(x1),
_13: () => new TextDecoder(),
_14: x0 => x0.buffer,
_15: x0 => x0.wasmMemory,
_16: () => globalThis.window._flutter_skwasmInstance,
_17: x0 => x0.rasterStartMilliseconds,
_18: x0 => x0.rasterEndMilliseconds,
_19: x0 => x0.imageBitmaps,
_166: x0 => x0.focus(),
_167: x0 => x0.select(),
_168: (x0,x1) => x0.append(x1),
_169: x0 => x0.remove(),
_172: x0 => x0.unlock(),
_177: x0 => x0.getReader(),
_187: x0 => new MutationObserver(x0),
_206: (x0,x1,x2) => x0.addEventListener(x1,x2),
_207: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_210: x0 => new ResizeObserver(x0),
_213: (x0,x1) => new Intl.Segmenter(x0,x1),
_214: x0 => x0.next(),
_215: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
_292: x0 => x0.close(),
_293: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
_294: x0 => new window.ImageDecoder(x0),
_295: x0 => x0.close(),
_296: x0 => ({frameIndex: x0}),
_297: (x0,x1) => x0.decode(x1),
_300: f => finalizeWrapper(f,x0 => dartInstance.exports._300(f,x0)),
_301: f => finalizeWrapper(f,x0 => dartInstance.exports._301(f,x0)),
_302: (x0,x1) => ({addView: x0,removeView: x1}),
_303: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._303(f,arguments.length,x0) }),
_304: f => finalizeWrapper(f,() => dartInstance.exports._304(f)),
_305: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
_306: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._306(f,arguments.length,x0) }),
_307: x0 => ({runApp: x0}),
_308: x0 => new Uint8Array(x0),
_310: x0 => x0.preventDefault(),
_311: x0 => x0.stopPropagation(),
_312: (x0,x1) => x0.addListener(x1),
_313: (x0,x1) => x0.removeListener(x1),
_314: (x0,x1) => x0.prepend(x1),
_315: x0 => x0.remove(),
_316: x0 => x0.disconnect(),
_317: (x0,x1) => x0.addListener(x1),
_318: (x0,x1) => x0.removeListener(x1),
_321: (x0,x1) => x0.append(x1),
_322: x0 => x0.remove(),
_323: x0 => x0.stopPropagation(),
_327: x0 => x0.preventDefault(),
_328: (x0,x1) => x0.append(x1),
_329: x0 => x0.remove(),
_334: (x0,x1) => x0.appendChild(x1),
_335: (x0,x1,x2) => x0.insertBefore(x1,x2),
_336: (x0,x1) => x0.removeChild(x1),
_337: (x0,x1) => x0.appendChild(x1),
_338: (x0,x1) => x0.transferFromImageBitmap(x1),
_339: (x0,x1) => x0.append(x1),
_340: (x0,x1) => x0.append(x1),
_341: (x0,x1) => x0.append(x1),
_342: x0 => x0.remove(),
_343: x0 => x0.focus(),
_344: x0 => x0.focus(),
_345: x0 => x0.remove(),
_346: x0 => x0.focus(),
_347: x0 => x0.remove(),
_348: x0 => x0.focus(),
_349: (x0,x1) => x0.appendChild(x1),
_350: (x0,x1) => x0.appendChild(x1),
_351: x0 => x0.remove(),
_352: (x0,x1) => x0.append(x1),
_353: (x0,x1) => x0.append(x1),
_354: x0 => x0.remove(),
_355: (x0,x1) => x0.append(x1),
_356: (x0,x1) => x0.append(x1),
_357: (x0,x1,x2) => x0.insertBefore(x1,x2),
_358: (x0,x1) => x0.append(x1),
_359: (x0,x1,x2) => x0.insertBefore(x1,x2),
_360: x0 => x0.remove(),
_361: x0 => x0.remove(),
_362: (x0,x1) => x0.append(x1),
_363: x0 => x0.remove(),
_364: (x0,x1) => x0.append(x1),
_365: x0 => x0.remove(),
_366: x0 => x0.remove(),
_367: x0 => x0.getBoundingClientRect(),
_368: x0 => x0.remove(),
_369: x0 => x0.blur(),
_371: x0 => x0.focus(),
_372: x0 => x0.focus(),
_373: x0 => x0.remove(),
_374: x0 => x0.focus(),
_375: x0 => x0.focus(),
_376: x0 => x0.blur(),
_377: x0 => x0.remove(),
_390: (x0,x1) => x0.append(x1),
_391: x0 => x0.remove(),
_392: (x0,x1) => x0.append(x1),
_393: (x0,x1,x2) => x0.insertBefore(x1,x2),
_394: x0 => x0.focus(),
_395: x0 => x0.focus(),
_396: x0 => x0.focus(),
_397: x0 => x0.focus(),
_398: x0 => x0.focus(),
_399: x0 => x0.focus(),
_400: x0 => x0.blur(),
_401: x0 => x0.remove(),
_403: x0 => x0.preventDefault(),
_404: x0 => x0.focus(),
_405: x0 => x0.preventDefault(),
_406: x0 => x0.preventDefault(),
_407: x0 => x0.preventDefault(),
_408: x0 => x0.focus(),
_409: x0 => x0.focus(),
_410: x0 => x0.focus(),
_411: x0 => x0.focus(),
_412: x0 => x0.focus(),
_413: x0 => x0.focus(),
_414: (x0,x1) => x0.observe(x1),
_415: x0 => x0.disconnect(),
_416: (x0,x1) => x0.appendChild(x1),
_417: (x0,x1) => x0.appendChild(x1),
_418: (x0,x1) => x0.appendChild(x1),
_419: (x0,x1) => x0.append(x1),
_420: x0 => x0.remove(),
_421: (x0,x1) => x0.append(x1),
_423: (x0,x1) => x0.appendChild(x1),
_424: (x0,x1) => x0.append(x1),
_425: x0 => x0.remove(),
_426: (x0,x1) => x0.append(x1),
_430: (x0,x1) => x0.appendChild(x1),
_431: x0 => x0.remove(),
_990: () => globalThis.window.flutterConfiguration,
_991: x0 => x0.assetBase,
_996: x0 => x0.debugShowSemanticsNodes,
_997: x0 => x0.hostElement,
_998: x0 => x0.multiViewEnabled,
_999: x0 => x0.nonce,
_1001: x0 => x0.fontFallbackBaseUrl,
_1002: x0 => x0.useColorEmoji,
_1006: x0 => x0.console,
_1007: x0 => x0.devicePixelRatio,
_1008: x0 => x0.document,
_1009: x0 => x0.history,
_1010: x0 => x0.innerHeight,
_1011: x0 => x0.innerWidth,
_1012: x0 => x0.location,
_1013: x0 => x0.navigator,
_1014: x0 => x0.visualViewport,
_1015: x0 => x0.performance,
_1016: (x0,x1) => x0.fetch(x1),
_1019: (x0,x1) => x0.dispatchEvent(x1),
_1020: (x0,x1) => x0.matchMedia(x1),
_1021: (x0,x1) => x0.getComputedStyle(x1),
_1023: x0 => x0.screen,
_1024: (x0,x1) => x0.requestAnimationFrame(x1),
_1025: f => finalizeWrapper(f,x0 => dartInstance.exports._1025(f,x0)),
_1029: (x0,x1) => x0.warn(x1),
_1033: () => globalThis.window,
_1034: () => globalThis.Intl,
_1035: () => globalThis.Symbol,
_1038: x0 => x0.clipboard,
_1039: x0 => x0.maxTouchPoints,
_1040: x0 => x0.vendor,
_1041: x0 => x0.language,
_1042: x0 => x0.platform,
_1043: x0 => x0.userAgent,
_1044: x0 => x0.languages,
_1045: x0 => x0.documentElement,
_1047: (x0,x1) => x0.querySelector(x1),
_1049: (x0,x1) => x0.createElement(x1),
_1052: (x0,x1) => x0.execCommand(x1),
_1055: (x0,x1) => x0.createTextNode(x1),
_1056: (x0,x1) => x0.createEvent(x1),
_1061: x0 => x0.head,
_1062: x0 => x0.body,
_1063: (x0,x1) => x0.title = x1,
_1067: x0 => x0.activeElement,
_1069: x0 => x0.visibilityState,
_1070: () => globalThis.document,
_1071: (x0,x1,x2) => x0.addEventListener(x1,x2),
_1072: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1073: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1074: (x0,x1,x2) => x0.removeEventListener(x1,x2),
_1077: f => finalizeWrapper(f,x0 => dartInstance.exports._1077(f,x0)),
_1078: x0 => x0.target,
_1080: x0 => x0.timeStamp,
_1081: x0 => x0.type,
_1082: x0 => x0.preventDefault(),
_1087: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
_1092: x0 => x0.firstChild,
_1097: x0 => x0.parentElement,
_1099: x0 => x0.parentNode,
_1102: (x0,x1) => x0.removeChild(x1),
_1103: (x0,x1) => x0.removeChild(x1),
_1104: x0 => x0.isConnected,
_1105: (x0,x1) => x0.textContent = x1,
_1107: (x0,x1) => x0.contains(x1),
_1112: x0 => x0.firstElementChild,
_1114: x0 => x0.nextElementSibling,
_1115: x0 => x0.clientHeight,
_1116: x0 => x0.clientWidth,
_1117: x0 => x0.offsetHeight,
_1118: x0 => x0.offsetWidth,
_1119: x0 => x0.id,
_1120: (x0,x1) => x0.id = x1,
_1123: (x0,x1) => x0.spellcheck = x1,
_1124: x0 => x0.tagName,
_1125: x0 => x0.style,
_1126: (x0,x1) => x0.append(x1),
_1127: (x0,x1) => x0.getAttribute(x1),
_1128: x0 => x0.getBoundingClientRect(),
_1131: (x0,x1) => x0.closest(x1),
_1133: (x0,x1) => x0.querySelectorAll(x1),
_1134: x0 => x0.remove(),
_1136: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1138: (x0,x1) => x0.removeAttribute(x1),
_1139: (x0,x1) => x0.tabIndex = x1,
_1143: x0 => x0.scrollTop,
_1144: (x0,x1) => x0.scrollTop = x1,
_1145: x0 => x0.scrollLeft,
_1146: (x0,x1) => x0.scrollLeft = x1,
_1147: x0 => x0.classList,
_1148: (x0,x1) => x0.className = x1,
_1152: (x0,x1) => x0.getElementsByClassName(x1),
_1153: x0 => x0.click(),
_1155: (x0,x1) => x0.hasAttribute(x1),
_1158: (x0,x1) => x0.attachShadow(x1),
_1161: (x0,x1) => x0.getPropertyValue(x1),
_1163: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
_1165: (x0,x1) => x0.removeProperty(x1),
_1167: x0 => x0.offsetLeft,
_1168: x0 => x0.offsetTop,
_1169: x0 => x0.offsetParent,
_1171: (x0,x1) => x0.name = x1,
_1172: x0 => x0.content,
_1173: (x0,x1) => x0.content = x1,
_1186: (x0,x1) => x0.nonce = x1,
_1191: x0 => x0.now(),
_1193: (x0,x1) => x0.width = x1,
_1195: (x0,x1) => x0.height = x1,
_1199: (x0,x1) => x0.getContext(x1),
_1276: x0 => x0.status,
_1278: x0 => x0.body,
_1280: x0 => x0.arrayBuffer(),
_1285: x0 => x0.read(),
_1286: x0 => x0.value,
_1287: x0 => x0.done,
_1289: x0 => x0.name,
_1290: x0 => x0.x,
_1291: x0 => x0.y,
_1294: x0 => x0.top,
_1295: x0 => x0.right,
_1296: x0 => x0.bottom,
_1297: x0 => x0.left,
_1306: x0 => x0.height,
_1307: x0 => x0.width,
_1308: (x0,x1) => x0.value = x1,
_1310: (x0,x1) => x0.placeholder = x1,
_1311: (x0,x1) => x0.name = x1,
_1312: x0 => x0.selectionDirection,
_1313: x0 => x0.selectionStart,
_1314: x0 => x0.selectionEnd,
_1317: x0 => x0.value,
_1319: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1324: x0 => x0.readText(),
_1325: (x0,x1) => x0.writeText(x1),
_1326: x0 => x0.altKey,
_1327: x0 => x0.code,
_1328: x0 => x0.ctrlKey,
_1329: x0 => x0.key,
_1330: x0 => x0.keyCode,
_1331: x0 => x0.location,
_1332: x0 => x0.metaKey,
_1333: x0 => x0.repeat,
_1334: x0 => x0.shiftKey,
_1335: x0 => x0.isComposing,
_1336: (x0,x1) => x0.getModifierState(x1),
_1337: x0 => x0.state,
_1341: (x0,x1) => x0.go(x1),
_1342: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
_1343: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
_1344: x0 => x0.pathname,
_1345: x0 => x0.search,
_1346: x0 => x0.hash,
_1349: x0 => x0.state,
_1354: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1354(f,x0,x1)),
_1356: (x0,x1,x2) => x0.observe(x1,x2),
_1359: x0 => x0.attributeName,
_1360: x0 => x0.type,
_1361: x0 => x0.matches,
_1364: x0 => x0.matches,
_1365: x0 => x0.relatedTarget,
_1366: x0 => x0.clientX,
_1367: x0 => x0.clientY,
_1368: x0 => x0.offsetX,
_1369: x0 => x0.offsetY,
_1372: x0 => x0.button,
_1373: x0 => x0.buttons,
_1374: x0 => x0.ctrlKey,
_1375: (x0,x1) => x0.getModifierState(x1),
_1376: x0 => x0.pointerId,
_1377: x0 => x0.pointerType,
_1378: x0 => x0.pressure,
_1379: x0 => x0.tiltX,
_1380: x0 => x0.tiltY,
_1381: x0 => x0.getCoalescedEvents(),
_1382: x0 => x0.deltaX,
_1383: x0 => x0.deltaY,
_1384: x0 => x0.wheelDeltaX,
_1385: x0 => x0.wheelDeltaY,
_1386: x0 => x0.deltaMode,
_1391: x0 => x0.changedTouches,
_1393: x0 => x0.clientX,
_1394: x0 => x0.clientY,
_1395: x0 => x0.data,
_1396: (x0,x1) => x0.type = x1,
_1397: (x0,x1) => x0.max = x1,
_1398: (x0,x1) => x0.min = x1,
_1399: (x0,x1) => x0.value = x1,
_1400: x0 => x0.value,
_1401: x0 => x0.disabled,
_1402: (x0,x1) => x0.disabled = x1,
_1403: (x0,x1) => x0.placeholder = x1,
_1404: (x0,x1) => x0.name = x1,
_1405: (x0,x1) => x0.autocomplete = x1,
_1406: x0 => x0.selectionDirection,
_1407: x0 => x0.selectionStart,
_1408: x0 => x0.selectionEnd,
_1411: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
_1417: (x0,x1) => x0.add(x1),
_1421: (x0,x1) => x0.noValidate = x1,
_1422: (x0,x1) => x0.method = x1,
_1423: (x0,x1) => x0.action = x1,
_1450: x0 => x0.orientation,
_1451: x0 => x0.width,
_1452: x0 => x0.height,
_1453: (x0,x1) => x0.lock(x1),
_1470: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1470(f,x0,x1)),
_1480: x0 => x0.length,
_1482: (x0,x1) => x0.item(x1),
_1483: x0 => x0.length,
_1484: (x0,x1) => x0.item(x1),
_1485: x0 => x0.iterator,
_1486: x0 => x0.Segmenter,
_1487: x0 => x0.v8BreakIterator,
_1490: x0 => x0.done,
_1491: x0 => x0.value,
_1492: x0 => x0.index,
_1496: (x0,x1) => x0.adoptText(x1),
_1497: x0 => x0.first(),
_1499: x0 => x0.next(),
_1500: x0 => x0.current(),
_1512: x0 => x0.hostElement,
_1513: x0 => x0.viewConstraints,
_1515: x0 => x0.maxHeight,
_1516: x0 => x0.maxWidth,
_1517: x0 => x0.minHeight,
_1518: x0 => x0.minWidth,
_1519: x0 => x0.loader,
_1520: () => globalThis._flutter,
_1521: (x0,x1) => x0.didCreateEngineInitializer(x1),
_1522: (x0,x1,x2) => x0.call(x1,x2),
_1523: () => globalThis.Promise,
_1524: f => finalizeWrapper(f,(x0,x1) => dartInstance.exports._1524(f,x0,x1)),
_1529: x0 => x0.length,
_1532: x0 => x0.tracks,
_1536: x0 => x0.image,
_1541: x0 => x0.codedWidth,
_1542: x0 => x0.codedHeight,
_1545: x0 => x0.duration,
_1548: x0 => x0.ready,
_1549: x0 => x0.selectedTrack,
_1550: x0 => x0.repetitionCount,
_1551: x0 => x0.frameCount,
_1612: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1613: (x0,x1) => x0.querySelector(x1),
_1614: (x0,x1) => x0.append(x1),
_1615: (x0,x1) => x0.querySelector(x1),
_1616: (x0,x1) => x0.querySelector(x1),
_1617: x0 => x0.remove(),
_1618: (x0,x1) => x0.append(x1),
_1619: (x0,x1) => x0.querySelector(x1),
_1620: (x0,x1) => x0.getAttribute(x1),
_1621: (x0,x1,x2) => x0.setAttribute(x1,x2),
_1632: x0 => new Array(x0),
_1666: (decoder, codeUnits) => decoder.decode(codeUnits),
_1667: () => new TextDecoder("utf-8", {fatal: true}),
_1668: () => new TextDecoder("utf-8", {fatal: false}),
_1669: v => stringToDartString(v.toString()),
_1670: (d, digits) => stringToDartString(d.toFixed(digits)),
_1674: x0 => new WeakRef(x0),
_1675: x0 => x0.deref(),
_1681: Date.now,
_1683: s => new Date(s * 1000).getTimezoneOffset() * 60 ,
_1684: s => {
      const jsSource = stringFromDartString(s);
      if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(jsSource)) {
        return NaN;
      }
      return parseFloat(jsSource);
    },
_1685: () => {
          let stackString = new Error().stack.toString();
          let frames = stackString.split('\n');
          let drop = 2;
          if (frames[0] === 'Error') {
              drop += 1;
          }
          return frames.slice(drop).join('\n');
        },
_1686: () => typeof dartUseDateNowForTicks !== "undefined",
_1687: () => 1000 * performance.now(),
_1688: () => Date.now(),
_1689: () => {
      // On browsers return `globalThis.location.href`
      if (globalThis.location != null) {
        return stringToDartString(globalThis.location.href);
      }
      return null;
    },
_1690: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
_1691: () => new WeakMap(),
_1692: (map, o) => map.get(o),
_1693: (map, o, v) => map.set(o, v),
_1694: () => globalThis.WeakRef,
_1704: s => stringToDartString(JSON.stringify(stringFromDartString(s))),
_1705: s => printToConsole(stringFromDartString(s)),
_1714: (o, t) => o instanceof t,
_1716: f => finalizeWrapper(f,x0 => dartInstance.exports._1716(f,x0)),
_1717: f => finalizeWrapper(f,x0 => dartInstance.exports._1717(f,x0)),
_1718: o => Object.keys(o),
_1719: (ms, c) =>
              setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
_1720: (handle) => clearTimeout(handle),
_1721: (ms, c) =>
          setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
_1722: (handle) => clearInterval(handle),
_1723: (c) =>
              queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
_1724: () => Date.now(),
_1725: () => new XMLHttpRequest(),
_1726: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
_1727: (x0,x1,x2) => x0.setRequestHeader(x1,x2),
_1728: (x0,x1) => x0.send(x1),
_1729: x0 => x0.abort(),
_1730: x0 => x0.getAllResponseHeaders(),
_1735: (x0,x1) => x0.createElement(x1),
_1739: f => finalizeWrapper(f,x0 => dartInstance.exports._1739(f,x0)),
_1740: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
_1741: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
_1759: (a, i) => a.push(i),
_1762: (a, l) => a.length = l,
_1763: a => a.pop(),
_1764: (a, i) => a.splice(i, 1),
_1766: (a, s) => a.join(s),
_1767: (a, s, e) => a.slice(s, e),
_1769: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
_1770: a => a.length,
_1771: (a, l) => a.length = l,
_1772: (a, i) => a[i],
_1773: (a, i, v) => a[i] = v,
_1775: a => a.join(''),
_1776: (o, a, b) => o.replace(a, b),
_1778: (s, t) => s.split(t),
_1779: s => s.toLowerCase(),
_1780: s => s.toUpperCase(),
_1781: s => s.trim(),
_1782: s => s.trimLeft(),
_1783: s => s.trimRight(),
_1785: (s, p, i) => s.indexOf(p, i),
_1786: (s, p, i) => s.lastIndexOf(p, i),
_1787: (o, offsetInBytes, lengthInBytes) => {
      var dst = new ArrayBuffer(lengthInBytes);
      new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
      return new DataView(dst);
    },
_1788: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
_1789: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
_1790: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
_1791: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
_1792: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
_1793: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
_1794: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
_1796: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
_1797: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
_1798: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
_1799: (s) => s.replace(/\$/g, "$$$$"),
_1800: Object.is,
_1801: (t, s) => t.set(s),
_1803: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
_1805: o => o.buffer,
_1806: o => o.byteOffset,
_1807: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
_1808: (b, o) => new DataView(b, o),
_1809: (b, o, l) => new DataView(b, o, l),
_1810: Function.prototype.call.bind(DataView.prototype.getUint8),
_1811: Function.prototype.call.bind(DataView.prototype.setUint8),
_1812: Function.prototype.call.bind(DataView.prototype.getInt8),
_1813: Function.prototype.call.bind(DataView.prototype.setInt8),
_1814: Function.prototype.call.bind(DataView.prototype.getUint16),
_1815: Function.prototype.call.bind(DataView.prototype.setUint16),
_1816: Function.prototype.call.bind(DataView.prototype.getInt16),
_1817: Function.prototype.call.bind(DataView.prototype.setInt16),
_1818: Function.prototype.call.bind(DataView.prototype.getUint32),
_1819: Function.prototype.call.bind(DataView.prototype.setUint32),
_1820: Function.prototype.call.bind(DataView.prototype.getInt32),
_1821: Function.prototype.call.bind(DataView.prototype.setInt32),
_1824: Function.prototype.call.bind(DataView.prototype.getBigInt64),
_1825: Function.prototype.call.bind(DataView.prototype.setBigInt64),
_1826: Function.prototype.call.bind(DataView.prototype.getFloat32),
_1827: Function.prototype.call.bind(DataView.prototype.setFloat32),
_1828: Function.prototype.call.bind(DataView.prototype.getFloat64),
_1829: Function.prototype.call.bind(DataView.prototype.setFloat64),
_1835: s => stringToDartString(stringFromDartString(s).toUpperCase()),
_1836: s => stringToDartString(stringFromDartString(s).toLowerCase()),
_1838: (s, m) => {
          try {
            return new RegExp(s, m);
          } catch (e) {
            return String(e);
          }
        },
_1839: (x0,x1) => x0.exec(x1),
_1840: (x0,x1) => x0.test(x1),
_1841: (x0,x1) => x0.exec(x1),
_1842: (x0,x1) => x0.exec(x1),
_1843: x0 => x0.pop(),
_1847: (x0,x1,x2) => x0[x1] = x2,
_1849: o => o === undefined,
_1850: o => typeof o === 'boolean',
_1851: o => typeof o === 'number',
_1853: o => typeof o === 'string',
_1856: o => o instanceof Int8Array,
_1857: o => o instanceof Uint8Array,
_1858: o => o instanceof Uint8ClampedArray,
_1859: o => o instanceof Int16Array,
_1860: o => o instanceof Uint16Array,
_1861: o => o instanceof Int32Array,
_1862: o => o instanceof Uint32Array,
_1863: o => o instanceof Float32Array,
_1864: o => o instanceof Float64Array,
_1865: o => o instanceof ArrayBuffer,
_1866: o => o instanceof DataView,
_1867: o => o instanceof Array,
_1868: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
_1870: o => {
            const proto = Object.getPrototypeOf(o);
            return proto === Object.prototype || proto === null;
          },
_1871: o => o instanceof RegExp,
_1872: (l, r) => l === r,
_1873: o => o,
_1874: o => o,
_1875: o => o,
_1876: b => !!b,
_1877: o => o.length,
_1880: (o, i) => o[i],
_1881: f => f.dartFunction,
_1882: l => arrayFromDartList(Int8Array, l),
_1883: l => arrayFromDartList(Uint8Array, l),
_1884: l => arrayFromDartList(Uint8ClampedArray, l),
_1885: l => arrayFromDartList(Int16Array, l),
_1886: l => arrayFromDartList(Uint16Array, l),
_1887: l => arrayFromDartList(Int32Array, l),
_1888: l => arrayFromDartList(Uint32Array, l),
_1889: l => arrayFromDartList(Float32Array, l),
_1890: l => arrayFromDartList(Float64Array, l),
_1891: (data, length) => {
          const view = new DataView(new ArrayBuffer(length));
          for (let i = 0; i < length; i++) {
              view.setUint8(i, dartInstance.exports.$byteDataGetUint8(data, i));
          }
          return view;
        },
_1892: l => arrayFromDartList(Array, l),
_1893: stringFromDartString,
_1894: stringToDartString,
_1895: () => ({}),
_1896: () => [],
_1897: l => new Array(l),
_1898: () => globalThis,
_1899: (constructor, args) => {
      const factoryFunction = constructor.bind.apply(
          constructor, [null, ...args]);
      return new factoryFunction();
    },
_1900: (o, p) => p in o,
_1901: (o, p) => o[p],
_1902: (o, p, v) => o[p] = v,
_1903: (o, m, a) => o[m].apply(o, a),
_1905: o => String(o),
_1906: (p, s, f) => p.then(s, f),
_1907: s => {
      let jsString = stringFromDartString(s);
      if (/[[\]{}()*+?.\\^$|]/.test(jsString)) {
          jsString = jsString.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
      }
      return stringToDartString(jsString);
    },
_1910: x0 => x0.index,
_1912: x0 => x0.length,
_1914: (x0,x1) => x0[x1],
_1916: (x0,x1) => x0.exec(x1),
_1918: x0 => x0.flags,
_1919: x0 => x0.multiline,
_1920: x0 => x0.ignoreCase,
_1921: x0 => x0.unicode,
_1922: x0 => x0.dotAll,
_1923: (x0,x1) => x0.lastIndex = x1,
_2008: (x0,x1) => x0.withCredentials = x1,
_2011: x0 => x0.responseURL,
_2012: x0 => x0.status,
_2013: x0 => x0.statusText,
_2014: (x0,x1) => x0.responseType = x1,
_2016: x0 => x0.response,
_2317: (x0,x1) => x0.href = x1,
_3352: (x0,x1) => x0.src = x1,
_3358: (x0,x1) => x0.async = x1,
_8749: () => globalThis.document,
_8839: x0 => x0.body,
_9205: (x0,x1) => x0.id = x1,
_9214: (x0,x1) => x0.innerHTML = x1
    };

    const baseImports = {
        dart2wasm: dart2wasm,


        Math: Math,
        Date: Date,
        Object: Object,
        Array: Array,
        Reflect: Reflect,
    };

    const jsStringPolyfill = {
        "charCodeAt": (s, i) => s.charCodeAt(i),
        "compare": (s1, s2) => {
            if (s1 < s2) return -1;
            if (s1 > s2) return 1;
            return 0;
        },
        "concat": (s1, s2) => s1 + s2,
        "equals": (s1, s2) => s1 === s2,
        "fromCharCode": (i) => String.fromCharCode(i),
        "length": (s) => s.length,
        "substring": (s, a, b) => s.substring(a, b),
    };

    dartInstance = await WebAssembly.instantiate(await modulePromise, {
        ...baseImports,
        ...(await importObjectPromise),
        "wasm:js-string": jsStringPolyfill,
    });

    return dartInstance;
}

// Call the main function for the instantiated module
// `moduleInstance` is the instantiated dart2wasm module
// `args` are any arguments that should be passed into the main function.
export const invoke = (moduleInstance, ...args) => {
    const dartMain = moduleInstance.exports.$getMain();
    const dartArgs = buildArgsList(args);
    moduleInstance.exports.$invokeMain(dartMain, dartArgs);
}

