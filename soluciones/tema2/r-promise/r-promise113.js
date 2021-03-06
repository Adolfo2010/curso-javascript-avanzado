"use strict";

var Prom = window.Prom = function() {
  var self = {},
      state, 
      args,
      onSuc = [],
      onErr = [];

  self.then = function(onSuccess, onError) {
     // Ya no hay que ejecutar el onSuccess, sino, un decorador que se encargue de resolver la siguiente promesa
    var nextPromise = new Prom(),
        onResolve = function() {
          if (typeof onSuccess == "function") {
            var result = onSuccess.apply({}, arguments);
            nextPromise.resolve(result);
          }
        },
        onReject = function() {
          if (typeof onError == "function") {
            var result = onError.apply({}, arguments);
            nextPromise.resolve(result);
          } else {
            // Ojo: No se puede poner nextPromise.reject(arguments) porque sino se recibiria un unico argumento que seria un pseudoarray. Para eso sirve apply
            nextPromise.reject.apply(nextPromise, arguments);
          }
        };
    if (state === undefined) {
      onSuc.push(onResolve);
      onErr.push(onReject);
    } else if (state) {
      onResolve.apply({}, args); 
    } else {
      onReject.apply({}, args);
    }
    return nextPromise;
  }
  self.resolve = function() {
    if (state !== undefined) {return;}
    args = arguments;
    state = true;
    onSuc.forEach(function(fn) {
      fn.apply({}, args);  
    });
  }

  self.reject = function() {
    if (state !== undefined) {return;}
    args = arguments;
    state = false;
    onErr.forEach(function(fn) {
      fn.apply({}, args);
    });
  }

  return self;
}
