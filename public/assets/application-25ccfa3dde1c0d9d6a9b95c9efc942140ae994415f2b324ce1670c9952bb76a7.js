/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=81)}([function(e,t,n){"use strict";e.exports=n(82)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(205);n.d(t,"BrowserRouter",function(){return r.a});var o=n(207);n.d(t,"HashRouter",function(){return o.a});var a=n(75);n.d(t,"Link",function(){return a.a});var i=n(209);n.d(t,"MemoryRouter",function(){return i.a});var u=n(212);n.d(t,"NavLink",function(){return u.a});var l=n(215);n.d(t,"Prompt",function(){return l.a});var s=n(217);n.d(t,"Redirect",function(){return s.a});var c=n(76);n.d(t,"Route",function(){return c.a});var f=n(39);n.d(t,"Router",function(){return f.a});var p=n(223);n.d(t,"StaticRouter",function(){return p.a});var d=n(225);n.d(t,"Switch",function(){return d.a});var h=n(227);n.d(t,"matchPath",function(){return h.a});var m=n(228);n.d(t,"withRouter",function(){return m.a})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(193),o=n(68),a=n(198);n.d(t,"Provider",function(){return r.b}),n.d(t,"createProvider",function(){return r.a}),n.d(t,"connectAdvanced",function(){return o.a}),n.d(t,"connect",function(){return a.a})},function(e,t,n){"use strict";var r=function(){};e.exports=r},function(e,t,n){e.exports=n(194)()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.removePhoto=t.receivePhoto=t.receivePhotos=t.deletePhoto=t.updatePhoto=t.createPhoto=t.fetchPhoto=t.fetchPhotos=t.searchTaggedPhotos=t.RECEIVE_SEARCH_PHOTOS=t.RECEIVE_PHOTO_ERRORS=t.REMOVE_PHOTO=t.RECEIVE_PHOTO=t.RECEIVE_PHOTOS=void 0;var r=n(115),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_PHOTOS="RECEIVE_PHOTOS",i=t.RECEIVE_PHOTO="RECEIVE_PHOTO",u=t.REMOVE_PHOTO="REMOVE_PHOTO",l=t.RECEIVE_PHOTO_ERRORS="RECEIVE_PHOTO_ERRORS",s=t.RECEIVE_SEARCH_PHOTOS="RECEIVE_SEARCH_PHOTOS",c=(t.searchTaggedPhotos=function(e){return function(t){return o.searchTaggedPhotos(e).then(function(e){return t(c(e))})}},t.fetchPhotos=function(){return function(e){return o.fetchPhotos().then(function(t){return e(f(t))})}},t.fetchPhoto=function(e){return function(t){return o.fetchPhoto(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.createPhoto=function(e){return function(t){return o.createPhoto(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.updatePhoto=function(e){return function(t){return o.updatePhoto(e).then(function(e){return t(p(e))},function(e){return t(h(e.responseJSON))})}},t.deletePhoto=function(e){return function(t){return o.deletePhoto(e).then(function(n){return t(d(e))})}},function(e){return{type:s,photos:e}}),f=t.receivePhotos=function(e){return{type:a,photos:e}},p=t.receivePhoto=function(e){return{type:i,photo:e}},d=t.removePhoto=function(e){return{type:u,photoId:e}},h=t.receiveErrors=function(e){return{type:l,errors:e}}},function(e,t,n){"use strict";var r=function(e,t,n,r,o,a,i,u){if(!e){var l;if(void 0===t)l=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var s=[n,r,o,a,i,u],c=0;l=new Error(t.replace(/%s/g,function(){return s[c++]})),l.name="Invariant Violation"}throw l.framesToPop=1,l}};e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.receiveUser=t.receiveAllUsers=t.fetchUser=t.fetchAllUsers=t.RECEIVE_USER_ERRORS=t.RECEIVE_USER=t.RECEIVE_ALL_USERS=void 0;var r=n(113),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_ALL_USERS="RECEIVE_ALL_USERS",i=t.RECEIVE_USER="RECEIVE_USER",u=t.RECEIVE_USER_ERRORS="RECEIVE_USER_ERRORS",l=(t.fetchAllUsers=function(){return function(e){return o.fetchAllUsers().then(function(t){return e(l(t))})}},t.fetchUser=function(e){return function(t){return o.fetchUser(e).then(function(e){return t(s(e))},function(e){return t(c(e.responseJSON))})}},t.receiveAllUsers=function(e){return{type:a,users:e}}),s=t.receiveUser=function(e){return{type:i,user:e}},c=t.receiveErrors=function(e){return{type:u,errors:e}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.removeAlbum=t.receiveCreatedAlbum=t.receiveAlbum=t.receiveAlbums=t.deleteAlbum=t.updateAlbum=t.createAlbum=t.fetchAlbum=t.fetchAlbums=t.RECEIVE_ALBUM_ERRORS=t.REMOVE_ALBUM=t.RECEIVE_CREATED_ALBUM=t.RECEIVE_ALBUM=t.RECEIVE_ALBUMS=void 0;var r=n(117),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_ALBUMS="RECEIVE_ALBUMS",i=t.RECEIVE_ALBUM="RECEIVE_ALBUM",u=t.RECEIVE_CREATED_ALBUM="RECEIVE_CREATED_ALBUM",l=t.REMOVE_ALBUM="REMOVE_ALBUM",s=t.RECEIVE_ALBUM_ERRORS="RECEIVE_ALBUM_ERRORS",c=(t.fetchAlbums=function(){return function(e){return o.fetchAlbums().then(function(t){return e(c(t))})}},t.fetchAlbum=function(e){return function(t){return o.fetchAlbum(e).then(function(e){return t(f(e))},function(e){return t(d(e.responseJSON))})}},t.createAlbum=function(e){return function(t){return o.createAlbum(e).then(function(e){return t(f(e))},function(e){return t(d(e.responseJSON))})}},t.updateAlbum=function(e){return function(t){return o.updateAlbum(e).then(function(e){return t(f(e))},function(e){return t(d(e.responseJSON))})}},t.deleteAlbum=function(e){return function(t){return o.deleteAlbum(e).then(function(n){return t(p(e))})}},t.receiveAlbums=function(e){return{type:a,albums:e}}),f=t.receiveAlbum=function(e){return{type:i,album:e}},p=(t.receiveCreatedAlbum=function(e){return{type:u,albumId:e}},t.removeAlbum=function(e){return{type:l,albumId:e}}),d=t.receiveErrors=function(e){return{type:s,errors:e}}},function(e,t,n){var r=n(123),o=n(177),a=o(function(e,t,n){r(e,t,n)});e.exports=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.receiveCurrentUser=t.logout=t.login=t.signup=t.RECEIVE_SESSION_ERRORS=t.RECEIVE_CURRENT_USER=void 0;var r=n(111),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_CURRENT_USER="RECEIVE_CURRENT_USER",i=t.RECEIVE_SESSION_ERRORS="RECEIVE_SESSION_ERRORS",u=(t.signup=function(e){return function(t){return o.signup(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},t.login=function(e){return function(t){return o.login(e).then(function(e){return t(u(e))},function(e){return t(l(e.responseJSON))})}},t.logout=function(){return function(e){return o.logout().then(function(t){return e(u(null))})}},t.receiveCurrentUser=function(e){return{type:a,currentUser:e}}),l=t.receiveErrors=function(e){return{type:i,errors:e}}},function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){var r=n(52),o="object"==typeof self&&self&&self.Object===Object&&self,a=r||o||Function("return this")();e.exports=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.removeComment=t.receiveComment=t.receiveAllComments=t.deleteComment=t.updateComment=t.createComment=t.fetchComment=t.fetchAllComments=t.RECEIVE_COMMENT_ERRORS=t.REMOVE_COMMENT=t.RECEIVE_COMMENT=t.RECEIVE_ALL_COMMENTS=void 0;var r=n(119),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_ALL_COMMENTS="RECEIVE_ALL_COMMENTS",i=t.RECEIVE_COMMENT="RECEIVE_COMMENT",u=t.REMOVE_COMMENT="REMOVE_COMMENT",l=t.RECEIVE_COMMENT_ERRORS="RECEIVE_COMMENT_ERRORS",s=(t.fetchAllComments=function(e){return function(t){return o.fetchComments(e).then(function(e){return t(s(e))})}},t.fetchComment=function(e){return function(t){return o.fetchComment(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.createComment=function(e){return function(t){return o.createComment(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.updateComment=function(e,t){return function(n){return o.updateComment(e,t).then(function(e){return n(c(e))},function(e){return n(p(e.responseJSON))})}},t.deleteComment=function(e){return function(t){return o.deleteComment(e).then(function(n){return t(f(e))})}},t.receiveAllComments=function(e){return{type:a,comments:e}}),c=t.receiveComment=function(e){return{type:i,comment:e}},f=t.removeComment=function(e){return{type:u,commentId:e}},p=t.receiveErrors=function(e){return{type:l,errors:e}}},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){"use strict";t.__esModule=!0;var r=(t.addLeadingSlash=function(e){return"/"===e.charAt(0)?e:"/"+e},t.stripLeadingSlash=function(e){return"/"===e.charAt(0)?e.substr(1):e},t.hasBasename=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)});t.stripBasename=function(e,t){return r(e,t)?e.substr(t.length):e},t.stripTrailingSlash=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},t.parsePath=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},t.createPath=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t,n){"use strict";n.d(t,"a",function(){return r}),n.d(t,"f",function(){return o}),n.d(t,"c",function(){return a}),n.d(t,"e",function(){return i}),n.d(t,"g",function(){return u}),n.d(t,"d",function(){return l}),n.d(t,"b",function(){return s});var r=function(e){return"/"===e.charAt(0)?e:"/"+e},o=function(e){return"/"===e.charAt(0)?e.substr(1):e},a=function(e,t){return new RegExp("^"+t+"(\\/|\\?|#|$)","i").test(e)},i=function(e,t){return a(e,t)?e.substr(t.length):e},u=function(e){return"/"===e.charAt(e.length-1)?e.slice(0,-1):e},l=function(e){var t=e||"/",n="",r="",o=t.indexOf("#");-1!==o&&(r=t.substr(o),t=t.substr(0,o));var a=t.indexOf("?");return-1!==a&&(n=t.substr(a),t=t.substr(0,a)),{pathname:t,search:"?"===n?"":n,hash:"#"===r?"":r}},s=function(e){var t=e.pathname,n=e.search,r=e.hash,o=t||"/";return n&&"?"!==n&&(o+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(o+="#"===r.charAt(0)?r:"#"+r),o}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(46),o=n(103),a=n(104),i=n(105),u=n(49);n(48);n.d(t,"createStore",function(){return r.b}),n.d(t,"combineReducers",function(){return o.a}),n.d(t,"bindActionCreators",function(){return a.a}),n.d(t,"applyMiddleware",function(){return i.a}),n.d(t,"compose",function(){return u.a})},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.receiveErrors=t.removeTag=t.receiveTag=t.receiveAllTags=t.deleteTag=t.createTag=t.fetchTag=t.fetchAllTags=t.RECEIVE_TAG_ERRORS=t.REMOVE_TAG=t.RECEIVE_TAG=t.RECEIVE_ALL_TAGS=void 0;var r=n(121),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(r),a=t.RECEIVE_ALL_TAGS="RECEIVE_ALL_TAGS",i=t.RECEIVE_TAG="RECEIVE_TAG",u=t.REMOVE_TAG="REMOVE_TAG",l=t.RECEIVE_TAG_ERRORS="RECEIVE_TAG_ERRORS",s=(t.fetchAllTags=function(e){return function(t){return o.fetchTags(e).then(function(e){return t(s(e))})}},t.fetchTag=function(e){return function(t){return o.fetchTag(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.createTag=function(e){return function(t){return o.createTag(e).then(function(e){return t(c(e))},function(e){return t(p(e.responseJSON))})}},t.deleteTag=function(e,t){return function(n){return o.deleteTag(e,t).then(function(t){return n(f(e))})}},t.receiveAllTags=function(e){return{type:a,tags:e}}),c=t.receiveTag=function(e){return{type:i,tag:e}},f=t.removeTag=function(e){return{type:u,tagId:e}},p=t.receiveErrors=function(e){return{type:l,errors:e}}},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(125),a=n(126),i=n(127),u=n(128),l=n(129);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(22);e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){return null==e?void 0===e?l:u:s&&s in Object(e)?a(e):i(e)}var o=n(51),a=n(136),i=n(137),u="[object Null]",l="[object Undefined]",s=o?o.toStringTag:void 0;e.exports=r},function(e,t,n){var r=n(30),o=r(Object,"create");e.exports=o},function(e,t,n){function r(e,t){var n=e.__data__;return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(151);e.exports=r},function(e,t,n){function r(e){return null!=e&&a(e.length)&&!o(e)}var o=n(31),a=n(59);e.exports=r},function(e,t,n){"use strict";n.d(t,"a",function(){return u}),n.d(t,"b",function(){return l});var r=n(72),o=n(73),a=n(16),i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=function(e,t,n,o){var u=void 0;"string"==typeof e?(u=Object(a.d)(e),u.state=t):(u=i({},e),void 0===u.pathname&&(u.pathname=""),u.search?"?"!==u.search.charAt(0)&&(u.search="?"+u.search):u.search="",u.hash?"#"!==u.hash.charAt(0)&&(u.hash="#"+u.hash):u.hash="",void 0!==t&&void 0===u.state&&(u.state=t));try{u.pathname=decodeURI(u.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+u.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(u.key=n),o?u.pathname?"/"!==u.pathname.charAt(0)&&(u.pathname=Object(r.default)(u.pathname,o.pathname)):u.pathname=o.pathname:u.pathname||(u.pathname="/"),u},l=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&Object(o.default)(e.state,t.state)}},function(e,t,n){"use strict";function r(e){return function(){return e}}var o=function(){};o.thatReturns=r,o.thatReturnsFalse=r(!1),o.thatReturnsTrue=r(!0),o.thatReturnsNull=r(null),o.thatReturnsThis=function(){return this},o.thatReturnsArgument=function(e){return e},e.exports=o},function(e,t,n){"use strict";function r(e){if(!Object(i.a)(e)||Object(o.a)(e)!=u)return!1;var t=Object(a.a)(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(92),a=n(97),i=n(99),u="[object Object]",l=Function.prototype,s=Object.prototype,c=l.toString,f=s.hasOwnProperty,p=c.call(Object);t.a=r},function(e,t,n){function r(e,t){var n=a(e,t);return o(n)?n:void 0}var o=n(135),a=n(141);e.exports=r},function(e,t,n){function r(e){if(!a(e))return!1;var t=o(e);return t==u||t==l||t==i||t==s}var o=n(23),a=n(11),i="[object AsyncFunction]",u="[object Function]",l="[object GeneratorFunction]",s="[object Proxy]";e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(54);e.exports=r},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t){function n(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||r)}var r=Object.prototype;e.exports=n},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){"use strict";function r(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}t.a=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.locationsAreEqual=t.createLocation=void 0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(72),i=r(a),u=n(73),l=r(u),s=n(15);t.createLocation=function(e,t,n,r){var a=void 0;"string"==typeof e?(a=(0,s.parsePath)(e),a.state=t):(a=o({},e),void 0===a.pathname&&(a.pathname=""),a.search?"?"!==a.search.charAt(0)&&(a.search="?"+a.search):a.search="",a.hash?"#"!==a.hash.charAt(0)&&(a.hash="#"+a.hash):a.hash="",void 0!==t&&void 0===a.state&&(a.state=t));try{a.pathname=decodeURI(a.pathname)}catch(e){throw e instanceof URIError?new URIError('Pathname "'+a.pathname+'" could not be decoded. This is likely caused by an invalid percent-encoding.'):e}return n&&(a.key=n),r?a.pathname?"/"!==a.pathname.charAt(0)&&(a.pathname=(0,i.default)(a.pathname,r.pathname)):a.pathname=r.pathname:a.pathname||(a.pathname="/"),a},t.locationsAreEqual=function(e,t){return e.pathname===t.pathname&&e.search===t.search&&e.hash===t.hash&&e.key===t.key&&(0,l.default)(e.state,t.state)}},function(e,t,n){"use strict";t.__esModule=!0;var r=n(3),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=function(){var e=null,t=function(t){return(0,o.default)(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,a){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,a):((0,o.default)(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),a(!0)):a(!1!==i)}else a(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.default=a},function(e,t,n){"use strict";var r=n(40);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(3),u=n.n(i),l=n(6),s=n.n(l),c=n(0),f=n.n(c),p=n(4),d=n.n(p),h=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},m=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=a=o(this,e.call.apply(e,[this].concat(l))),a.state={match:a.computeMatch(a.props.history.location.pathname)},i=n,o(a,i)}return a(t,e),t.prototype.getChildContext=function(){return{router:h({},this.context.router,{history:this.props.history,route:{location:this.props.history.location,match:this.state.match}})}},t.prototype.computeMatch=function(e){return{path:"/",url:"/",params:{},isExact:"/"===e}},t.prototype.componentWillMount=function(){var e=this,t=this.props,n=t.children,r=t.history;s()(null==n||1===f.a.Children.count(n),"A <Router> may have only one child element"),this.unlisten=r.listen(function(){e.setState({match:e.computeMatch(r.location.pathname)})})},t.prototype.componentWillReceiveProps=function(e){u()(this.props.history===e.history,"You cannot change <Router history>")},t.prototype.componentWillUnmount=function(){this.unlisten()},t.prototype.render=function(){var e=this.props.children;return e?f.a.Children.only(e):null},t}(f.a.Component);m.propTypes={history:d.a.object.isRequired,children:d.a.node},m.contextTypes={router:d.a.object},m.childContextTypes={router:d.a.object.isRequired},t.a=m},function(e,t,n){"use strict";var r=n(213),o=n.n(r),a={},i=0,u=function(e,t){var n=""+t.end+t.strict+t.sensitive,r=a[n]||(a[n]={});if(r[e])return r[e];var u=[],l=o()(e,u,t),s={re:l,keys:u};return i<1e4&&(r[e]=s,i++),s},l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof t&&(t={path:t});var n=t,r=n.path,o=void 0===r?"/":r,a=n.exact,i=void 0!==a&&a,l=n.strict,s=void 0!==l&&l,c=n.sensitive,f=void 0!==c&&c,p=u(o,{end:i,strict:s,sensitive:f}),d=p.re,h=p.keys,m=d.exec(e);if(!m)return null;var v=m[0],y=m.slice(1),b=e===v;return i&&!b?null:{path:o,url:"/"===o&&""===v?"/":v,isExact:b,params:h.reduce(function(e,t,n){return e[t.name]=y[n],e},{})}};t.a=l},function(e,t,n){"use strict";var r=n(3),o=n.n(r),a=function(){var e=null,t=function(t){return o()(null==e,"A history supports only one prompt at a time"),e=t,function(){e===t&&(e=null)}},n=function(t,n,r,a){if(null!=e){var i="function"==typeof e?e(t,n):e;"string"==typeof i?"function"==typeof r?r(i,a):(o()(!1,"A history needs a getUserConfirmation function in order to use a prompt message"),a(!0)):a(!1!==i)}else a(!0)},r=[];return{setPrompt:t,confirmTransitionTo:n,appendListener:function(e){var t=!0,n=function(){t&&e.apply(void 0,arguments)};return r.push(n),function(){t=!1,r=r.filter(function(e){return e!==n})}},notifyListeners:function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];r.forEach(function(e){return e.apply(void 0,t)})}}};t.a=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(1),i=function(e){var t=e.photo.user_id,n=e.currentUser.id===t?"YOU!":e.users[t].first_name+" "+e.users[t].last_name;return o.default.createElement("li",{className:"photo-index-item-container"},o.default.createElement(a.Link,{className:"photo-index-item-hover",to:"/photos/"+e.photo.id},o.default.createElement("p",null,e.photo.title),o.default.createElement(a.Link,{to:"/users/"+t},"by ",n)),o.default.createElement("div",{className:"photo-index-item-image-container"},o.default.createElement(a.Link,{to:"/photos/"+e.photo.id},o.default.createElement("img",{className:"photo-index-item-image",src:e.photo.image_url}))))};t.default=i},function(e,t,n){"use strict";function r(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var o=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,u,l=r(e),s=1;s<arguments.length;s++){n=Object(arguments[s]);for(var c in n)a.call(n,c)&&(l[c]=n[c]);if(o){u=o(n);for(var f=0;f<u.length;f++)i.call(n,u[f])&&(l[u[f]]=n[u[f]])}}return l}},function(e,t,n){"use strict";var r={};e.exports=r},function(e,t,n){"use strict";function r(e,t,n){function u(){y===v&&(y=v.slice())}function l(){return m}function s(e){if("function"!=typeof e)throw new Error("Expected listener to be a function.");var t=!0;return u(),y.push(e),function(){if(t){t=!1,u();var n=y.indexOf(e);y.splice(n,1)}}}function c(e){if(!Object(o.a)(e))throw new Error("Actions must be plain objects. Use custom middleware for async actions.");if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');if(b)throw new Error("Reducers may not dispatch actions.");try{b=!0,m=h(m,e)}finally{b=!1}for(var t=v=y,n=0;n<t.length;n++){(0,t[n])()}return e}function f(e){if("function"!=typeof e)throw new Error("Expected the nextReducer to be a function.");h=e,c({type:i.INIT})}function p(){var e,t=s;return e={subscribe:function(e){function n(){e.next&&e.next(l())}if("object"!=typeof e)throw new TypeError("Expected the observer to be an object.");return n(),{unsubscribe:t(n)}}},e[a.a]=function(){return this},e}var d;if("function"==typeof t&&void 0===n&&(n=t,t=void 0),void 0!==n){if("function"!=typeof n)throw new Error("Expected the enhancer to be a function.");return n(r)(e,t)}if("function"!=typeof e)throw new Error("Expected the reducer to be a function.");var h=e,m=t,v=[],y=v,b=!1;return c({type:i.INIT}),d={dispatch:c,subscribe:s,getState:l,replaceReducer:f},d[a.a]=p,d}n.d(t,"a",function(){return i}),t.b=r;var o=n(29),a=n(100),i={INIT:"@@redux/INIT"}},function(e,t,n){"use strict";var r=n(93),o=r.a.Symbol;t.a=o},function(e,t,n){"use strict"},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}t.a=r},function(e,t,n){var r=n(30),o=n(12),a=r(o,"Map");e.exports=a},function(e,t,n){var r=n(12),o=r.Symbol;e.exports=o},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(18))},function(e,t,n){function r(e,t,n){(void 0===n||a(e[t],n))&&(void 0!==n||t in e)||o(e,t,n)}var o=n(32),a=n(22);e.exports=r},function(e,t,n){var r=n(30),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t){function n(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}e.exports=n},function(e,t,n){var r=n(57),o=r(Object.getPrototypeOf,Object);e.exports=o},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){var r=n(164),o=n(14),a=Object.prototype,i=a.hasOwnProperty,u=a.propertyIsEnumerable,l=r(function(){return arguments}())?r:function(e){return o(e)&&i.call(e,"callee")&&!u.call(e,"callee")};e.exports=l},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r}var r=9007199254740991;e.exports=n},function(e,t,n){(function(e){var r=n(12),o=n(166),a="object"==typeof t&&t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a,l=u?r.Buffer:void 0,s=l?l.isBuffer:void 0,c=s||o;e.exports=c}).call(t,n(33)(e))},function(e,t,n){var r=n(168),o=n(169),a=n(170),i=a&&a.isTypedArray,u=i?o(i):r;e.exports=u},function(e,t){function n(e,t){return"__proto__"==t?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){return i(e)?o(e,!0):a(e)}var o=n(64),a=n(175),i=n(26);e.exports=r},function(e,t,n){function r(e,t){var n=i(e),r=!n&&a(e),c=!n&&!r&&u(e),p=!n&&!r&&!c&&s(e),d=n||r||c||p,h=d?o(e.length,String):[],m=h.length;for(var v in e)!t&&!f.call(e,v)||d&&("length"==v||c&&("offset"==v||"parent"==v)||p&&("buffer"==v||"byteLength"==v||"byteOffset"==v)||l(v,m))||h.push(v);return h}var o=n(174),a=n(58),i=n(35),u=n(60),l=n(65),s=n(61),c=Object.prototype,f=c.hasOwnProperty;e.exports=r},function(e,t){function n(e,t){var n=typeof e;return!!(t=null==t?r:t)&&("number"==n||"symbol"!=n&&o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=n},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){"use strict";n.d(t,"b",function(){return a}),n.d(t,"a",function(){return i});var r=n(4),o=n.n(r),a=o.a.shape({trySubscribe:o.a.func.isRequired,tryUnsubscribe:o.a.func.isRequired,notifyNestedSubs:o.a.func.isRequired,isSubscribed:o.a.func.isRequired}),i=o.a.shape({subscribe:o.a.func.isRequired,dispatch:o.a.func.isRequired,getState:o.a.func.isRequired})},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function u(){}function l(e,t){var n={run:function(r){try{var o=e(t.getState(),r);(o!==n.props||n.error)&&(n.shouldComponentUpdate=!0,n.props=o,n.error=null)}catch(e){n.shouldComponentUpdate=!0,n.error=e}}};return n}function s(e){var t,n,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=s.getDisplayName,p=void 0===c?function(e){return"ConnectAdvanced("+e+")"}:c,E=s.methodName,_=void 0===E?"connectAdvanced":E,w=s.renderCountProp,O=void 0===w?void 0:w,C=s.shouldHandleStateChanges,x=void 0===C||C,P=s.storeKey,S=void 0===P?"store":P,k=s.withRef,T=void 0!==k&&k,j=i(s,["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef"]),N=S+"Subscription",R=b++,M=(t={},t[S]=v.a,t[N]=v.b,t),A=(n={},n[N]=v.b,n);return function(t){d()("function"==typeof t,"You must pass a component to the function returned by "+_+". Instead received "+JSON.stringify(t));var n=t.displayName||t.name||"Component",i=p(n),s=y({},j,{getDisplayName:p,methodName:_,renderCountProp:O,shouldHandleStateChanges:x,storeKey:S,withRef:T,displayName:i,wrappedComponentName:n,WrappedComponent:t}),c=function(n){function c(e,t){r(this,c);var a=o(this,n.call(this,e,t));return a.version=R,a.state={},a.renderCount=0,a.store=e[S]||t[S],a.propsMode=Boolean(e[S]),a.setWrappedInstance=a.setWrappedInstance.bind(a),d()(a.store,'Could not find "'+S+'" in either the context or props of "'+i+'". Either wrap the root component in a <Provider>, or explicitly pass "'+S+'" as a prop to "'+i+'".'),a.initSelector(),a.initSubscription(),a}return a(c,n),c.prototype.getChildContext=function(){var e,t=this.propsMode?null:this.subscription;return e={},e[N]=t||this.context[N],e},c.prototype.componentDidMount=function(){x&&(this.subscription.trySubscribe(),this.selector.run(this.props),this.selector.shouldComponentUpdate&&this.forceUpdate())},c.prototype.componentWillReceiveProps=function(e){this.selector.run(e)},c.prototype.shouldComponentUpdate=function(){return this.selector.shouldComponentUpdate},c.prototype.componentWillUnmount=function(){this.subscription&&this.subscription.tryUnsubscribe(),this.subscription=null,this.notifyNestedSubs=u,this.store=null,this.selector.run=u,this.selector.shouldComponentUpdate=!1},c.prototype.getWrappedInstance=function(){return d()(T,"To access the wrapped instance, you need to specify { withRef: true } in the options argument of the "+_+"() call."),this.wrappedInstance},c.prototype.setWrappedInstance=function(e){this.wrappedInstance=e},c.prototype.initSelector=function(){var t=e(this.store.dispatch,s);this.selector=l(t,this.store),this.selector.run(this.props)},c.prototype.initSubscription=function(){if(x){var e=(this.propsMode?this.props:this.context)[N];this.subscription=new m.a(this.store,e,this.onStateChange.bind(this)),this.notifyNestedSubs=this.subscription.notifyNestedSubs.bind(this.subscription)}},c.prototype.onStateChange=function(){this.selector.run(this.props),this.selector.shouldComponentUpdate?(this.componentDidUpdate=this.notifyNestedSubsOnComponentDidUpdate,this.setState(g)):this.notifyNestedSubs()},c.prototype.notifyNestedSubsOnComponentDidUpdate=function(){this.componentDidUpdate=void 0,this.notifyNestedSubs()},c.prototype.isSubscribed=function(){return Boolean(this.subscription)&&this.subscription.isSubscribed()},c.prototype.addExtraProps=function(e){if(!(T||O||this.propsMode&&this.subscription))return e;var t=y({},e);return T&&(t.ref=this.setWrappedInstance),O&&(t[O]=this.renderCount++),this.propsMode&&this.subscription&&(t[N]=this.subscription),t},c.prototype.render=function(){var e=this.selector;if(e.shouldComponentUpdate=!1,e.error)throw e.error;return Object(h.createElement)(t,this.addExtraProps(e.props))},c}(h.Component);return c.WrappedComponent=t,c.displayName=i,c.childContextTypes=A,c.contextTypes=M,c.propTypes=M,f()(c,t)}}t.a=s;var c=n(69),f=n.n(c),p=n(6),d=n.n(p),h=n(0),m=(n.n(h),n(197)),v=n(67),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b=0,g={}},function(e,t,n){!function(t,n){e.exports=n()}(0,function(){"use strict";var e={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},t={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},n=Object.defineProperty,r=Object.getOwnPropertyNames,o=Object.getOwnPropertySymbols,a=Object.getOwnPropertyDescriptor,i=Object.getPrototypeOf,u=i&&i(Object);return function l(s,c,f){if("string"!=typeof c){if(u){var p=i(c);p&&p!==u&&l(s,p,f)}var d=r(c);o&&(d=d.concat(o(c)));for(var h=0;h<d.length;++h){var m=d[h];if(!(e[m]||t[m]||f&&f[m])){var v=a(c,m);try{n(s,m,v)}catch(e){}}}return s}return s}})},function(e,t,n){"use strict";function r(e){return function(t,n){function r(){return o}var o=e(t,n);return r.dependsOnOwnProps=!1,r}}function o(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?Boolean(e.dependsOnOwnProps):1!==e.length}function a(e,t){return function(t,n){var r=(n.displayName,function(e,t){return r.dependsOnOwnProps?r.mapToProps(e,t):r.mapToProps(e)});return r.dependsOnOwnProps=!0,r.mapToProps=function(t,n){r.mapToProps=e,r.dependsOnOwnProps=o(e);var a=r(t,n);return"function"==typeof a&&(r.mapToProps=a,r.dependsOnOwnProps=o(a),a=r(t,n)),a},r}}t.a=r,t.b=a;n(71)},function(e,t,n){"use strict";n(29),n(36)},function(e,t,n){"use strict";function r(e){return"/"===e.charAt(0)}function o(e,t){for(var n=t,r=n+1,o=e.length;r<o;n+=1,r+=1)e[n]=e[r];e.pop()}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=e&&e.split("/")||[],a=t&&t.split("/")||[],i=e&&r(e),u=t&&r(t),l=i||u;if(e&&r(e)?a=n:n.length&&(a.pop(),a=a.concat(n)),!a.length)return"/";var s=void 0;if(a.length){var c=a[a.length-1];s="."===c||".."===c||""===c}else s=!1;for(var f=0,p=a.length;p>=0;p--){var d=a[p];"."===d?o(a,p):".."===d?(o(a,p),f++):f&&(o(a,p),f--)}if(!l)for(;f--;f)a.unshift("..");!l||""===a[0]||a[0]&&r(a[0])||a.unshift("");var h=a.join("/");return s&&"/"!==h.substr(-1)&&(h+="/"),h}Object.defineProperty(t,"__esModule",{value:!0}),t.default=a},function(e,t,n){"use strict";function r(e,t){if(e===t)return!0;if(null==e||null==t)return!1;if(Array.isArray(e))return Array.isArray(t)&&e.length===t.length&&e.every(function(e,n){return r(e,t[n])});var n=void 0===e?"undefined":o(e);if(n!==(void 0===t?"undefined":o(t)))return!1;if("object"===n){var a=e.valueOf(),i=t.valueOf();if(a!==e||i!==t)return r(a,i);var u=Object.keys(e),l=Object.keys(t);return u.length===l.length&&u.every(function(n){return r(e[n],t[n])})}return!1}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=r},function(e,t,n){"use strict";t.__esModule=!0;t.canUseDOM=!("undefined"==typeof window||!window.document||!window.document.createElement),t.addEventListener=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},t.removeEventListener=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},t.getConfirmation=function(e,t){return t(window.confirm(e))},t.supportsHistory=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},t.supportsPopStateOnHashChange=function(){return-1===window.navigator.userAgent.indexOf("Trident")},t.supportsGoWithoutReloadUsingHash=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},t.isExtraneousPopstateEvent=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(0),l=n.n(u),s=n(4),c=n.n(s),f=n(6),p=n.n(f),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h=function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)},m=function(e){function t(){var n,r,i;o(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=r=a(this,e.call.apply(e,[this].concat(l))),r.handleClick=function(e){if(r.props.onClick&&r.props.onClick(e),!e.defaultPrevented&&0===e.button&&!r.props.target&&!h(e)){e.preventDefault();var t=r.context.router.history,n=r.props,o=n.replace,a=n.to;o?t.replace(a):t.push(a)}},i=n,a(r,i)}return i(t,e),t.prototype.render=function(){var e=this.props,t=(e.replace,e.to),n=e.innerRef,o=r(e,["replace","to","innerRef"]);p()(this.context.router,"You should not use <Link> outside a <Router>");var a=this.context.router.history.createHref("string"==typeof t?{pathname:t}:t);return l.a.createElement("a",d({},o,{onClick:this.handleClick,href:a,ref:n}))},t}(l.a.Component);m.propTypes={onClick:c.a.func,target:c.a.string,replace:c.a.bool,to:c.a.oneOfType([c.a.string,c.a.object]).isRequired,innerRef:c.a.oneOfType([c.a.string,c.a.func])},m.defaultProps={replace:!1},m.contextTypes={router:c.a.shape({history:c.a.shape({push:c.a.func.isRequired,replace:c.a.func.isRequired,createHref:c.a.func.isRequired}).isRequired}).isRequired},t.a=m},function(e,t,n){"use strict";var r=n(77);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(3),u=n.n(i),l=n(6),s=n.n(l),c=n(0),f=n.n(c),p=n(4),d=n.n(p),h=n(41),m=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},v=function(e){return 0===f.a.Children.count(e)},y=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=a=o(this,e.call.apply(e,[this].concat(l))),a.state={match:a.computeMatch(a.props,a.context.router)},i=n,o(a,i)}return a(t,e),t.prototype.getChildContext=function(){return{router:m({},this.context.router,{route:{location:this.props.location||this.context.router.route.location,match:this.state.match}})}},t.prototype.computeMatch=function(e,t){var n=e.computedMatch,r=e.location,o=e.path,a=e.strict,i=e.exact,u=e.sensitive;if(n)return n;s()(t,"You should not use <Route> or withRouter() outside a <Router>");var l=t.route,c=(r||l.location).pathname;return o?Object(h.a)(c,{path:o,strict:a,exact:i,sensitive:u}):l.match},t.prototype.componentWillMount=function(){u()(!(this.props.component&&this.props.render),"You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"),u()(!(this.props.component&&this.props.children&&!v(this.props.children)),"You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"),u()(!(this.props.render&&this.props.children&&!v(this.props.children)),"You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored")},t.prototype.componentWillReceiveProps=function(e,t){u()(!(e.location&&!this.props.location),'<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),u()(!(!e.location&&this.props.location),'<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'),this.setState({match:this.computeMatch(e,t.router)})},t.prototype.render=function(){var e=this.state.match,t=this.props,n=t.children,r=t.component,o=t.render,a=this.context.router,i=a.history,u=a.route,l=a.staticContext,s=this.props.location||u.location,c={match:e,location:s,history:i,staticContext:l};return r?e?f.a.createElement(r,c):null:o?e?o(c):null:n?"function"==typeof n?n(c):v(n)?null:f.a.Children.only(n):null},t}(f.a.Component);y.propTypes={computedMatch:d.a.object,path:d.a.string,exact:d.a.bool,strict:d.a.bool,sensitive:d.a.bool,component:d.a.func,render:d.a.func,children:d.a.oneOfType([d.a.func,d.a.node]),location:d.a.object},y.contextTypes={router:d.a.shape({history:d.a.object.isRequired,route:d.a.object.isRequired,staticContext:d.a.object})},y.childContextTypes={router:d.a.object.isRequired},t.a=y},function(e,t,n){"use strict";n.d(t,"b",function(){return r}),n.d(t,"a",function(){return o}),n.d(t,"e",function(){return a}),n.d(t,"c",function(){return i}),n.d(t,"g",function(){return u}),n.d(t,"h",function(){return l}),n.d(t,"f",function(){return s}),n.d(t,"d",function(){return c});var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o=function(e,t,n){return e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)},a=function(e,t,n){return e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)},i=function(e,t){return t(window.confirm(e))},u=function(){var e=window.navigator.userAgent;return(-1===e.indexOf("Android 2.")&&-1===e.indexOf("Android 4.0")||-1===e.indexOf("Mobile Safari")||-1!==e.indexOf("Chrome")||-1!==e.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)},l=function(){return-1===window.navigator.userAgent.indexOf("Trident")},s=function(){return-1===window.navigator.userAgent.indexOf("Firefox")},c=function(e){return void 0===e.state&&-1===navigator.userAgent.indexOf("CriOS")}},function(e,t,n){function r(e,t){var n=-1,r=e.length,a=r-1;for(t=void 0===t?r:t;++n<t;){var i=o(n,a),u=e[i];e[i]=e[n],e[n]=u}return e.length=t,e}var o=n(246);e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.selectAllCurrentUserPhotos=function(e){return e.session.currentUser.photo_ids.map(function(t){return e.photos[t]})}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(0),a=r(o),i=n(83),u=r(i),l=n(91),s=r(l),c=n(192),f=r(c);document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("root"),t=void 0;if(window.currentUser){var n={session:{currentUser:window.currentUser}};t=(0,s.default)(n),delete window.currentUser}else t=(0,s.default)();u.default.render(a.default.createElement(f.default,{store:t}),e)})},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);throw t=Error(n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."),t.name="Invariant Violation",t.framesToPop=1,t}function o(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||j}function a(){}function i(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||j}function u(e,t,n){var r=void 0,o={},a=null,i=null;if(null!=t)for(r in void 0!==t.ref&&(i=t.ref),void 0!==t.key&&(a=""+t.key),t)M.call(t,r)&&!A.hasOwnProperty(r)&&(o[r]=t[r]);var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){for(var l=Array(u),s=0;s<u;s++)l[s]=arguments[s+2];o.children=l}if(e&&e.defaultProps)for(r in u=e.defaultProps)void 0===o[r]&&(o[r]=u[r]);return{$$typeof:_,type:e,key:a,ref:i,props:o,_owner:R.current}}function l(e){return"object"==typeof e&&null!==e&&e.$$typeof===_}function s(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function c(e,t,n,r){if(I.length){var o=I.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function f(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>I.length&&I.push(e)}function p(e,t,n,o){var a=typeof e;"undefined"!==a&&"boolean"!==a||(e=null);var i=!1;if(null===e)i=!0;else switch(a){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case _:case w:i=!0}}if(i)return n(o,e,""===t?"."+d(e,0):t),1;if(i=0,t=""===t?".":t+":",Array.isArray(e))for(var u=0;u<e.length;u++){a=e[u];var l=t+d(a,u);i+=p(a,l,n,o)}else if(null===e||void 0===e?l=null:(l=T&&e[T]||e["@@iterator"],l="function"==typeof l?l:null),"function"==typeof l)for(e=l.call(e),u=0;!(a=e.next()).done;)a=a.value,l=t+d(a,u++),i+=p(a,l,n,o);else"object"===a&&(n=""+e,r("31","[object Object]"===n?"object with keys {"+Object.keys(e).join(", ")+"}":n,""));return i}function d(e,t){return"object"==typeof e&&null!==e&&null!=e.key?s(e.key):t.toString(36)}function h(e,t){e.func.call(e.context,t,e.count++)}function m(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?v(e,r,n,g.thatReturnsArgument):null!=e&&(l(e)&&(t=o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(U,"$&/")+"/")+n,e={$$typeof:_,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}),r.push(e))}function v(e,t,n,r,o){var a="";null!=n&&(a=(""+n).replace(U,"$&/")+"/"),t=c(t,a,r,o),null==e||p(e,"",m,t),f(t)}/** @license React v16.3.1
 * react.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var y=n(44),b=n(45),g=n(28),E="function"==typeof Symbol&&Symbol.for,_=E?Symbol.for("react.element"):60103,w=E?Symbol.for("react.portal"):60106,O=E?Symbol.for("react.fragment"):60107,C=E?Symbol.for("react.strict_mode"):60108,x=E?Symbol.for("react.provider"):60109,P=E?Symbol.for("react.context"):60110,S=E?Symbol.for("react.async_mode"):60111,k=E?Symbol.for("react.forward_ref"):60112,T="function"==typeof Symbol&&Symbol.iterator,j={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};o.prototype.isReactComponent={},o.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&r("85"),this.updater.enqueueSetState(this,e,t,"setState")},o.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},a.prototype=o.prototype;var N=i.prototype=new a;N.constructor=i,y(N,o.prototype),N.isPureReactComponent=!0;var R={current:null},M=Object.prototype.hasOwnProperty,A={key:!0,ref:!0,__self:!0,__source:!0},U=/\/+/g,I=[],L={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return v(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;t=c(null,null,t,n),null==e||p(e,"",h,t),f(t)},count:function(e){return null==e?0:p(e,"",g.thatReturnsNull,null)},toArray:function(e){var t=[];return v(e,t,null,g.thatReturnsArgument),t},only:function(e){return l(e)||r("143"),e}},createRef:function(){return{current:null}},Component:o,PureComponent:i,createContext:function(e,t){return void 0===t&&(t=null),e={$$typeof:P,_calculateChangedBits:t,_defaultValue:e,_currentValue:e,_changedBits:0,Provider:null,Consumer:null},e.Provider={$$typeof:x,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:k,render:e}},Fragment:O,StrictMode:C,unstable_AsyncMode:S,createElement:u,cloneElement:function(e,t,n){var r=void 0,o=y({},e.props),a=e.key,i=e.ref,u=e._owner;if(null!=t){void 0!==t.ref&&(i=t.ref,u=R.current),void 0!==t.key&&(a=""+t.key);var l=void 0;e.type&&e.type.defaultProps&&(l=e.type.defaultProps);for(r in t)M.call(t,r)&&!A.hasOwnProperty(r)&&(o[r]=void 0===t[r]&&void 0!==l?l[r]:t[r])}if(1===(r=arguments.length-2))o.children=n;else if(1<r){l=Array(r);for(var s=0;s<r;s++)l[s]=arguments[s+2];o.children=l}return{$$typeof:_,type:e.type,key:a,ref:i,props:o,_owner:u}},createFactory:function(e){var t=u.bind(null,e);return t.type=e,t},isValidElement:l,version:"16.3.1",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:R,assign:y}},D=Object.freeze({default:L}),F=D&&L||D;e.exports=F.default?F.default:F},function(e,t,n){"use strict";function r(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}r(),e.exports=n(84)},function(e,t,n){"use strict";function r(e){for(var t=arguments.length-1,n="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);throw t=Error(n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."),t.name="Invariant Violation",t.framesToPop=1,t}function o(e,t,n,r,o,a,i,u,l){this._hasCaughtError=!1,this._caughtError=null;var s=Array.prototype.slice.call(arguments,3);try{t.apply(n,s)}catch(e){this._caughtError=e,this._hasCaughtError=!0}}function a(){if(yn._hasRethrowError){var e=yn._rethrowError;throw yn._rethrowError=null,yn._hasRethrowError=!1,e}}function i(){if(bn)for(var e in gn){var t=gn[e],n=bn.indexOf(e);if(-1<n||r("96",e),!En[n]){t.extractEvents||r("97",e),En[n]=t,n=t.eventTypes;for(var o in n){var a=void 0,i=n[o],l=t,s=o;_n.hasOwnProperty(s)&&r("99",s),_n[s]=i;var c=i.phasedRegistrationNames;if(c){for(a in c)c.hasOwnProperty(a)&&u(c[a],l,s);a=!0}else i.registrationName?(u(i.registrationName,l,s),a=!0):a=!1;a||r("98",o,e)}}}}function u(e,t,n){wn[e]&&r("100",e),wn[e]=t,On[e]=t.eventTypes[n].dependencies}function l(e){bn&&r("101"),bn=Array.prototype.slice.call(e),i()}function s(e){var t,n=!1;for(t in e)if(e.hasOwnProperty(t)){var o=e[t];gn.hasOwnProperty(t)&&gn[t]===o||(gn[t]&&r("102",t),gn[t]=o,n=!0)}n&&i()}function c(e,t,n,r){t=e.type||"unknown-event",e.currentTarget=Sn(r),yn.invokeGuardedCallbackAndCatchFirstError(t,n,void 0,e),e.currentTarget=null}function f(e,t){return null==t&&r("30"),null==e?t:Array.isArray(e)?Array.isArray(t)?(e.push.apply(e,t),e):(e.push(t),e):Array.isArray(t)?[e].concat(t):[e,t]}function p(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)}function d(e,t){if(e){var n=e._dispatchListeners,r=e._dispatchInstances;if(Array.isArray(n))for(var o=0;o<n.length&&!e.isPropagationStopped();o++)c(e,t,n[o],r[o]);else n&&c(e,t,n,r);e._dispatchListeners=null,e._dispatchInstances=null,e.isPersistent()||e.constructor.release(e)}}function h(e){return d(e,!0)}function m(e){return d(e,!1)}function v(e,t){var n=e.stateNode;if(!n)return null;var o=xn(n);if(!o)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":(o=!o.disabled)||(e=e.type,o=!("button"===e||"input"===e||"select"===e||"textarea"===e)),e=!o;break e;default:e=!1}return e?null:(n&&"function"!=typeof n&&r("231",t,typeof n),n)}function y(e,t){null!==e&&(kn=f(kn,e)),e=kn,kn=null,e&&(t?p(e,h):p(e,m),kn&&r("95"),yn.rethrowCaughtError())}function b(e,t,n,r){for(var o=null,a=0;a<En.length;a++){var i=En[a];i&&(i=i.extractEvents(e,t,n,r))&&(o=f(o,i))}y(o,!1)}function g(e){if(e[Rn])return e[Rn];for(;!e[Rn];){if(!e.parentNode)return null;e=e.parentNode}return e=e[Rn],5===e.tag||6===e.tag?e:null}function E(e){if(5===e.tag||6===e.tag)return e.stateNode;r("33")}function _(e){return e[Mn]||null}function w(e){do{e=e.return}while(e&&5!==e.tag);return e||null}function O(e,t,n){for(var r=[];e;)r.push(e),e=w(e);for(e=r.length;0<e--;)t(r[e],"captured",n);for(e=0;e<r.length;e++)t(r[e],"bubbled",n)}function C(e,t,n){(t=v(e,n.dispatchConfig.phasedRegistrationNames[t]))&&(n._dispatchListeners=f(n._dispatchListeners,t),n._dispatchInstances=f(n._dispatchInstances,e))}function x(e){e&&e.dispatchConfig.phasedRegistrationNames&&O(e._targetInst,C,e)}function P(e){if(e&&e.dispatchConfig.phasedRegistrationNames){var t=e._targetInst;t=t?w(t):null,O(t,C,e)}}function S(e,t,n){e&&n&&n.dispatchConfig.registrationName&&(t=v(e,n.dispatchConfig.registrationName))&&(n._dispatchListeners=f(n._dispatchListeners,t),n._dispatchInstances=f(n._dispatchInstances,e))}function k(e){e&&e.dispatchConfig.registrationName&&S(e._targetInst,null,e)}function T(e){p(e,x)}function j(e,t,n,r){if(n&&r)e:{for(var o=n,a=r,i=0,u=o;u;u=w(u))i++;u=0;for(var l=a;l;l=w(l))u++;for(;0<i-u;)o=w(o),i--;for(;0<u-i;)a=w(a),u--;for(;i--;){if(o===a||o===a.alternate)break e;o=w(o),a=w(a)}o=null}else o=null;for(a=o,o=[];n&&n!==a&&(null===(i=n.alternate)||i!==a);)o.push(n),n=w(n);for(n=[];r&&r!==a&&(null===(i=r.alternate)||i!==a);)n.push(r),r=w(r);for(r=0;r<o.length;r++)S(o[r],"bubbled",e);for(e=n.length;0<e--;)S(n[e],"captured",t)}function N(){return!In&&cn.canUseDOM&&(In="textContent"in document.documentElement?"textContent":"innerText"),In}function R(){if(Ln._fallbackText)return Ln._fallbackText;var e,t,n=Ln._startText,r=n.length,o=M(),a=o.length;for(e=0;e<r&&n[e]===o[e];e++);var i=r-e;for(t=1;t<=i&&n[r-t]===o[a-t];t++);return Ln._fallbackText=o.slice(e,1<t?1-t:void 0),Ln._fallbackText}function M(){return"value"in Ln._root?Ln._root.value:Ln._root[N()]}function A(e,t,n,r){this.dispatchConfig=e,this._targetInst=t,this.nativeEvent=n,e=this.constructor.Interface;for(var o in e)e.hasOwnProperty(o)&&((t=e[o])?this[o]=t(n):"target"===o?this.target=r:this[o]=n[o]);return this.isDefaultPrevented=(null!=n.defaultPrevented?n.defaultPrevented:!1===n.returnValue)?pn.thatReturnsTrue:pn.thatReturnsFalse,this.isPropagationStopped=pn.thatReturnsFalse,this}function U(e,t,n,r){if(this.eventPool.length){var o=this.eventPool.pop();return this.call(o,e,t,n,r),o}return new this(e,t,n,r)}function I(e){e instanceof this||r("223"),e.destructor(),10>this.eventPool.length&&this.eventPool.push(e)}function L(e){e.eventPool=[],e.getPooled=U,e.release=I}function D(e,t){switch(e){case"topKeyUp":return-1!==zn.indexOf(t.keyCode);case"topKeyDown":return 229!==t.keyCode;case"topKeyPress":case"topMouseDown":case"topBlur":return!0;default:return!1}}function F(e){return e=e.detail,"object"==typeof e&&"data"in e?e.data:null}function V(e,t){switch(e){case"topCompositionEnd":return F(t);case"topKeyPress":return 32!==t.which?null:(Yn=!0,Kn);case"topTextInput":return e=t.data,e===Kn&&Yn?null:e;default:return null}}function H(e,t){if(Qn)return"topCompositionEnd"===e||!Bn&&D(e,t)?(e=R(),Ln._root=null,Ln._startText=null,Ln._fallbackText=null,Qn=!1,e):null;switch(e){case"topPaste":return null;case"topKeyPress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"topCompositionEnd":return $n?null:t.data;default:return null}}function z(e){if(e=Pn(e)){Xn&&"function"==typeof Xn.restoreControlledState||r("194");var t=xn(e.stateNode);Xn.restoreControlledState(e.stateNode,e.type,t)}}function B(e){Zn?er?er.push(e):er=[e]:Zn=e}function W(){return null!==Zn||null!==er}function q(){if(Zn){var e=Zn,t=er;if(er=Zn=null,z(e),t)for(e=0;e<t.length;e++)z(t[e])}}function $(e,t){return e(t)}function K(e,t,n){return e(t,n)}function G(){}function Y(e,t){if(rr)return e(t);rr=!0;try{return $(e,t)}finally{rr=!1,W()&&(G(),q())}}function Q(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return"input"===t?!!or[e.type]:"textarea"===t}function J(e){return e=e.target||window,e.correspondingUseElement&&(e=e.correspondingUseElement),3===e.nodeType?e.parentNode:e}function X(e,t){return!(!cn.canUseDOM||t&&!("addEventListener"in document))&&(e="on"+e,t=e in document,t||(t=document.createElement("div"),t.setAttribute(e,"return;"),t="function"==typeof t[e]),t)}function Z(e){var t=e.type;return(e=e.nodeName)&&"input"===e.toLowerCase()&&("checkbox"===t||"radio"===t)}function ee(e){var t=Z(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&"function"==typeof n.get&&"function"==typeof n.set)return Object.defineProperty(e,t,{configurable:!0,get:function(){return n.get.call(this)},set:function(e){r=""+e,n.set.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=""+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}function te(e){e._valueTracker||(e._valueTracker=ee(e))}function ne(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Z(e)?e.checked?"true":"false":e.value),(e=r)!==n&&(t.setValue(e),!0)}function re(e){return null===e||void 0===e?null:(e=yr&&e[yr]||e["@@iterator"],"function"==typeof e?e:null)}function oe(e){if("function"==typeof(e=e.type))return e.displayName||e.name;if("string"==typeof e)return e;switch(e){case fr:return"ReactFragment";case cr:return"ReactPortal";case lr:return"ReactCall";case sr:return"ReactReturn"}return null}function ae(e){var t="";do{e:switch(e.tag){case 0:case 1:case 2:case 5:var n=e._debugOwner,r=e._debugSource,o=oe(e),a=null;n&&(a=oe(n)),n=r,o="\n    in "+(o||"Unknown")+(n?" (at "+n.fileName.replace(/^.*[\\\/]/,"")+":"+n.lineNumber+")":a?" (created by "+a+")":"");break e;default:o=""}t+=o,e=e.return}while(e);return t}function ie(e){return!!Er.hasOwnProperty(e)||!gr.hasOwnProperty(e)&&(br.test(e)?Er[e]=!0:(gr[e]=!0,!1))}function ue(e,t,n,r){if(null!==n&&0===n.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!r&&(null!==n?!n.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}function le(e,t,n,r){if(null===t||void 0===t||ue(e,t,n,r))return!0;if(null!==n)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function se(e,t,n,r,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=r,this.attributeNamespace=o,this.mustUseProperty=n,this.propertyName=e,this.type=t}function ce(e){return e[1].toUpperCase()}function fe(e,t,n,r){var o=_r.hasOwnProperty(t)?_r[t]:null;(null!==o?0===o.type:!r&&(2<t.length&&("o"===t[0]||"O"===t[0])&&("n"===t[1]||"N"===t[1])))||(le(t,n,o,r)&&(n=null),r||null===o?ie(t)&&(null===n?e.removeAttribute(t):e.setAttribute(t,""+n)):o.mustUseProperty?e[o.propertyName]=null===n?3!==o.type&&"":n:(t=o.attributeName,r=o.attributeNamespace,null===n?e.removeAttribute(t):(o=o.type,n=3===o||4===o&&!0===n?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}function pe(e,t){var n=t.checked;return fn({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=n?n:e._wrapperState.initialChecked})}function de(e,t){var n=null==t.defaultValue?"":t.defaultValue,r=null!=t.checked?t.checked:t.defaultChecked;n=be(null!=t.value?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:"checkbox"===t.type||"radio"===t.type?null!=t.checked:null!=t.value}}function he(e,t){null!=(t=t.checked)&&fe(e,"checked",t,!1)}function me(e,t){he(e,t);var n=be(t.value);null!=n&&("number"===t.type?(0===n&&""===e.value||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n)),t.hasOwnProperty("value")?ye(e,t.type,n):t.hasOwnProperty("defaultValue")&&ye(e,t.type,be(t.defaultValue)),null==t.checked&&null!=t.defaultChecked&&(e.defaultChecked=!!t.defaultChecked)}function ve(e,t){(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue"))&&(""===e.value&&(e.value=""+e._wrapperState.initialValue),e.defaultValue=""+e._wrapperState.initialValue),t=e.name,""!==t&&(e.name=""),e.defaultChecked=!e.defaultChecked,e.defaultChecked=!e.defaultChecked,""!==t&&(e.name=t)}function ye(e,t,n){"number"===t&&e.ownerDocument.activeElement===e||(null==n?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}function be(e){switch(typeof e){case"boolean":case"number":case"object":case"string":case"undefined":return e;default:return""}}function ge(e,t,n){return e=A.getPooled(Or.change,e,t,n),e.type="change",B(n),T(e),e}function Ee(e){y(e,!1)}function _e(e){if(ne(E(e)))return e}function we(e,t){if("topChange"===e)return t}function Oe(){Cr&&(Cr.detachEvent("onpropertychange",Ce),xr=Cr=null)}function Ce(e){"value"===e.propertyName&&_e(xr)&&(e=ge(xr,e,J(e)),Y(Ee,e))}function xe(e,t,n){"topFocus"===e?(Oe(),Cr=t,xr=n,Cr.attachEvent("onpropertychange",Ce)):"topBlur"===e&&Oe()}function Pe(e){if("topSelectionChange"===e||"topKeyUp"===e||"topKeyDown"===e)return _e(xr)}function Se(e,t){if("topClick"===e)return _e(t)}function ke(e,t){if("topInput"===e||"topChange"===e)return _e(t)}function Te(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):!!(e=Tr[e])&&!!t[e]}function je(){return Te}function Ne(e){var t=e;if(e.alternate)for(;t.return;)t=t.return;else{if(0!=(2&t.effectTag))return 1;for(;t.return;)if(t=t.return,0!=(2&t.effectTag))return 1}return 3===t.tag?2:3}function Re(e){return!!(e=e._reactInternalFiber)&&2===Ne(e)}function Me(e){2!==Ne(e)&&r("188")}function Ae(e){var t=e.alternate;if(!t)return t=Ne(e),3===t&&r("188"),1===t?null:e;for(var n=e,o=t;;){var a=n.return,i=a?a.alternate:null;if(!a||!i)break;if(a.child===i.child){for(var u=a.child;u;){if(u===n)return Me(a),e;if(u===o)return Me(a),t;u=u.sibling}r("188")}if(n.return!==o.return)n=a,o=i;else{u=!1;for(var l=a.child;l;){if(l===n){u=!0,n=a,o=i;break}if(l===o){u=!0,o=a,n=i;break}l=l.sibling}if(!u){for(l=i.child;l;){if(l===n){u=!0,n=i,o=a;break}if(l===o){u=!0,o=i,n=a;break}l=l.sibling}u||r("189")}}n.alternate!==o&&r("190")}return 3!==n.tag&&r("188"),n.stateNode.current===n?e:t}function Ue(e){if(!(e=Ae(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function Ie(e){if(!(e=Ae(e)))return null;for(var t=e;;){if(5===t.tag||6===t.tag)return t;if(t.child&&4!==t.tag)t.child.return=t,t=t.child;else{if(t===e)break;for(;!t.sibling;){if(!t.return||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}}return null}function Le(e){var t=e.keyCode;return"charCode"in e?0===(e=e.charCode)&&13===t&&(e=13):e=t,10===e&&(e=13),32<=e||13===e?e:0}function De(e,t){var n=e[0].toUpperCase()+e.slice(1),r="on"+n;n="top"+n,t={phasedRegistrationNames:{bubbled:r,captured:r+"Capture"},dependencies:[n],isInteractive:t},Br[e]=t,Wr[n]=t}function Fe(e){var t=e.targetInst;do{if(!t){e.ancestors.push(t);break}var n;for(n=t;n.return;)n=n.return;if(!(n=3!==n.tag?null:n.stateNode.containerInfo))break;e.ancestors.push(t),t=g(n)}while(t);for(n=0;n<e.ancestors.length;n++)t=e.ancestors[n],b(e.topLevelType,t,e.nativeEvent,J(e.nativeEvent))}function Ve(e){Gr=!!e}function He(e,t,n){if(!n)return null;e=($r(e)?Be:We).bind(null,e),n.addEventListener(t,e,!1)}function ze(e,t,n){if(!n)return null;e=($r(e)?Be:We).bind(null,e),n.addEventListener(t,e,!0)}function Be(e,t){K(We,e,t)}function We(e,t){if(Gr){var n=J(t);if(n=g(n),null!==n&&"number"==typeof n.tag&&2!==Ne(n)&&(n=null),Kr.length){var r=Kr.pop();r.topLevelType=e,r.nativeEvent=t,r.targetInst=n,e=r}else e={topLevelType:e,nativeEvent:t,targetInst:n,ancestors:[]};try{Y(Fe,e)}finally{e.topLevelType=null,e.nativeEvent=null,e.targetInst=null,e.ancestors.length=0,10>Kr.length&&Kr.push(e)}}}function qe(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n["ms"+e]="MS"+t,n["O"+e]="o"+t.toLowerCase(),n}function $e(e){if(Jr[e])return Jr[e];if(!Qr[e])return e;var t,n=Qr[e];for(t in n)if(n.hasOwnProperty(t)&&t in Xr)return Jr[e]=n[t];return e}function Ke(e){return Object.prototype.hasOwnProperty.call(e,ro)||(e[ro]=no++,to[e[ro]]={}),to[e[ro]]}function Ge(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ye(e,t){var n=Ge(e);e=0;for(var r;n;){if(3===n.nodeType){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ge(n)}}function Qe(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&("input"===t&&"text"===e.type||"textarea"===t||"true"===e.contentEditable)}function Je(e,t){if(so||null==io||io!==dn())return null;var n=io;return"selectionStart"in n&&Qe(n)?n={start:n.selectionStart,end:n.selectionEnd}:window.getSelection?(n=window.getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}):n=void 0,lo&&hn(lo,n)?null:(lo=n,e=A.getPooled(ao.select,uo,e,t),e.type="select",e.target=io,T(e),e)}function Xe(e,t,n,r){this.tag=e,this.key=n,this.stateNode=this.type=null,this.sibling=this.child=this.return=null,this.index=0,this.ref=null,this.pendingProps=t,this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.effectTag=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.expirationTime=0,this.alternate=null}function Ze(e,t,n){var r=e.alternate;return null===r?(r=new Xe(e.tag,t,e.key,e.mode),r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.effectTag=0,r.nextEffect=null,r.firstEffect=null,r.lastEffect=null),r.expirationTime=n,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function et(e,t,n){var o=e.type,a=e.key;e=e.props;var i=void 0;if("function"==typeof o)i=o.prototype&&o.prototype.isReactComponent?2:0;else if("string"==typeof o)i=5;else switch(o){case fr:return tt(e.children,t,n,a);case mr:i=11,t|=3;break;case pr:i=11,t|=2;break;case lr:i=7;break;case sr:i=9;break;default:if("object"==typeof o&&null!==o)switch(o.$$typeof){case dr:i=13;break;case hr:i=12;break;case vr:i=14;break;default:if("number"==typeof o.tag)return t=o,t.pendingProps=e,t.expirationTime=n,t;r("130",null==o?o:typeof o,"")}else r("130",null==o?o:typeof o,"")}return t=new Xe(i,e,a,t),t.type=o,t.expirationTime=n,t}function tt(e,t,n,r){return e=new Xe(10,e,r,t),e.expirationTime=n,e}function nt(e,t,n){return e=new Xe(6,e,null,t),e.expirationTime=n,e}function rt(e,t,n){return t=new Xe(4,null!==e.children?e.children:[],e.key,t),t.expirationTime=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function ot(e){return function(t){try{return e(t)}catch(e){}}}function at(e){if("undefined"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var t=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(t.isDisabled||!t.supportsFiber)return!0;try{var n=t.inject(e);fo=ot(function(e){return t.onCommitFiberRoot(n,e)}),po=ot(function(e){return t.onCommitFiberUnmount(n,e)})}catch(e){}return!0}function it(e){"function"==typeof fo&&fo(e)}function ut(e){"function"==typeof po&&po(e)}function lt(e){return{baseState:e,expirationTime:0,first:null,last:null,callbackList:null,hasForceUpdate:!1,isInitialized:!1,capturedValues:null}}function st(e,t){null===e.last?e.first=e.last=t:(e.last.next=t,e.last=t),(0===e.expirationTime||e.expirationTime>t.expirationTime)&&(e.expirationTime=t.expirationTime)}function ct(e){ho=mo=null;var t=e.alternate,n=e.updateQueue;null===n&&(n=e.updateQueue=lt(null)),null!==t?null===(e=t.updateQueue)&&(e=t.updateQueue=lt(null)):e=null,ho=n,mo=e!==n?e:null}function ft(e,t){ct(e),e=ho;var n=mo;null===n?st(e,t):null===e.last||null===n.last?(st(e,t),st(n,t)):(st(e,t),n.last=t)}function pt(e,t,n,r){return e=e.partialState,"function"==typeof e?e.call(t,n,r):e}function dt(e,t,n,r,o,a){null!==e&&e.updateQueue===n&&(n=t.updateQueue={baseState:n.baseState,expirationTime:n.expirationTime,first:n.first,last:n.last,isInitialized:n.isInitialized,capturedValues:n.capturedValues,callbackList:null,hasForceUpdate:!1}),n.expirationTime=0,n.isInitialized?e=n.baseState:(e=n.baseState=t.memoizedState,n.isInitialized=!0);for(var i=!0,u=n.first,l=!1;null!==u;){var s=u.expirationTime;if(s>a){var c=n.expirationTime;(0===c||c>s)&&(n.expirationTime=s),l||(l=!0,n.baseState=e)}else l||(n.first=u.next,null===n.first&&(n.last=null)),u.isReplace?(e=pt(u,r,e,o),i=!0):(s=pt(u,r,e,o))&&(e=i?fn({},e,s):fn(e,s),i=!1),u.isForced&&(n.hasForceUpdate=!0),null!==u.callback&&(s=n.callbackList,null===s&&(s=n.callbackList=[]),s.push(u)),null!==u.capturedValue&&(s=n.capturedValues,null===s?n.capturedValues=[u.capturedValue]:s.push(u.capturedValue));u=u.next}return null!==n.callbackList?t.effectTag|=32:null!==n.first||n.hasForceUpdate||null!==n.capturedValues||(t.updateQueue=null),l||(n.baseState=e),e}function ht(e,t){var n=e.callbackList;if(null!==n)for(e.callbackList=null,e=0;e<n.length;e++){var o=n[e],a=o.callback;o.callback=null,"function"!=typeof a&&r("191",a),a.call(t)}}function mt(e,t,n,r,o){function a(e,t,n,r,o,a){if(null===t||null!==e.updateQueue&&e.updateQueue.hasForceUpdate)return!0;var i=e.stateNode;return e=e.type,"function"==typeof i.shouldComponentUpdate?i.shouldComponentUpdate(n,o,a):!e.prototype||!e.prototype.isPureReactComponent||(!hn(t,n)||!hn(r,o))}function i(e,t){t.updater=h,e.stateNode=t,t._reactInternalFiber=e}function u(e,t,n,r){e=t.state,"function"==typeof t.componentWillReceiveProps&&t.componentWillReceiveProps(n,r),"function"==typeof t.UNSAFE_componentWillReceiveProps&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&h.enqueueReplaceState(t,t.state,null)}function l(e,t,n,r){if(e=e.type,"function"==typeof e.getDerivedStateFromProps)return e.getDerivedStateFromProps.call(null,n,r)}var s=e.cacheContext,c=e.getMaskedContext,f=e.getUnmaskedContext,p=e.isContextConsumer,d=e.hasContextChanged,h={isMounted:Re,enqueueSetState:function(e,r,o){e=e._reactInternalFiber,o=void 0===o?null:o;var a=n(e);ft(e,{expirationTime:a,partialState:r,callback:o,isReplace:!1,isForced:!1,capturedValue:null,next:null}),t(e,a)},enqueueReplaceState:function(e,r,o){e=e._reactInternalFiber,o=void 0===o?null:o;var a=n(e);ft(e,{expirationTime:a,partialState:r,callback:o,isReplace:!0,isForced:!1,capturedValue:null,next:null}),t(e,a)},enqueueForceUpdate:function(e,r){e=e._reactInternalFiber,r=void 0===r?null:r;var o=n(e);ft(e,{expirationTime:o,partialState:null,callback:r,isReplace:!1,isForced:!0,capturedValue:null,next:null}),t(e,o)}};return{adoptClassInstance:i,callGetDerivedStateFromProps:l,constructClassInstance:function(e,t){var n=e.type,r=f(e),o=p(e),a=o?c(e,r):vn;n=new n(t,a);var u=null!==n.state&&void 0!==n.state?n.state:null;return i(e,n),e.memoizedState=u,t=l(e,n,t,u),null!==t&&void 0!==t&&(e.memoizedState=fn({},e.memoizedState,t)),o&&s(e,r,a),n},mountClassInstance:function(e,t){var n=e.type,r=e.alternate,o=e.stateNode,a=e.pendingProps,i=f(e);o.props=a,o.state=e.memoizedState,o.refs=vn,o.context=c(e,i),"function"==typeof n.getDerivedStateFromProps||"function"==typeof o.getSnapshotBeforeUpdate||"function"!=typeof o.UNSAFE_componentWillMount&&"function"!=typeof o.componentWillMount||(n=o.state,"function"==typeof o.componentWillMount&&o.componentWillMount(),"function"==typeof o.UNSAFE_componentWillMount&&o.UNSAFE_componentWillMount(),n!==o.state&&h.enqueueReplaceState(o,o.state,null),null!==(n=e.updateQueue)&&(o.state=dt(r,e,n,o,a,t))),"function"==typeof o.componentDidMount&&(e.effectTag|=4)},resumeMountClassInstance:function(e,t){var n=e.type,i=e.stateNode;i.props=e.memoizedProps,i.state=e.memoizedState;var s=e.memoizedProps,p=e.pendingProps,h=i.context,m=f(e);m=c(e,m),(n="function"==typeof n.getDerivedStateFromProps||"function"==typeof i.getSnapshotBeforeUpdate)||"function"!=typeof i.UNSAFE_componentWillReceiveProps&&"function"!=typeof i.componentWillReceiveProps||(s!==p||h!==m)&&u(e,i,p,m),h=e.memoizedState,t=null!==e.updateQueue?dt(null,e,e.updateQueue,i,p,t):h;var v=void 0;if(s!==p&&(v=l(e,i,p,t)),null!==v&&void 0!==v){t=null===t||void 0===t?v:fn({},t,v);var y=e.updateQueue;null!==y&&(y.baseState=fn({},y.baseState,v))}return s!==p||h!==t||d()||null!==e.updateQueue&&e.updateQueue.hasForceUpdate?((s=a(e,s,p,h,t,m))?(n||"function"!=typeof i.UNSAFE_componentWillMount&&"function"!=typeof i.componentWillMount||("function"==typeof i.componentWillMount&&i.componentWillMount(),"function"==typeof i.UNSAFE_componentWillMount&&i.UNSAFE_componentWillMount()),"function"==typeof i.componentDidMount&&(e.effectTag|=4)):("function"==typeof i.componentDidMount&&(e.effectTag|=4),r(e,p),o(e,t)),i.props=p,i.state=t,i.context=m,s):("function"==typeof i.componentDidMount&&(e.effectTag|=4),!1)},updateClassInstance:function(e,t,n){var i=t.type,s=t.stateNode;s.props=t.memoizedProps,s.state=t.memoizedState;var p=t.memoizedProps,h=t.pendingProps,m=s.context,v=f(t);v=c(t,v),(i="function"==typeof i.getDerivedStateFromProps||"function"==typeof s.getSnapshotBeforeUpdate)||"function"!=typeof s.UNSAFE_componentWillReceiveProps&&"function"!=typeof s.componentWillReceiveProps||(p!==h||m!==v)&&u(t,s,h,v),m=t.memoizedState,n=null!==t.updateQueue?dt(e,t,t.updateQueue,s,h,n):m;var y=void 0;if(p!==h&&(y=l(t,s,h,n)),null!==y&&void 0!==y){n=null===n||void 0===n?y:fn({},n,y);var b=t.updateQueue;null!==b&&(b.baseState=fn({},b.baseState,y))}return p!==h||m!==n||d()||null!==t.updateQueue&&t.updateQueue.hasForceUpdate?((y=a(t,p,h,m,n,v))?(i||"function"!=typeof s.UNSAFE_componentWillUpdate&&"function"!=typeof s.componentWillUpdate||("function"==typeof s.componentWillUpdate&&s.componentWillUpdate(h,n,v),"function"==typeof s.UNSAFE_componentWillUpdate&&s.UNSAFE_componentWillUpdate(h,n,v)),"function"==typeof s.componentDidUpdate&&(t.effectTag|=4),"function"==typeof s.getSnapshotBeforeUpdate&&(t.effectTag|=2048)):("function"!=typeof s.componentDidUpdate||p===e.memoizedProps&&m===e.memoizedState||(t.effectTag|=4),"function"!=typeof s.getSnapshotBeforeUpdate||p===e.memoizedProps&&m===e.memoizedState||(t.effectTag|=2048),r(t,h),o(t,n)),s.props=h,s.state=n,s.context=v,y):("function"!=typeof s.componentDidUpdate||p===e.memoizedProps&&m===e.memoizedState||(t.effectTag|=4),"function"!=typeof s.getSnapshotBeforeUpdate||p===e.memoizedProps&&m===e.memoizedState||(t.effectTag|=2048),!1)}}}function vt(e,t,n){if(null!==(e=n.ref)&&"function"!=typeof e&&"object"!=typeof e){if(n._owner){n=n._owner;var o=void 0;n&&(2!==n.tag&&r("110"),o=n.stateNode),o||r("147",e);var a=""+e;return null!==t&&null!==t.ref&&t.ref._stringRef===a?t.ref:(t=function(e){var t=o.refs===vn?o.refs={}:o.refs;null===e?delete t[a]:t[a]=e},t._stringRef=a,t)}"string"!=typeof e&&r("148"),n._owner||r("254",e)}return e}function yt(e,t){"textarea"!==e.type&&r("31","[object Object]"===Object.prototype.toString.call(t)?"object with keys {"+Object.keys(t).join(", ")+"}":t,"")}function bt(e){function t(t,n){if(e){var r=t.lastEffect;null!==r?(r.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n,n.nextEffect=null,n.effectTag=8}}function n(n,r){if(!e)return null;for(;null!==r;)t(n,r),r=r.sibling;return null}function o(e,t){for(e=new Map;null!==t;)null!==t.key?e.set(t.key,t):e.set(t.index,t),t=t.sibling;return e}function a(e,t,n){return e=Ze(e,t,n),e.index=0,e.sibling=null,e}function i(t,n,r){return t.index=r,e?null!==(r=t.alternate)?(r=r.index,r<n?(t.effectTag=2,n):r):(t.effectTag=2,n):n}function u(t){return e&&null===t.alternate&&(t.effectTag=2),t}function l(e,t,n,r){return null===t||6!==t.tag?(t=nt(n,e.mode,r),t.return=e,t):(t=a(t,n,r),t.return=e,t)}function s(e,t,n,r){return null!==t&&t.type===n.type?(r=a(t,n.props,r),r.ref=vt(e,t,n),r.return=e,r):(r=et(n,e.mode,r),r.ref=vt(e,t,n),r.return=e,r)}function c(e,t,n,r){return null===t||4!==t.tag||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=rt(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[],r),t.return=e,t)}function f(e,t,n,r,o){return null===t||10!==t.tag?(t=tt(n,e.mode,r,o),t.return=e,t):(t=a(t,n,r),t.return=e,t)}function p(e,t,n){if("string"==typeof t||"number"==typeof t)return t=nt(""+t,e.mode,n),t.return=e,t;if("object"==typeof t&&null!==t){switch(t.$$typeof){case ur:return n=et(t,e.mode,n),n.ref=vt(e,null,t),n.return=e,n;case cr:return t=rt(t,e.mode,n),t.return=e,t}if(vo(t)||re(t))return t=tt(t,e.mode,n,null),t.return=e,t;yt(e,t)}return null}function d(e,t,n,r){var o=null!==t?t.key:null;if("string"==typeof n||"number"==typeof n)return null!==o?null:l(e,t,""+n,r);if("object"==typeof n&&null!==n){switch(n.$$typeof){case ur:return n.key===o?n.type===fr?f(e,t,n.props.children,r,o):s(e,t,n,r):null;case cr:return n.key===o?c(e,t,n,r):null}if(vo(n)||re(n))return null!==o?null:f(e,t,n,r,null);yt(e,n)}return null}function h(e,t,n,r,o){if("string"==typeof r||"number"==typeof r)return e=e.get(n)||null,l(t,e,""+r,o);if("object"==typeof r&&null!==r){switch(r.$$typeof){case ur:return e=e.get(null===r.key?n:r.key)||null,r.type===fr?f(t,e,r.props.children,o,r.key):s(t,e,r,o);case cr:return e=e.get(null===r.key?n:r.key)||null,c(t,e,r,o)}if(vo(r)||re(r))return e=e.get(n)||null,f(t,e,r,o,null);yt(t,r)}return null}function m(r,a,u,l){for(var s=null,c=null,f=a,m=a=0,v=null;null!==f&&m<u.length;m++){f.index>m?(v=f,f=null):v=f.sibling;var y=d(r,f,u[m],l);if(null===y){null===f&&(f=v);break}e&&f&&null===y.alternate&&t(r,f),a=i(y,a,m),null===c?s=y:c.sibling=y,c=y,f=v}if(m===u.length)return n(r,f),s;if(null===f){for(;m<u.length;m++)(f=p(r,u[m],l))&&(a=i(f,a,m),null===c?s=f:c.sibling=f,c=f);return s}for(f=o(r,f);m<u.length;m++)(v=h(f,r,m,u[m],l))&&(e&&null!==v.alternate&&f.delete(null===v.key?m:v.key),a=i(v,a,m),null===c?s=v:c.sibling=v,c=v);return e&&f.forEach(function(e){return t(r,e)}),s}function v(a,u,l,s){var c=re(l);"function"!=typeof c&&r("150"),null==(l=c.call(l))&&r("151");for(var f=c=null,m=u,v=u=0,y=null,b=l.next();null!==m&&!b.done;v++,b=l.next()){m.index>v?(y=m,m=null):y=m.sibling;var g=d(a,m,b.value,s);if(null===g){m||(m=y);break}e&&m&&null===g.alternate&&t(a,m),u=i(g,u,v),null===f?c=g:f.sibling=g,f=g,m=y}if(b.done)return n(a,m),c;if(null===m){for(;!b.done;v++,b=l.next())null!==(b=p(a,b.value,s))&&(u=i(b,u,v),null===f?c=b:f.sibling=b,f=b);return c}for(m=o(a,m);!b.done;v++,b=l.next())null!==(b=h(m,a,v,b.value,s))&&(e&&null!==b.alternate&&m.delete(null===b.key?v:b.key),u=i(b,u,v),null===f?c=b:f.sibling=b,f=b);return e&&m.forEach(function(e){return t(a,e)}),c}return function(e,o,i,l){"object"==typeof i&&null!==i&&i.type===fr&&null===i.key&&(i=i.props.children);var s="object"==typeof i&&null!==i;if(s)switch(i.$$typeof){case ur:e:{var c=i.key;for(s=o;null!==s;){if(s.key===c){if(10===s.tag?i.type===fr:s.type===i.type){n(e,s.sibling),o=a(s,i.type===fr?i.props.children:i.props,l),o.ref=vt(e,s,i),o.return=e,e=o;break e}n(e,s);break}t(e,s),s=s.sibling}i.type===fr?(o=tt(i.props.children,e.mode,l,i.key),o.return=e,e=o):(l=et(i,e.mode,l),l.ref=vt(e,o,i),l.return=e,e=l)}return u(e);case cr:e:{for(s=i.key;null!==o;){if(o.key===s){if(4===o.tag&&o.stateNode.containerInfo===i.containerInfo&&o.stateNode.implementation===i.implementation){n(e,o.sibling),o=a(o,i.children||[],l),o.return=e,e=o;break e}n(e,o);break}t(e,o),o=o.sibling}o=rt(i,e.mode,l),o.return=e,e=o}return u(e)}if("string"==typeof i||"number"==typeof i)return i=""+i,null!==o&&6===o.tag?(n(e,o.sibling),o=a(o,i,l)):(n(e,o),o=nt(i,e.mode,l)),o.return=e,e=o,u(e);if(vo(i))return m(e,o,i,l);if(re(i))return v(e,o,i,l);if(s&&yt(e,i),void 0===i)switch(e.tag){case 2:case 1:l=e.type,r("152",l.displayName||l.name||"Component")}return n(e,o)}}function gt(e,t,n,o,a,i,u){function l(e,t,n){s(e,t,n,t.expirationTime)}function s(e,t,n,r){t.child=null===e?bo(t,null,n,r):yo(t,e.child,n,r)}function c(e,t){var n=t.ref;(null===e&&null!==n||null!==e&&e.ref!==n)&&(t.effectTag|=128)}function f(e,t,n,r,o,a){if(c(e,t),!n&&!o)return r&&P(t,!1),m(e,t);n=t.stateNode,ar.current=t;var i=o?null:n.render();return t.effectTag|=1,o&&(s(e,t,null,a),t.child=null),s(e,t,i,a),t.memoizedState=n.state,t.memoizedProps=n.props,r&&P(t,!0),t.child}function p(e){var t=e.stateNode;t.pendingContext?x(e,t.pendingContext,t.pendingContext!==t.context):t.context&&x(e,t.context,!1),g(e,t.containerInfo)}function d(e,t,n,r){var o=e.child;for(null!==o&&(o.return=e);null!==o;){switch(o.tag){case 12:var a=0|o.stateNode;if(o.type===t&&0!=(a&n)){for(a=o;null!==a;){var i=a.alternate;if(0===a.expirationTime||a.expirationTime>r)a.expirationTime=r,null!==i&&(0===i.expirationTime||i.expirationTime>r)&&(i.expirationTime=r);else{if(null===i||!(0===i.expirationTime||i.expirationTime>r))break;i.expirationTime=r}a=a.return}a=null}else a=o.child;break;case 13:a=o.type===e.type?null:o.child;break;default:a=o.child}if(null!==a)a.return=o;else for(a=o;null!==a;){if(a===e){a=null;break}if(null!==(o=a.sibling)){a=o;break}a=a.return}o=a}}function h(e,t,n){var r=t.type._context,o=t.pendingProps,a=t.memoizedProps;if(!O()&&a===o)return t.stateNode=0,E(t),m(e,t);var i=o.value;if(t.memoizedProps=o,null===a)i=1073741823;else if(a.value===o.value){if(a.children===o.children)return t.stateNode=0,E(t),m(e,t);i=0}else{var u=a.value;if(u===i&&(0!==u||1/u==1/i)||u!==u&&i!==i){if(a.children===o.children)return t.stateNode=0,E(t),m(e,t);i=0}else if(i="function"==typeof r._calculateChangedBits?r._calculateChangedBits(u,i):1073741823,0===(i|=0)){if(a.children===o.children)return t.stateNode=0,E(t),m(e,t)}else d(t,r,i,n)}return t.stateNode=i,E(t),l(e,t,o.children),t.child}function m(e,t){if(null!==e&&t.child!==e.child&&r("153"),null!==t.child){e=t.child;var n=Ze(e,e.pendingProps,e.expirationTime);for(t.child=n,n.return=t;null!==e.sibling;)e=e.sibling,n=n.sibling=Ze(e,e.pendingProps,e.expirationTime),n.return=t;n.sibling=null}return t.child}var v=e.shouldSetTextContent,y=e.shouldDeprioritizeSubtree,b=t.pushHostContext,g=t.pushHostContainer,E=o.pushProvider,_=n.getMaskedContext,w=n.getUnmaskedContext,O=n.hasContextChanged,C=n.pushContextProvider,x=n.pushTopLevelContextObject,P=n.invalidateContextProvider,S=a.enterHydrationState,k=a.resetHydrationState,T=a.tryToClaimNextHydratableInstance;e=mt(n,i,u,function(e,t){e.memoizedProps=t},function(e,t){e.memoizedState=t});var j=e.adoptClassInstance,N=e.callGetDerivedStateFromProps,R=e.constructClassInstance,M=e.mountClassInstance,A=e.resumeMountClassInstance,U=e.updateClassInstance;return{beginWork:function(e,t,n){if(0===t.expirationTime||t.expirationTime>n){switch(t.tag){case 3:p(t);break;case 2:C(t);break;case 4:g(t,t.stateNode.containerInfo);break;case 13:E(t)}return null}switch(t.tag){case 0:null!==e&&r("155");var o=t.type,a=t.pendingProps,i=w(t);return i=_(t,i),o=o(a,i),t.effectTag|=1,"object"==typeof o&&null!==o&&"function"==typeof o.render&&void 0===o.$$typeof?(i=t.type,t.tag=2,t.memoizedState=null!==o.state&&void 0!==o.state?o.state:null,"function"==typeof i.getDerivedStateFromProps&&null!==(a=N(t,o,a,t.memoizedState))&&void 0!==a&&(t.memoizedState=fn({},t.memoizedState,a)),a=C(t),j(t,o),M(t,n),e=f(e,t,!0,a,!1,n)):(t.tag=1,l(e,t,o),t.memoizedProps=a,e=t.child),e;case 1:return a=t.type,n=t.pendingProps,O()||t.memoizedProps!==n?(o=w(t),o=_(t,o),a=a(n,o),t.effectTag|=1,l(e,t,a),t.memoizedProps=n,e=t.child):e=m(e,t),e;case 2:a=C(t),null===e?null===t.stateNode?(R(t,t.pendingProps),M(t,n),o=!0):o=A(t,n):o=U(e,t,n),i=!1;var u=t.updateQueue;return null!==u&&null!==u.capturedValues&&(i=o=!0),f(e,t,o,a,i,n);case 3:e:if(p(t),null!==(o=t.updateQueue)){if(i=t.memoizedState,a=dt(e,t,o,null,null,n),t.memoizedState=a,null!==(o=t.updateQueue)&&null!==o.capturedValues)o=null;else{if(i===a){k(),e=m(e,t);break e}o=a.element}i=t.stateNode,(null===e||null===e.child)&&i.hydrate&&S(t)?(t.effectTag|=2,t.child=bo(t,null,o,n)):(k(),l(e,t,o)),t.memoizedState=a,e=t.child}else k(),e=m(e,t);return e;case 5:return b(t),null===e&&T(t),a=t.type,u=t.memoizedProps,o=t.pendingProps,i=null!==e?e.memoizedProps:null,O()||u!==o||((u=1&t.mode&&y(a,o))&&(t.expirationTime=1073741823),u&&1073741823===n)?(u=o.children,v(a,o)?u=null:i&&v(a,i)&&(t.effectTag|=16),c(e,t),1073741823!==n&&1&t.mode&&y(a,o)?(t.expirationTime=1073741823,t.memoizedProps=o,e=null):(l(e,t,u),t.memoizedProps=o,e=t.child)):e=m(e,t),e;case 6:return null===e&&T(t),t.memoizedProps=t.pendingProps,null;case 8:t.tag=7;case 7:return a=t.pendingProps,O()||t.memoizedProps!==a||(a=t.memoizedProps),o=a.children,t.stateNode=null===e?bo(t,t.stateNode,o,n):yo(t,e.stateNode,o,n),t.memoizedProps=a,t.stateNode;case 9:return null;case 4:return g(t,t.stateNode.containerInfo),a=t.pendingProps,O()||t.memoizedProps!==a?(null===e?t.child=yo(t,null,a,n):l(e,t,a),t.memoizedProps=a,e=t.child):e=m(e,t),e;case 14:return n=t.type.render,n=n(t.pendingProps,t.ref),l(e,t,n),t.memoizedProps=n,t.child;case 10:return n=t.pendingProps,O()||t.memoizedProps!==n?(l(e,t,n),t.memoizedProps=n,e=t.child):e=m(e,t),e;case 11:return n=t.pendingProps.children,O()||null!==n&&t.memoizedProps!==n?(l(e,t,n),t.memoizedProps=n,e=t.child):e=m(e,t),e;case 13:return h(e,t,n);case 12:o=t.type,i=t.pendingProps;var s=t.memoizedProps;return a=o._currentValue,u=o._changedBits,O()||0!==u||s!==i?(t.memoizedProps=i,s=i.unstable_observedBits,void 0!==s&&null!==s||(s=1073741823),t.stateNode=s,0!=(u&s)&&d(t,o,u,n),n=i.children,n=n(a),l(e,t,n),e=t.child):e=m(e,t),e;default:r("156")}}}}function Et(e,t,n,o,a){function i(e){e.effectTag|=4}var u=e.createInstance,l=e.createTextInstance,s=e.appendInitialChild,c=e.finalizeInitialChildren,f=e.prepareUpdate,p=e.persistence,d=t.getRootHostContainer,h=t.popHostContext,m=t.getHostContext,v=t.popHostContainer,y=n.popContextProvider,b=n.popTopLevelContextObject,g=o.popProvider,E=a.prepareToHydrateHostInstance,_=a.prepareToHydrateHostTextInstance,w=a.popHydrationState,O=void 0,C=void 0,x=void 0;return e.mutation?(O=function(){},C=function(e,t,n){(t.updateQueue=n)&&i(t)},x=function(e,t,n,r){n!==r&&i(t)}):r(p?"235":"236"),{completeWork:function(e,t,n){var o=t.pendingProps;switch(t.tag){case 1:return null;case 2:return y(t),e=t.stateNode,o=t.updateQueue,null!==o&&null!==o.capturedValues&&(t.effectTag&=-65,"function"==typeof e.componentDidCatch?t.effectTag|=256:o.capturedValues=null),null;case 3:return v(t),b(t),o=t.stateNode,o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),null!==e&&null!==e.child||(w(t),t.effectTag&=-3),O(t),e=t.updateQueue,null!==e&&null!==e.capturedValues&&(t.effectTag|=256),null;case 5:h(t),n=d();var a=t.type;if(null!==e&&null!=t.stateNode){var p=e.memoizedProps,P=t.stateNode,S=m();P=f(P,a,p,o,n,S),C(e,t,P,a,p,o,n,S),e.ref!==t.ref&&(t.effectTag|=128)}else{if(!o)return null===t.stateNode&&r("166"),null;if(e=m(),w(t))E(t,n,e)&&i(t);else{p=u(a,o,n,e,t);e:for(S=t.child;null!==S;){if(5===S.tag||6===S.tag)s(p,S.stateNode);else if(4!==S.tag&&null!==S.child){S.child.return=S,S=S.child;continue}if(S===t)break;for(;null===S.sibling;){if(null===S.return||S.return===t)break e;S=S.return}S.sibling.return=S.return,S=S.sibling}c(p,a,o,n,e)&&i(t),t.stateNode=p}null!==t.ref&&(t.effectTag|=128)}return null;case 6:if(e&&null!=t.stateNode)x(e,t,e.memoizedProps,o);else{if("string"!=typeof o)return null===t.stateNode&&r("166"),null;e=d(),n=m(),w(t)?_(t)&&i(t):t.stateNode=l(o,e,n,t)}return null;case 7:(o=t.memoizedProps)||r("165"),t.tag=8,a=[];e:for((p=t.stateNode)&&(p.return=t);null!==p;){if(5===p.tag||6===p.tag||4===p.tag)r("247");else if(9===p.tag)a.push(p.pendingProps.value);else if(null!==p.child){p.child.return=p,p=p.child;continue}for(;null===p.sibling;){if(null===p.return||p.return===t)break e;p=p.return}p.sibling.return=p.return,p=p.sibling}return p=o.handler,o=p(o.props,a),t.child=yo(t,null!==e?e.child:null,o,n),t.child;case 8:return t.tag=7,null;case 9:case 14:case 10:case 11:return null;case 4:return v(t),O(t),null;case 13:return g(t),null;case 12:return null;case 0:r("167");default:r("156")}}}}function _t(e,t,n,r,o){var a=e.popHostContainer,i=e.popHostContext,u=t.popContextProvider,l=t.popTopLevelContextObject,s=n.popProvider;return{throwException:function(e,t,n){t.effectTag|=512,t.firstEffect=t.lastEffect=null,t={value:n,source:t,stack:ae(t)};do{switch(e.tag){case 3:return ct(e),e.updateQueue.capturedValues=[t],void(e.effectTag|=1024);case 2:if(n=e.stateNode,0==(64&e.effectTag)&&null!==n&&"function"==typeof n.componentDidCatch&&!o(n)){ct(e),n=e.updateQueue;var r=n.capturedValues;return null===r?n.capturedValues=[t]:r.push(t),void(e.effectTag|=1024)}}e=e.return}while(null!==e)},unwindWork:function(e){switch(e.tag){case 2:u(e);var t=e.effectTag;return 1024&t?(e.effectTag=-1025&t|64,e):null;case 3:return a(e),l(e),t=e.effectTag,1024&t?(e.effectTag=-1025&t|64,e):null;case 5:return i(e),null;case 4:return a(e),null;case 13:return s(e),null;default:return null}},unwindInterruptedWork:function(e){switch(e.tag){case 2:u(e);break;case 3:a(e),l(e);break;case 5:i(e);break;case 4:a(e);break;case 13:s(e)}}}}function wt(e,t){var n=t.source;null===t.stack&&ae(n),null!==n&&oe(n),t=t.value,null!==e&&2===e.tag&&oe(e);try{t&&t.suppressReactErrorLogging||console.error(t)}catch(e){e&&e.suppressReactErrorLogging||console.error(e)}}function Ot(e,t,n,o,a){function i(e){var n=e.ref;if(null!==n)if("function"==typeof n)try{n(null)}catch(n){t(e,n)}else n.current=null}function u(e){switch("function"==typeof ut&&ut(e),e.tag){case 2:i(e);var n=e.stateNode;if("function"==typeof n.componentWillUnmount)try{n.props=e.memoizedProps,n.state=e.memoizedState,n.componentWillUnmount()}catch(n){t(e,n)}break;case 5:i(e);break;case 7:l(e.stateNode);break;case 4:p&&c(e)}}function l(e){for(var t=e;;)if(u(t),null===t.child||p&&4===t.tag){if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}else t.child.return=t,t=t.child}function s(e){return 5===e.tag||3===e.tag||4===e.tag}function c(e){for(var t=e,n=!1,o=void 0,a=void 0;;){if(!n){n=t.return;e:for(;;){switch(null===n&&r("160"),n.tag){case 5:o=n.stateNode,a=!1;break e;case 3:case 4:o=n.stateNode.containerInfo,a=!0;break e}n=n.return}n=!0}if(5===t.tag||6===t.tag)l(t),a?w(o,t.stateNode):_(o,t.stateNode);else if(4===t.tag?o=t.stateNode.containerInfo:u(t),null!==t.child){t.child.return=t,t=t.child;continue}if(t===e)break;for(;null===t.sibling;){if(null===t.return||t.return===e)return;t=t.return,4===t.tag&&(n=!1)}t.sibling.return=t.return,t=t.sibling}}var f=e.getPublicInstance,p=e.mutation;e=e.persistence,p||r(e?"235":"236");var d=p.commitMount,h=p.commitUpdate,m=p.resetTextContent,v=p.commitTextUpdate,y=p.appendChild,b=p.appendChildToContainer,g=p.insertBefore,E=p.insertInContainerBefore,_=p.removeChild,w=p.removeChildFromContainer;return{commitBeforeMutationLifeCycles:function(e,t){switch(t.tag){case 2:if(2048&t.effectTag&&null!==e){var n=e.memoizedProps,o=e.memoizedState;e=t.stateNode,e.props=t.memoizedProps,e.state=t.memoizedState,t=e.getSnapshotBeforeUpdate(n,o),e.__reactInternalSnapshotBeforeUpdate=t}break;case 3:case 5:case 6:case 4:break;default:r("163")}},commitResetTextContent:function(e){m(e.stateNode)},commitPlacement:function(e){e:{for(var t=e.return;null!==t;){if(s(t)){var n=t;break e}t=t.return}r("160"),n=void 0}var o=t=void 0;switch(n.tag){case 5:t=n.stateNode,o=!1;break;case 3:case 4:t=n.stateNode.containerInfo,o=!0;break;default:r("161")}16&n.effectTag&&(m(t),n.effectTag&=-17);e:t:for(n=e;;){for(;null===n.sibling;){if(null===n.return||s(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;5!==n.tag&&6!==n.tag;){if(2&n.effectTag)continue t;if(null===n.child||4===n.tag)continue t;n.child.return=n,n=n.child}if(!(2&n.effectTag)){n=n.stateNode;break e}}for(var a=e;;){if(5===a.tag||6===a.tag)n?o?E(t,a.stateNode,n):g(t,a.stateNode,n):o?b(t,a.stateNode):y(t,a.stateNode);else if(4!==a.tag&&null!==a.child){a.child.return=a,a=a.child;continue}if(a===e)break;for(;null===a.sibling;){if(null===a.return||a.return===e)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},commitDeletion:function(e){c(e),e.return=null,e.child=null,e.alternate&&(e.alternate.child=null,e.alternate.return=null)},commitWork:function(e,t){switch(t.tag){case 2:break;case 5:var n=t.stateNode;if(null!=n){var o=t.memoizedProps;e=null!==e?e.memoizedProps:o;var a=t.type,i=t.updateQueue;t.updateQueue=null,null!==i&&h(n,i,a,e,o,t)}break;case 6:null===t.stateNode&&r("162"),n=t.memoizedProps,v(t.stateNode,null!==e?e.memoizedProps:n,n);break;case 3:break;default:r("163")}},commitLifeCycles:function(e,t,n){switch(n.tag){case 2:if(e=n.stateNode,4&n.effectTag)if(null===t)e.props=n.memoizedProps,e.state=n.memoizedState,e.componentDidMount();else{var o=t.memoizedProps;t=t.memoizedState,e.props=n.memoizedProps,e.state=n.memoizedState,e.componentDidUpdate(o,t,e.__reactInternalSnapshotBeforeUpdate)}n=n.updateQueue,null!==n&&ht(n,e);break;case 3:if(null!==(t=n.updateQueue)){if(e=null,null!==n.child)switch(n.child.tag){case 5:e=f(n.child.stateNode);break;case 2:e=n.child.stateNode}ht(t,e)}break;case 5:e=n.stateNode,null===t&&4&n.effectTag&&d(e,n.type,n.memoizedProps,n);break;case 6:case 4:break;default:r("163")}},commitErrorLogging:function(e,t){switch(e.tag){case 2:var n=e.type;t=e.stateNode;var o=e.updateQueue;(null===o||null===o.capturedValues)&&r("264");var i=o.capturedValues;for(o.capturedValues=null,"function"!=typeof n.getDerivedStateFromCatch&&a(t),t.props=e.memoizedProps,t.state=e.memoizedState,n=0;n<i.length;n++){o=i[n];var u=o.value,l=o.stack;wt(e,o),t.componentDidCatch(u,{componentStack:null!==l?l:""})}break;case 3:for(n=e.updateQueue,(null===n||null===n.capturedValues)&&r("264"),i=n.capturedValues,n.capturedValues=null,n=0;n<i.length;n++)o=i[n],wt(e,o),t(o.value);break;default:r("265")}},commitAttachRef:function(e){var t=e.ref;if(null!==t){var n=e.stateNode;switch(e.tag){case 5:e=f(n);break;default:e=n}"function"==typeof t?t(e):t.current=e}},commitDetachRef:function(e){null!==(e=e.ref)&&("function"==typeof e?e(null):e.current=null)}}}function Ct(e,t){function n(e){return e===go&&r("174"),e}var o=e.getChildHostContext,a=e.getRootHostContext;e=t.createCursor;var i=t.push,u=t.pop,l=e(go),s=e(go),c=e(go);return{getHostContext:function(){return n(l.current)},getRootHostContainer:function(){return n(c.current)},popHostContainer:function(e){u(l,e),u(s,e),u(c,e)},popHostContext:function(e){s.current===e&&(u(l,e),u(s,e))},pushHostContainer:function(e,t){i(c,t,e),i(s,e,e),i(l,go,e),t=a(t),u(l,e),i(l,t,e)},pushHostContext:function(e){var t=n(c.current),r=n(l.current);t=o(r,e.type,t),r!==t&&(i(s,e,e),i(l,t,e))}}}function xt(e){function t(e,t){var n=new Xe(5,null,null,0);n.type="DELETED",n.stateNode=t,n.return=e,n.effectTag=8,null!==e.lastEffect?(e.lastEffect.nextEffect=n,e.lastEffect=n):e.firstEffect=e.lastEffect=n}function n(e,t){switch(e.tag){case 5:return null!==(t=i(t,e.type,e.pendingProps))&&(e.stateNode=t,!0);case 6:return null!==(t=u(t,e.pendingProps))&&(e.stateNode=t,!0);default:return!1}}function o(e){for(e=e.return;null!==e&&5!==e.tag&&3!==e.tag;)e=e.return;p=e}var a=e.shouldSetTextContent;if(!(e=e.hydration))return{enterHydrationState:function(){return!1},resetHydrationState:function(){},tryToClaimNextHydratableInstance:function(){},prepareToHydrateHostInstance:function(){r("175")},prepareToHydrateHostTextInstance:function(){r("176")},popHydrationState:function(){return!1}};var i=e.canHydrateInstance,u=e.canHydrateTextInstance,l=e.getNextHydratableSibling,s=e.getFirstHydratableChild,c=e.hydrateInstance,f=e.hydrateTextInstance,p=null,d=null,h=!1;return{enterHydrationState:function(e){return d=s(e.stateNode.containerInfo),p=e,h=!0},resetHydrationState:function(){d=p=null,h=!1},tryToClaimNextHydratableInstance:function(e){if(h){var r=d;if(r){if(!n(e,r)){if(!(r=l(r))||!n(e,r))return e.effectTag|=2,h=!1,void(p=e);t(p,d)}p=e,d=s(r)}else e.effectTag|=2,h=!1,p=e}},prepareToHydrateHostInstance:function(e,t,n){return t=c(e.stateNode,e.type,e.memoizedProps,t,n,e),e.updateQueue=t,null!==t},prepareToHydrateHostTextInstance:function(e){return f(e.stateNode,e.memoizedProps,e)},popHydrationState:function(e){if(e!==p)return!1;if(!h)return o(e),h=!0,!1;var n=e.type;if(5!==e.tag||"head"!==n&&"body"!==n&&!a(n,e.memoizedProps))for(n=d;n;)t(e,n),n=l(n);return o(e),d=p?l(e.stateNode):null,!0}}}function Pt(e){function t(e,t,n){e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=n}function n(e){return 2===e.tag&&null!=e.type.childContextTypes}function o(e,t){var n=e.stateNode,o=e.type.childContextTypes;if("function"!=typeof n.getChildContext)return t;n=n.getChildContext();for(var a in n)a in o||r("108",oe(e)||"Unknown",a);return fn({},t,n)}var a=e.createCursor,i=e.push,u=e.pop,l=a(vn),s=a(!1),c=vn;return{getUnmaskedContext:function(e){return n(e)?c:l.current},cacheContext:t,getMaskedContext:function(e,n){var r=e.type.contextTypes;if(!r)return vn;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===n)return o.__reactInternalMemoizedMaskedChildContext;var a,i={};for(a in r)i[a]=n[a];return o&&t(e,n,i),i},hasContextChanged:function(){return s.current},isContextConsumer:function(e){return 2===e.tag&&null!=e.type.contextTypes},isContextProvider:n,popContextProvider:function(e){n(e)&&(u(s,e),u(l,e))},popTopLevelContextObject:function(e){u(s,e),u(l,e)},pushTopLevelContextObject:function(e,t,n){null!=l.cursor&&r("168"),i(l,t,e),i(s,n,e)},processChildContext:o,pushContextProvider:function(e){if(!n(e))return!1;var t=e.stateNode;return t=t&&t.__reactInternalMemoizedMergedChildContext||vn,c=l.current,i(l,t,e),i(s,s.current,e),!0},invalidateContextProvider:function(e,t){var n=e.stateNode;if(n||r("169"),t){var a=o(e,c);n.__reactInternalMemoizedMergedChildContext=a,u(s,e),u(l,e),i(l,a,e)}else u(s,e);i(s,t,e)},findCurrentUnmaskedContext:function(e){for(2!==Ne(e)||2!==e.tag?r("170"):void 0;3!==e.tag;){if(n(e))return e.stateNode.__reactInternalMemoizedMergedChildContext;(e=e.return)||r("171")}return e.stateNode.context}}}function St(e){var t=e.createCursor,n=e.push,r=e.pop,o=t(null),a=t(null),i=t(0);return{pushProvider:function(e){var t=e.type._context;n(i,t._changedBits,e),n(a,t._currentValue,e),n(o,e,e),t._currentValue=e.pendingProps.value,t._changedBits=e.stateNode},popProvider:function(e){var t=i.current,n=a.current;r(o,e),r(a,e),r(i,e),e=e.type._context,e._currentValue=n,e._changedBits=t}}}function kt(){var e=[],t=-1;return{createCursor:function(e){return{current:e}},isEmpty:function(){return-1===t},pop:function(n){0>t||(n.current=e[t],e[t]=null,t--)},push:function(n,r){t++,e[t]=n.current,n.current=r},checkThatStackIsEmpty:function(){},resetStackAfterFatalErrorInDev:function(){}}}function Tt(e){function t(){if(null!==Z)for(var e=Z.return;null!==e;)R(e),e=e.return;ee=null,te=0,Z=null,oe=!1}function n(e){return null!==ie&&ie.has(e)}function o(e){for(;;){var t=e.alternate,n=e.return,r=e.sibling;if(0==(512&e.effectTag)){t=T(t,e,te);var o=e;if(1073741823===te||1073741823!==o.expirationTime){e:switch(o.tag){case 3:case 2:var a=o.updateQueue;a=null===a?0:a.expirationTime;break e;default:a=0}for(var i=o.child;null!==i;)0!==i.expirationTime&&(0===a||a>i.expirationTime)&&(a=i.expirationTime),i=i.sibling;o.expirationTime=a}if(null!==t)return t;if(null!==n&&0==(512&n.effectTag)&&(null===n.firstEffect&&(n.firstEffect=e.firstEffect),null!==e.lastEffect&&(null!==n.lastEffect&&(n.lastEffect.nextEffect=e.firstEffect),n.lastEffect=e.lastEffect),1<e.effectTag&&(null!==n.lastEffect?n.lastEffect.nextEffect=e:n.firstEffect=e,n.lastEffect=e)),null!==r)return r;if(null===n){oe=!0;break}e=n}else{if(null!==(e=N(e)))return e.effectTag&=2559,e;if(null!==n&&(n.firstEffect=n.lastEffect=null,n.effectTag|=512),null!==r)return r;if(null===n)break;e=n}}return null}function a(e){var t=k(e.alternate,e,te);return null===t&&(t=o(e)),ar.current=null,t}function i(e,n,i){X&&r("243"),X=!0,n===te&&e===ee&&null!==Z||(t(),ee=e,te=n,Z=Ze(ee.current,null,te),e.pendingCommitExpirationTime=0);for(var u=!1;;){try{if(i)for(;null!==Z&&!w();)Z=a(Z);else for(;null!==Z;)Z=a(Z)}catch(e){if(null===Z){u=!0,O(e);break}i=Z;var l=i.return;if(null===l){u=!0,O(e);break}j(l,i,e),Z=o(i)}break}return X=!1,u||null!==Z?null:oe?(e.pendingCommitExpirationTime=n,e.current.alternate):void r("262")}function u(e,t,n,r){e={value:n,source:e,stack:ae(e)},ft(t,{expirationTime:r,partialState:null,callback:null,isReplace:!1,isForced:!1,capturedValue:e,next:null}),c(t,r)}function l(e,t){e:{X&&!re&&r("263");for(var o=e.return;null!==o;){switch(o.tag){case 2:var a=o.stateNode;if("function"==typeof o.type.getDerivedStateFromCatch||"function"==typeof a.componentDidCatch&&!n(a)){u(e,o,t,1),e=void 0;break e}break;case 3:u(e,o,t,1),e=void 0;break e}o=o.return}3===e.tag&&u(e,e,t,1),e=void 0}return e}function s(e){return e=0!==J?J:X?re?1:te:1&e.mode?_e?10*(1+((f()+50)/10|0)):25*(1+((f()+500)/25|0)):1,_e&&(0===he||e>he)&&(he=e),e}function c(e,n){e:{for(;null!==e;){if((0===e.expirationTime||e.expirationTime>n)&&(e.expirationTime=n),null!==e.alternate&&(0===e.alternate.expirationTime||e.alternate.expirationTime>n)&&(e.alternate.expirationTime=n),null===e.return){if(3!==e.tag){n=void 0;break e}var o=e.stateNode;!X&&0!==te&&n<te&&t(),X&&!re&&ee===o||h(o,n),Ce>Oe&&r("185")}e=e.return}n=void 0}return n}function f(){return Y=z()-K,G=2+(Y/10|0)}function p(e,t,n,r,o){var a=J;J=1;try{return e(t,n,r,o)}finally{J=a}}function d(e){if(0!==se){if(e>se)return;W(ce)}var t=z()-K;se=e,ce=B(v,{timeout:10*(e-2)-t})}function h(e,t){if(null===e.nextScheduledRoot)e.remainingExpirationTime=t,null===le?(ue=le=e,e.nextScheduledRoot=e):(le=le.nextScheduledRoot=e,le.nextScheduledRoot=ue);else{var n=e.remainingExpirationTime;(0===n||t<n)&&(e.remainingExpirationTime=t)}fe||(ge?Ee&&(pe=e,de=1,E(e,1,!1)):1===t?y():d(t))}function m(){var e=0,t=null;if(null!==le)for(var n=le,o=ue;null!==o;){var a=o.remainingExpirationTime;if(0===a){if((null===n||null===le)&&r("244"),o===o.nextScheduledRoot){ue=le=o.nextScheduledRoot=null;break}if(o===ue)ue=a=o.nextScheduledRoot,le.nextScheduledRoot=a,o.nextScheduledRoot=null;else{if(o===le){le=n,le.nextScheduledRoot=ue,o.nextScheduledRoot=null;break}n.nextScheduledRoot=o.nextScheduledRoot,o.nextScheduledRoot=null}o=n.nextScheduledRoot}else{if((0===e||a<e)&&(e=a,t=o),o===le)break;n=o,o=o.nextScheduledRoot}}n=pe,null!==n&&n===t&&1===e?Ce++:Ce=0,pe=t,de=e}function v(e){b(0,!0,e)}function y(){b(1,!1,null)}function b(e,t,n){if(be=n,m(),t)for(;null!==pe&&0!==de&&(0===e||e>=de)&&(!me||f()>=de);)E(pe,de,!me),m();else for(;null!==pe&&0!==de&&(0===e||e>=de);)E(pe,de,!1),m();null!==be&&(se=0,ce=-1),0!==de&&d(de),be=null,me=!1,g()}function g(){if(Ce=0,null!==we){var e=we;we=null;for(var t=0;t<e.length;t++){var n=e[t];try{n._onComplete()}catch(e){ve||(ve=!0,ye=e)}}}if(ve)throw e=ye,ye=null,ve=!1,e}function E(e,t,n){fe&&r("245"),fe=!0,n?(n=e.finishedWork,null!==n?_(e,n,t):(e.finishedWork=null,null!==(n=i(e,t,!0))&&(w()?e.finishedWork=n:_(e,n,t)))):(n=e.finishedWork,null!==n?_(e,n,t):(e.finishedWork=null,null!==(n=i(e,t,!1))&&_(e,n,t))),fe=!1}function _(e,t,n){var o=e.firstBatch;if(null!==o&&o._expirationTime<=n&&(null===we?we=[o]:we.push(o),o._defer))return e.finishedWork=t,void(e.remainingExpirationTime=0);e.finishedWork=null,re=X=!0,n=t.stateNode,n.current===t&&r("177"),o=n.pendingCommitExpirationTime,0===o&&r("261"),n.pendingCommitExpirationTime=0;var a=f();if(ar.current=null,1<t.effectTag)if(null!==t.lastEffect){t.lastEffect.nextEffect=t;var i=t.firstEffect}else i=t;else i=t.firstEffect;for(q(n.containerInfo),ne=i;null!==ne;){var u=!1,s=void 0;try{for(;null!==ne;)2048&ne.effectTag&&M(ne.alternate,ne),ne=ne.nextEffect}catch(e){u=!0,s=e}u&&(null===ne&&r("178"),l(ne,s),null!==ne&&(ne=ne.nextEffect))}for(ne=i;null!==ne;){u=!1,s=void 0;try{for(;null!==ne;){var c=ne.effectTag;if(16&c&&A(ne),128&c){var p=ne.alternate;null!==p&&H(p)}switch(14&c){case 2:U(ne),ne.effectTag&=-3;break;case 6:U(ne),ne.effectTag&=-3,L(ne.alternate,ne);break;case 4:L(ne.alternate,ne);break;case 8:I(ne)}ne=ne.nextEffect}}catch(e){u=!0,s=e}u&&(null===ne&&r("178"),l(ne,s),null!==ne&&(ne=ne.nextEffect))}for($(n.containerInfo),n.current=t,ne=i;null!==ne;){c=!1,p=void 0;try{for(i=n,u=a,s=o;null!==ne;){var d=ne.effectTag;36&d&&D(i,ne.alternate,ne,u,s),256&d&&F(ne,O),128&d&&V(ne);var h=ne.nextEffect;ne.nextEffect=null,ne=h}}catch(e){c=!0,p=e}c&&(null===ne&&r("178"),l(ne,p),null!==ne&&(ne=ne.nextEffect))}X=re=!1,"function"==typeof it&&it(t.stateNode),t=n.current.expirationTime,0===t&&(ie=null),e.remainingExpirationTime=t}function w(){return!(null===be||be.timeRemaining()>xe)&&(me=!0)}function O(e){null===pe&&r("246"),pe.remainingExpirationTime=0,ve||(ve=!0,ye=e)}var C=kt(),x=Ct(e,C),P=Pt(C);C=St(C);var S=xt(e),k=gt(e,x,P,C,S,c,s).beginWork,T=Et(e,x,P,C,S).completeWork;x=_t(x,P,C,c,n);var j=x.throwException,N=x.unwindWork,R=x.unwindInterruptedWork;x=Ot(e,l,c,s,function(e){null===ie?ie=new Set([e]):ie.add(e)},f);var M=x.commitBeforeMutationLifeCycles,A=x.commitResetTextContent,U=x.commitPlacement,I=x.commitDeletion,L=x.commitWork,D=x.commitLifeCycles,F=x.commitErrorLogging,V=x.commitAttachRef,H=x.commitDetachRef,z=e.now,B=e.scheduleDeferredCallback,W=e.cancelDeferredCallback,q=e.prepareForCommit,$=e.resetAfterCommit,K=z(),G=2,Y=K,Q=0,J=0,X=!1,Z=null,ee=null,te=0,ne=null,re=!1,oe=!1,ie=null,ue=null,le=null,se=0,ce=-1,fe=!1,pe=null,de=0,he=0,me=!1,ve=!1,ye=null,be=null,ge=!1,Ee=!1,_e=!1,we=null,Oe=1e3,Ce=0,xe=1;return{recalculateCurrentTime:f,computeExpirationForFiber:s,scheduleWork:c,requestWork:h,flushRoot:function(e,t){fe&&r("253"),pe=e,de=t,E(e,t,!1),y(),g()},batchedUpdates:function(e,t){var n=ge;ge=!0;try{return e(t)}finally{(ge=n)||fe||y()}},unbatchedUpdates:function(e,t){if(ge&&!Ee){Ee=!0;try{return e(t)}finally{Ee=!1}}return e(t)},flushSync:function(e,t){fe&&r("187");var n=ge;ge=!0;try{return p(e,t)}finally{ge=n,y()}},flushControlled:function(e){var t=ge;ge=!0;try{p(e)}finally{(ge=t)||fe||b(1,!1,null)}},deferredUpdates:function(e){var t=J;J=25*(1+((f()+500)/25|0));try{return e()}finally{J=t}},syncUpdates:p,interactiveUpdates:function(e,t,n){if(_e)return e(t,n);ge||fe||0===he||(b(he,!1,null),he=0);var r=_e,o=ge;ge=_e=!0;try{return e(t,n)}finally{_e=r,(ge=o)||fe||y()}},flushInteractiveUpdates:function(){fe||0===he||(b(he,!1,null),he=0)},computeUniqueAsyncExpiration:function(){var e=25*(1+((f()+500)/25|0));return e<=Q&&(e=Q+1),Q=e},legacyContext:P}}function jt(e){function t(e,t,n,r,o,a){if(r=t.current,n){n=n._reactInternalFiber;var u=l(n);n=s(n)?c(n,u):u}else n=vn;return null===t.context?t.context=n:t.pendingContext=n,t=a,ft(r,{expirationTime:o,partialState:{element:e},callback:void 0===t?null:t,isReplace:!1,isForced:!1,capturedValue:null,next:null}),i(r,o),o}function n(e){return e=Ue(e),null===e?null:e.stateNode}var r=e.getPublicInstance;e=Tt(e);var o=e.recalculateCurrentTime,a=e.computeExpirationForFiber,i=e.scheduleWork,u=e.legacyContext,l=u.findCurrentUnmaskedContext,s=u.isContextProvider,c=u.processChildContext;return{createContainer:function(e,t,n){return t=new Xe(3,null,null,t?3:0),e={current:t,containerInfo:e,pendingChildren:null,pendingCommitExpirationTime:0,finishedWork:null,context:null,pendingContext:null,hydrate:n,remainingExpirationTime:0,firstBatch:null,nextScheduledRoot:null},t.stateNode=e},updateContainer:function(e,n,r,i){var u=n.current,l=o();return u=a(u),t(e,n,r,l,u,i)},updateContainerAtExpirationTime:function(e,n,r,a,i){return t(e,n,r,o(),a,i)},flushRoot:e.flushRoot,requestWork:e.requestWork,computeUniqueAsyncExpiration:e.computeUniqueAsyncExpiration,batchedUpdates:e.batchedUpdates,unbatchedUpdates:e.unbatchedUpdates,deferredUpdates:e.deferredUpdates,syncUpdates:e.syncUpdates,interactiveUpdates:e.interactiveUpdates,flushInteractiveUpdates:e.flushInteractiveUpdates,flushControlled:e.flushControlled,flushSync:e.flushSync,getPublicRootInstance:function(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return r(e.child.stateNode);default:return e.child.stateNode}},findHostInstance:n,findHostInstanceWithNoPortals:function(e){return e=Ie(e),null===e?null:e.stateNode},injectIntoDevTools:function(e){var t=e.findFiberByHostInstance;return at(fn({},e,{findHostInstanceByFiber:function(e){return n(e)},findFiberByHostInstance:function(e){return t?t(e):null}}))}}}function Nt(e,t,n){var r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:cr,key:null==r?null:""+r,children:e,containerInfo:t,implementation:n}}function Rt(e){var t="";return sn.Children.forEach(e,function(e){null==e||"string"!=typeof e&&"number"!=typeof e||(t+=e)}),t}function Mt(e,t){return e=fn({children:void 0},t),(t=Rt(t.children))&&(e.children=t),e}function At(e,t,n,r){if(e=e.options,t){t={};for(var o=0;o<n.length;o++)t["$"+n[o]]=!0;for(n=0;n<e.length;n++)o=t.hasOwnProperty("$"+e[n].value),e[n].selected!==o&&(e[n].selected=o),o&&r&&(e[n].defaultSelected=!0)}else{for(n=""+n,t=null,o=0;o<e.length;o++){if(e[o].value===n)return e[o].selected=!0,void(r&&(e[o].defaultSelected=!0));null!==t||e[o].disabled||(t=e[o])}null!==t&&(t.selected=!0)}}function Ut(e,t){var n=t.value;e._wrapperState={initialValue:null!=n?n:t.defaultValue,wasMultiple:!!t.multiple}}function It(e,t){return null!=t.dangerouslySetInnerHTML&&r("91"),fn({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Lt(e,t){var n=t.value;null==n&&(n=t.defaultValue,t=t.children,null!=t&&(null!=n&&r("92"),Array.isArray(t)&&(1>=t.length||r("93"),t=t[0]),n=""+t),null==n&&(n="")),e._wrapperState={initialValue:""+n}}function Dt(e,t){var n=t.value;null!=n&&(n=""+n,n!==e.value&&(e.value=n),null==t.defaultValue&&(e.defaultValue=n)),null!=t.defaultValue&&(e.defaultValue=t.defaultValue)}function Ft(e){var t=e.textContent;t===e._wrapperState.initialValue&&(e.value=t)}function Vt(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ht(e,t){return null==e||"http://www.w3.org/1999/xhtml"===e?Vt(t):"http://www.w3.org/2000/svg"===e&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":e}function zt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&3===n.nodeType)return void(n.nodeValue=t)}e.textContent=t}function Bt(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=0===n.indexOf("--"),o=n,a=t[n];o=null==a||"boolean"==typeof a||""===a?"":r||"number"!=typeof a||0===a||Vo.hasOwnProperty(o)&&Vo[o]?(""+a).trim():a+"px","float"===n&&(n="cssFloat"),r?e.setProperty(n,o):e[n]=o}}function Wt(e,t,n){t&&(zo[e]&&(null!=t.children||null!=t.dangerouslySetInnerHTML)&&r("137",e,n()),null!=t.dangerouslySetInnerHTML&&(null!=t.children&&r("60"),"object"==typeof t.dangerouslySetInnerHTML&&"__html"in t.dangerouslySetInnerHTML||r("61")),null!=t.style&&"object"!=typeof t.style&&r("62",n()))}function qt(e,t){if(-1===e.indexOf("-"))return"string"==typeof t.is;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function $t(e,t){e=9===e.nodeType||11===e.nodeType?e:e.ownerDocument;var n=Ke(e);t=On[t];for(var r=0;r<t.length;r++){var o=t[r];n.hasOwnProperty(o)&&n[o]||("topScroll"===o?ze("topScroll","scroll",e):"topFocus"===o||"topBlur"===o?(ze("topFocus","focus",e),ze("topBlur","blur",e),n.topBlur=!0,n.topFocus=!0):"topCancel"===o?(X("cancel",!0)&&ze("topCancel","cancel",e),n.topCancel=!0):"topClose"===o?(X("close",!0)&&ze("topClose","close",e),n.topClose=!0):Zr.hasOwnProperty(o)&&He(o,Zr[o],e),n[o]=!0)}}function Kt(e,t,n,r){return n=9===n.nodeType?n:n.ownerDocument,r===Bo&&(r=Vt(e)),r===Bo?"script"===e?(e=n.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):e="string"==typeof t.is?n.createElement(e,{is:t.is}):n.createElement(e):e=n.createElementNS(r,e),e}function Gt(e,t){return(9===t.nodeType?t:t.ownerDocument).createTextNode(e)}function Yt(e,t,n,r){var o=qt(t,n);switch(t){case"iframe":case"object":He("topLoad","load",e);var a=n;break;case"video":case"audio":for(a in eo)eo.hasOwnProperty(a)&&He(a,eo[a],e);a=n;break;case"source":He("topError","error",e),a=n;break;case"img":case"image":case"link":He("topError","error",e),He("topLoad","load",e),a=n;break;case"form":He("topReset","reset",e),He("topSubmit","submit",e),a=n;break;case"details":He("topToggle","toggle",e),a=n;break;case"input":de(e,n),a=pe(e,n),He("topInvalid","invalid",e),$t(r,"onChange");break;case"option":a=Mt(e,n);break;case"select":Ut(e,n),a=fn({},n,{value:void 0}),He("topInvalid","invalid",e),$t(r,"onChange");break;case"textarea":Lt(e,n),a=It(e,n),He("topInvalid","invalid",e),$t(r,"onChange");break;default:a=n}Wt(t,a,Wo);var i,u=a;for(i in u)if(u.hasOwnProperty(i)){var l=u[i];"style"===i?Bt(e,l,Wo):"dangerouslySetInnerHTML"===i?null!=(l=l?l.__html:void 0)&&Fo(e,l):"children"===i?"string"==typeof l?("textarea"!==t||""!==l)&&zt(e,l):"number"==typeof l&&zt(e,""+l):"suppressContentEditableWarning"!==i&&"suppressHydrationWarning"!==i&&"autoFocus"!==i&&(wn.hasOwnProperty(i)?null!=l&&$t(r,i):null!=l&&fe(e,i,l,o))}switch(t){case"input":te(e),ve(e,n);break;case"textarea":te(e),Ft(e,n);break;case"option":null!=n.value&&e.setAttribute("value",n.value);break;case"select":e.multiple=!!n.multiple,t=n.value,null!=t?At(e,!!n.multiple,t,!1):null!=n.defaultValue&&At(e,!!n.multiple,n.defaultValue,!0);break;default:"function"==typeof a.onClick&&(e.onclick=pn)}}function Qt(e,t,n,r,o){var a=null;switch(t){case"input":n=pe(e,n),r=pe(e,r),a=[];break;case"option":n=Mt(e,n),r=Mt(e,r),a=[];break;case"select":n=fn({},n,{value:void 0}),r=fn({},r,{value:void 0}),a=[];break;case"textarea":n=It(e,n),r=It(e,r),a=[];break;default:"function"!=typeof n.onClick&&"function"==typeof r.onClick&&(e.onclick=pn)}Wt(t,r,Wo),t=e=void 0;var i=null;for(e in n)if(!r.hasOwnProperty(e)&&n.hasOwnProperty(e)&&null!=n[e])if("style"===e){var u=n[e];for(t in u)u.hasOwnProperty(t)&&(i||(i={}),i[t]="")}else"dangerouslySetInnerHTML"!==e&&"children"!==e&&"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&"autoFocus"!==e&&(wn.hasOwnProperty(e)?a||(a=[]):(a=a||[]).push(e,null));for(e in r){var l=r[e];if(u=null!=n?n[e]:void 0,r.hasOwnProperty(e)&&l!==u&&(null!=l||null!=u))if("style"===e)if(u){for(t in u)!u.hasOwnProperty(t)||l&&l.hasOwnProperty(t)||(i||(i={}),i[t]="");for(t in l)l.hasOwnProperty(t)&&u[t]!==l[t]&&(i||(i={}),i[t]=l[t])}else i||(a||(a=[]),a.push(e,i)),i=l;else"dangerouslySetInnerHTML"===e?(l=l?l.__html:void 0,u=u?u.__html:void 0,null!=l&&u!==l&&(a=a||[]).push(e,""+l)):"children"===e?u===l||"string"!=typeof l&&"number"!=typeof l||(a=a||[]).push(e,""+l):"suppressContentEditableWarning"!==e&&"suppressHydrationWarning"!==e&&(wn.hasOwnProperty(e)?(null!=l&&$t(o,e),a||u===l||(a=[])):(a=a||[]).push(e,l))}return i&&(a=a||[]).push("style",i),a}function Jt(e,t,n,r,o){"input"===n&&"radio"===o.type&&null!=o.name&&he(e,o),qt(n,r),r=qt(n,o);for(var a=0;a<t.length;a+=2){var i=t[a],u=t[a+1];"style"===i?Bt(e,u,Wo):"dangerouslySetInnerHTML"===i?Fo(e,u):"children"===i?zt(e,u):fe(e,i,u,r)}switch(n){case"input":me(e,o);break;case"textarea":Dt(e,o);break;case"select":e._wrapperState.initialValue=void 0,t=e._wrapperState.wasMultiple,e._wrapperState.wasMultiple=!!o.multiple,n=o.value,null!=n?At(e,!!o.multiple,n,!1):t!==!!o.multiple&&(null!=o.defaultValue?At(e,!!o.multiple,o.defaultValue,!0):At(e,!!o.multiple,o.multiple?[]:"",!1))}}function Xt(e,t,n,r,o){switch(t){case"iframe":case"object":He("topLoad","load",e);break;case"video":case"audio":for(var a in eo)eo.hasOwnProperty(a)&&He(a,eo[a],e);break;case"source":He("topError","error",e);break;case"img":case"image":case"link":He("topError","error",e),He("topLoad","load",e);break;case"form":He("topReset","reset",e),He("topSubmit","submit",e);break;case"details":He("topToggle","toggle",e);break;case"input":de(e,n),He("topInvalid","invalid",e),$t(o,"onChange");break;case"select":Ut(e,n),He("topInvalid","invalid",e),$t(o,"onChange");break;case"textarea":Lt(e,n),He("topInvalid","invalid",e),$t(o,"onChange")}Wt(t,n,Wo),r=null;for(var i in n)n.hasOwnProperty(i)&&(a=n[i],"children"===i?"string"==typeof a?e.textContent!==a&&(r=["children",a]):"number"==typeof a&&e.textContent!==""+a&&(r=["children",""+a]):wn.hasOwnProperty(i)&&null!=a&&$t(o,i));switch(t){case"input":te(e),ve(e,n);break;case"textarea":te(e),Ft(e,n);break;case"select":case"option":break;default:"function"==typeof n.onClick&&(e.onclick=pn)}return r}function Zt(e,t){return e.nodeValue!==t}function en(e){this._expirationTime=Go.computeUniqueAsyncExpiration(),this._root=e,this._callbacks=this._next=null,this._hasChildren=this._didComplete=!1,this._children=null,this._defer=!0}function tn(){this._callbacks=null,this._didCommit=!1,this._onCommit=this._onCommit.bind(this)}function nn(e,t,n){this._internalRoot=Go.createContainer(e,t,n)}function rn(e){return!(!e||1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType&&(8!==e.nodeType||" react-mount-point-unstable "!==e.nodeValue))}function on(e,t){switch(e){case"button":case"input":case"select":case"textarea":return!!t.autoFocus}return!1}function an(e,t){if(t||(t=e?9===e.nodeType?e.documentElement:e.firstChild:null,t=!(!t||1!==t.nodeType||!t.hasAttribute("data-reactroot"))),!t)for(var n;n=e.lastChild;)e.removeChild(n);return new nn(e,!1,t)}function un(e,t,n,o,a){rn(n)||r("200");var i=n._reactRootContainer;if(i){if("function"==typeof a){var u=a;a=function(){var e=Go.getPublicRootInstance(i._internalRoot);u.call(e)}}null!=e?i.legacy_renderSubtreeIntoContainer(e,t,a):i.render(t,a)}else{if(i=n._reactRootContainer=an(n,o),"function"==typeof a){var l=a;a=function(){var e=Go.getPublicRootInstance(i._internalRoot);l.call(e)}}Go.unbatchedUpdates(function(){null!=e?i.legacy_renderSubtreeIntoContainer(e,t,a):i.render(t,a)})}return Go.getPublicRootInstance(i._internalRoot)}function ln(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return rn(t)||r("200"),Nt(e,t,null,n)}/** @license React v16.3.1
 * react-dom.production.min.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var sn=n(0),cn=n(85),fn=n(44),pn=n(28),dn=n(86),hn=n(87),mn=n(88),vn=n(45);sn||r("227");var yn={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,invokeGuardedCallback:function(e,t,n,r,a,i,u,l,s){o.apply(yn,arguments)},invokeGuardedCallbackAndCatchFirstError:function(e,t,n,r,o,a,i,u,l){if(yn.invokeGuardedCallback.apply(this,arguments),yn.hasCaughtError()){var s=yn.clearCaughtError();yn._hasRethrowError||(yn._hasRethrowError=!0,yn._rethrowError=s)}},rethrowCaughtError:function(){return a.apply(yn,arguments)},hasCaughtError:function(){return yn._hasCaughtError},clearCaughtError:function(){if(yn._hasCaughtError){var e=yn._caughtError;return yn._caughtError=null,yn._hasCaughtError=!1,e}r("198")}},bn=null,gn={},En=[],_n={},wn={},On={},Cn=Object.freeze({plugins:En,eventNameDispatchConfigs:_n,registrationNameModules:wn,registrationNameDependencies:On,possibleRegistrationNames:null,injectEventPluginOrder:l,injectEventPluginsByName:s}),xn=null,Pn=null,Sn=null,kn=null,Tn={injectEventPluginOrder:l,injectEventPluginsByName:s},jn=Object.freeze({injection:Tn,getListener:v,runEventsInBatch:y,runExtractedEventsInBatch:b}),Nn=Math.random().toString(36).slice(2),Rn="__reactInternalInstance$"+Nn,Mn="__reactEventHandlers$"+Nn,An=Object.freeze({precacheFiberNode:function(e,t){t[Rn]=e},getClosestInstanceFromNode:g,getInstanceFromNode:function(e){return e=e[Rn],!e||5!==e.tag&&6!==e.tag?null:e},getNodeFromInstance:E,getFiberCurrentPropsFromNode:_,updateFiberProps:function(e,t){e[Mn]=t}}),Un=Object.freeze({accumulateTwoPhaseDispatches:T,accumulateTwoPhaseDispatchesSkipTarget:function(e){p(e,P)},accumulateEnterLeaveDispatches:j,accumulateDirectDispatches:function(e){p(e,k)}}),In=null,Ln={_root:null,_startText:null,_fallbackText:null},Dn="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),Fn={type:null,target:null,currentTarget:pn.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};fn(A.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():"unknown"!=typeof e.returnValue&&(e.returnValue=!1),this.isDefaultPrevented=pn.thatReturnsTrue)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():"unknown"!=typeof e.cancelBubble&&(e.cancelBubble=!0),this.isPropagationStopped=pn.thatReturnsTrue)},persist:function(){this.isPersistent=pn.thatReturnsTrue},isPersistent:pn.thatReturnsFalse,destructor:function(){var e,t=this.constructor.Interface;for(e in t)this[e]=null;for(t=0;t<Dn.length;t++)this[Dn[t]]=null}}),A.Interface=Fn,A.extend=function(e){function t(){}function n(){return r.apply(this,arguments)}var r=this;t.prototype=r.prototype;var o=new t;return fn(o,n.prototype),n.prototype=o,n.prototype.constructor=n,n.Interface=fn({},r.Interface,e),n.extend=r.extend,L(n),n},L(A);var Vn=A.extend({data:null}),Hn=A.extend({data:null}),zn=[9,13,27,32],Bn=cn.canUseDOM&&"CompositionEvent"in window,Wn=null;cn.canUseDOM&&"documentMode"in document&&(Wn=document.documentMode);var qn=cn.canUseDOM&&"TextEvent"in window&&!Wn,$n=cn.canUseDOM&&(!Bn||Wn&&8<Wn&&11>=Wn),Kn=String.fromCharCode(32),Gn={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["topCompositionEnd","topKeyPress","topTextInput","topPaste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"topBlur topCompositionEnd topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",captured:"onCompositionStartCapture"},dependencies:"topBlur topCompositionStart topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"topBlur topCompositionUpdate topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")}},Yn=!1,Qn=!1,Jn={eventTypes:Gn,extractEvents:function(e,t,n,r){var o=void 0,a=void 0;if(Bn)e:{switch(e){case"topCompositionStart":o=Gn.compositionStart;break e;case"topCompositionEnd":o=Gn.compositionEnd;break e;case"topCompositionUpdate":o=Gn.compositionUpdate;break e}o=void 0}else Qn?D(e,n)&&(o=Gn.compositionEnd):"topKeyDown"===e&&229===n.keyCode&&(o=Gn.compositionStart);return o?($n&&(Qn||o!==Gn.compositionStart?o===Gn.compositionEnd&&Qn&&(a=R()):(Ln._root=r,Ln._startText=M(),Qn=!0)),o=Vn.getPooled(o,t,n,r),a?o.data=a:null!==(a=F(n))&&(o.data=a),T(o),a=o):a=null,(e=qn?V(e,n):H(e,n))?(t=Hn.getPooled(Gn.beforeInput,t,n,r),t.data=e,T(t)):t=null,null===a?t:null===t?a:[a,t]}},Xn=null,Zn=null,er=null,tr={injectFiberControlledHostComponent:function(e){Xn=e}},nr=Object.freeze({injection:tr,enqueueStateRestore:B,needsStateRestore:W,restoreStateIfNeeded:q}),rr=!1,or={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0},ar=sn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ir="function"==typeof Symbol&&Symbol.for,ur=ir?Symbol.for("react.element"):60103,lr=ir?Symbol.for("react.call"):60104,sr=ir?Symbol.for("react.return"):60105,cr=ir?Symbol.for("react.portal"):60106,fr=ir?Symbol.for("react.fragment"):60107,pr=ir?Symbol.for("react.strict_mode"):60108,dr=ir?Symbol.for("react.provider"):60109,hr=ir?Symbol.for("react.context"):60110,mr=ir?Symbol.for("react.async_mode"):60111,vr=ir?Symbol.for("react.forward_ref"):60112,yr="function"==typeof Symbol&&Symbol.iterator,br=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,gr={},Er={},_r={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){_r[e]=new se(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];_r[t]=new se(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){_r[e]=new se(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","preserveAlpha"].forEach(function(e){_r[e]=new se(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){_r[e]=new se(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){_r[e]=new se(e,3,!0,e.toLowerCase(),null)}),["capture","download"].forEach(function(e){_r[e]=new se(e,4,!1,e.toLowerCase(),null)}),["cols","rows","size","span"].forEach(function(e){_r[e]=new se(e,6,!1,e.toLowerCase(),null)}),["rowSpan","start"].forEach(function(e){_r[e]=new se(e,5,!1,e.toLowerCase(),null)});var wr=/[\-\:]([a-z])/g;"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(wr,ce);_r[t]=new se(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(wr,ce);_r[t]=new se(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(wr,ce);_r[t]=new se(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),_r.tabIndex=new se("tabIndex",1,!1,"tabindex",null);var Or={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"topBlur topChange topClick topFocus topInput topKeyDown topKeyUp topSelectionChange".split(" ")}},Cr=null,xr=null,Pr=!1;cn.canUseDOM&&(Pr=X("input")&&(!document.documentMode||9<document.documentMode));var Sr={eventTypes:Or,_isInputEventSupported:Pr,extractEvents:function(e,t,n,r){var o=t?E(t):window,a=void 0,i=void 0,u=o.nodeName&&o.nodeName.toLowerCase();if("select"===u||"input"===u&&"file"===o.type?a=we:Q(o)?Pr?a=ke:(a=Pe,i=xe):!(u=o.nodeName)||"input"!==u.toLowerCase()||"checkbox"!==o.type&&"radio"!==o.type||(a=Se),a&&(a=a(e,t)))return ge(a,n,r);i&&i(e,o,t),"topBlur"===e&&null!=t&&(e=t._wrapperState||o._wrapperState)&&e.controlled&&"number"===o.type&&ye(o,"number",o.value)}},kr=A.extend({view:null,detail:null}),Tr={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"},jr=kr.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:je,button:null,buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)}}),Nr={mouseEnter:{registrationName:"onMouseEnter",dependencies:["topMouseOut","topMouseOver"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["topMouseOut","topMouseOver"]}},Rr={eventTypes:Nr,extractEvents:function(e,t,n,r){if("topMouseOver"===e&&(n.relatedTarget||n.fromElement)||"topMouseOut"!==e&&"topMouseOver"!==e)return null;var o=r.window===r?r:(o=r.ownerDocument)?o.defaultView||o.parentWindow:window;if("topMouseOut"===e?(e=t,t=(t=n.relatedTarget||n.toElement)?g(t):null):e=null,e===t)return null;var a=null==e?o:E(e);o=null==t?o:E(t);var i=jr.getPooled(Nr.mouseLeave,e,n,r);return i.type="mouseleave",i.target=a,i.relatedTarget=o,n=jr.getPooled(Nr.mouseEnter,t,n,r),n.type="mouseenter",n.target=o,n.relatedTarget=a,j(i,n,e,t),[i,n]}},Mr=A.extend({animationName:null,elapsedTime:null,pseudoElement:null}),Ar=A.extend({clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Ur=kr.extend({relatedTarget:null}),Ir={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Lr={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Dr=kr.extend({key:function(e){if(e.key){var t=Ir[e.key]||e.key;if("Unidentified"!==t)return t}return"keypress"===e.type?(e=Le(e),13===e?"Enter":String.fromCharCode(e)):"keydown"===e.type||"keyup"===e.type?Lr[e.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:je,charCode:function(e){return"keypress"===e.type?Le(e):0},keyCode:function(e){return"keydown"===e.type||"keyup"===e.type?e.keyCode:0},which:function(e){return"keypress"===e.type?Le(e):"keydown"===e.type||"keyup"===e.type?e.keyCode:0}}),Fr=jr.extend({dataTransfer:null}),Vr=kr.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:je}),Hr=A.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),zr=jr.extend({deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null}),Br={},Wr={};"blur cancel click close contextMenu copy cut doubleClick dragEnd dragStart drop focus input invalid keyDown keyPress keyUp mouseDown mouseUp paste pause play rateChange reset seeked submit touchCancel touchEnd touchStart volumeChange".split(" ").forEach(function(e){De(e,!0)}),"abort animationEnd animationIteration animationStart canPlay canPlayThrough drag dragEnter dragExit dragLeave dragOver durationChange emptied encrypted ended error load loadedData loadedMetadata loadStart mouseMove mouseOut mouseOver playing progress scroll seeking stalled suspend timeUpdate toggle touchMove transitionEnd waiting wheel".split(" ").forEach(function(e){De(e,!1)});var qr={eventTypes:Br,isInteractiveTopLevelEventType:function(e){return void 0!==(e=Wr[e])&&!0===e.isInteractive},extractEvents:function(e,t,n,r){var o=Wr[e];if(!o)return null;switch(e){case"topKeyPress":if(0===Le(n))return null;case"topKeyDown":case"topKeyUp":e=Dr;break;case"topBlur":case"topFocus":e=Ur;break;case"topClick":if(2===n.button)return null;case"topDoubleClick":case"topMouseDown":case"topMouseMove":case"topMouseUp":case"topMouseOut":case"topMouseOver":case"topContextMenu":e=jr;break;case"topDrag":case"topDragEnd":case"topDragEnter":case"topDragExit":case"topDragLeave":case"topDragOver":case"topDragStart":case"topDrop":e=Fr;break;case"topTouchCancel":case"topTouchEnd":case"topTouchMove":case"topTouchStart":e=Vr;break;case"topAnimationEnd":case"topAnimationIteration":case"topAnimationStart":e=Mr;break;case"topTransitionEnd":e=Hr;break;case"topScroll":e=kr;break;case"topWheel":e=zr;break;case"topCopy":case"topCut":case"topPaste":e=Ar;break;default:e=A}return t=e.getPooled(o,t,n,r),T(t),t}},$r=qr.isInteractiveTopLevelEventType,Kr=[],Gr=!0,Yr=Object.freeze({get _enabled(){return Gr},setEnabled:Ve,isEnabled:function(){return Gr},trapBubbledEvent:He,trapCapturedEvent:ze,dispatchEvent:We}),Qr={animationend:qe("Animation","AnimationEnd"),animationiteration:qe("Animation","AnimationIteration"),animationstart:qe("Animation","AnimationStart"),transitionend:qe("Transition","TransitionEnd")},Jr={},Xr={};cn.canUseDOM&&(Xr=document.createElement("div").style,"AnimationEvent"in window||(delete Qr.animationend.animation,delete Qr.animationiteration.animation,delete Qr.animationstart.animation),"TransitionEvent"in window||delete Qr.transitionend.transition);var Zr={topAnimationEnd:$e("animationend"),topAnimationIteration:$e("animationiteration"),topAnimationStart:$e("animationstart"),topBlur:"blur",topCancel:"cancel",topChange:"change",topClick:"click",topClose:"close",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoad:"load",topLoadStart:"loadstart",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTextInput:"textInput",topToggle:"toggle",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topTransitionEnd:$e("transitionend"),topWheel:"wheel"},eo={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",topWaiting:"waiting"},to={},no=0,ro="_reactListenersID"+(""+Math.random()).slice(2),oo=cn.canUseDOM&&"documentMode"in document&&11>=document.documentMode,ao={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"topBlur topContextMenu topFocus topKeyDown topKeyUp topMouseDown topMouseUp topSelectionChange".split(" ")}},io=null,uo=null,lo=null,so=!1,co={eventTypes:ao,extractEvents:function(e,t,n,r){var o,a=r.window===r?r.document:9===r.nodeType?r:r.ownerDocument;if(!(o=!a)){e:{a=Ke(a),o=On.onSelect;for(var i=0;i<o.length;i++){var u=o[i];if(!a.hasOwnProperty(u)||!a[u]){a=!1;break e}}a=!0}o=!a}if(o)return null;switch(a=t?E(t):window,e){case"topFocus":(Q(a)||"true"===a.contentEditable)&&(io=a,uo=t,lo=null);break;case"topBlur":lo=uo=io=null;break;case"topMouseDown":so=!0;break;case"topContextMenu":case"topMouseUp":return so=!1,Je(n,r);case"topSelectionChange":if(oo)break;case"topKeyDown":case"topKeyUp":return Je(n,r)}return null}};Tn.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")),xn=An.getFiberCurrentPropsFromNode,Pn=An.getInstanceFromNode,Sn=An.getNodeFromInstance,Tn.injectEventPluginsByName({SimpleEventPlugin:qr,EnterLeaveEventPlugin:Rr,ChangeEventPlugin:Sr,SelectEventPlugin:co,BeforeInputEventPlugin:Jn});var fo=null,po=null;new Set;var ho=void 0,mo=void 0,vo=Array.isArray,yo=bt(!0),bo=bt(!1),go={},Eo=Object.freeze({default:jt}),_o=Eo&&jt||Eo,wo=_o.default?_o.default:_o,Oo="object"==typeof performance&&"function"==typeof performance.now,Co=void 0;Co=Oo?function(){return performance.now()}:function(){return Date.now()};var xo=void 0,Po=void 0;if(cn.canUseDOM)if("function"!=typeof requestIdleCallback||"function"!=typeof cancelIdleCallback){var So=null,ko=!1,To=-1,jo=!1,No=0,Ro=33,Mo=33,Ao=void 0;Ao=Oo?{didTimeout:!1,timeRemaining:function(){var e=No-performance.now();return 0<e?e:0}}:{didTimeout:!1,timeRemaining:function(){var e=No-Date.now();return 0<e?e:0}};var Uo="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(e){if(e.source===window&&e.data===Uo){if(ko=!1,e=Co(),0>=No-e){if(!(-1!==To&&To<=e))return void(jo||(jo=!0,requestAnimationFrame(Io)));Ao.didTimeout=!0}else Ao.didTimeout=!1;To=-1,e=So,So=null,null!==e&&e(Ao)}},!1);var Io=function(e){jo=!1;var t=e-No+Mo;t<Mo&&Ro<Mo?(8>t&&(t=8),Mo=t<Ro?Ro:t):Ro=t,No=e+Mo,ko||(ko=!0,window.postMessage(Uo,"*"))};xo=function(e,t){return So=e,null!=t&&"number"==typeof t.timeout&&(To=Co()+t.timeout),jo||(jo=!0,requestAnimationFrame(Io)),0},Po=function(){So=null,ko=!1,To=-1}}else xo=window.requestIdleCallback,Po=window.cancelIdleCallback;else xo=function(e){return setTimeout(function(){e({timeRemaining:function(){return 1/0},didTimeout:!1})})},Po=function(e){clearTimeout(e)};var Lo={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"},Do=void 0,Fo=function(e){return"undefined"!=typeof MSApp&&MSApp.execUnsafeLocalFunction?function(t,n,r,o){MSApp.execUnsafeLocalFunction(function(){return e(t,n)})}:e}(function(e,t){if(e.namespaceURI!==Lo.svg||"innerHTML"in e)e.innerHTML=t;else{for(Do=Do||document.createElement("div"),Do.innerHTML="<svg>"+t+"</svg>",t=Do.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}}),Vo={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ho=["Webkit","ms","Moz","O"];Object.keys(Vo).forEach(function(e){Ho.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Vo[t]=Vo[e]})});var zo=fn({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0}),Bo=Lo.html,Wo=pn.thatReturns(""),qo=Object.freeze({createElement:Kt,createTextNode:Gt,setInitialProperties:Yt,diffProperties:Qt,updateProperties:Jt,diffHydratedProperties:Xt,diffHydratedText:Zt,warnForUnmatchedText:function(){},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(e,t,n){switch(t){case"input":if(me(e,n),t=n.name,"radio"===n.type&&null!=t){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var a=_(o);a||r("90"),ne(o),me(o,a)}}}break;case"textarea":Dt(e,n);break;case"select":null!=(t=n.value)&&At(e,!!n.multiple,t,!1)}}});tr.injectFiberControlledHostComponent(qo);var $o=null,Ko=null;en.prototype.render=function(e){this._defer||r("250"),this._hasChildren=!0,this._children=e;var t=this._root._internalRoot,n=this._expirationTime,o=new tn;return Go.updateContainerAtExpirationTime(e,t,null,n,o._onCommit),o},en.prototype.then=function(e){if(this._didComplete)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},en.prototype.commit=function(){var e=this._root._internalRoot,t=e.firstBatch;if(this._defer&&null!==t||r("251"),this._hasChildren){var n=this._expirationTime;if(t!==this){this._hasChildren&&(n=this._expirationTime=t._expirationTime,this.render(this._children));for(var o=null,a=t;a!==this;)o=a,a=a._next;null===o&&r("251"),o._next=a._next,this._next=t,e.firstBatch=this}this._defer=!1,Go.flushRoot(e,n),t=this._next,this._next=null,t=e.firstBatch=t,null!==t&&t._hasChildren&&t.render(t._children)}else this._next=null,this._defer=!1},en.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++)(0,e[t])()}},tn.prototype.then=function(e){if(this._didCommit)e();else{var t=this._callbacks;null===t&&(t=this._callbacks=[]),t.push(e)}},tn.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var e=this._callbacks;if(null!==e)for(var t=0;t<e.length;t++){var n=e[t];"function"!=typeof n&&r("191",n),n()}}},nn.prototype.render=function(e,t){var n=this._internalRoot,r=new tn;return t=void 0===t?null:t,null!==t&&r.then(t),Go.updateContainer(e,n,null,r._onCommit),r},nn.prototype.unmount=function(e){var t=this._internalRoot,n=new tn;return e=void 0===e?null:e,null!==e&&n.then(e),Go.updateContainer(null,t,null,n._onCommit),n},nn.prototype.legacy_renderSubtreeIntoContainer=function(e,t,n){var r=this._internalRoot,o=new tn;return n=void 0===n?null:n,null!==n&&o.then(n),Go.updateContainer(t,r,e,o._onCommit),o},nn.prototype.createBatch=function(){var e=new en(this),t=e._expirationTime,n=this._internalRoot,r=n.firstBatch;if(null===r)n.firstBatch=e,e._next=null;else{for(n=null;null!==r&&r._expirationTime<=t;)n=r,r=r._next;e._next=r,null!==n&&(n._next=e)}return e};var Go=wo({getRootHostContext:function(e){var t=e.nodeType;switch(t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Ht(null,"");break;default:t=8===t?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Ht(e,t)}return e},getChildHostContext:function(e,t){return Ht(e,t)},getPublicInstance:function(e){return e},prepareForCommit:function(){$o=Gr;var e=dn();if(Qe(e)){if("selectionStart"in e)var t={start:e.selectionStart,end:e.selectionEnd};else e:{var n=window.getSelection&&window.getSelection();if(n&&0!==n.rangeCount){t=n.anchorNode;var r=n.anchorOffset,o=n.focusNode;n=n.focusOffset;try{t.nodeType,o.nodeType}catch(e){t=null;break e}var a=0,i=-1,u=-1,l=0,s=0,c=e,f=null;t:for(;;){for(var p;c!==t||0!==r&&3!==c.nodeType||(i=a+r),c!==o||0!==n&&3!==c.nodeType||(u=a+n),3===c.nodeType&&(a+=c.nodeValue.length),null!==(p=c.firstChild);)f=c,c=p;for(;;){if(c===e)break t;if(f===t&&++l===r&&(i=a),f===o&&++s===n&&(u=a),null!==(p=c.nextSibling))break;c=f,f=c.parentNode}c=p}t=-1===i||-1===u?null:{start:i,end:u}}else t=null}t=t||{start:0,end:0}}else t=null;Ko={focusedElem:e,selectionRange:t},Ve(!1)},resetAfterCommit:function(){var e=Ko,t=dn(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&mn(document.documentElement,n)){if(Qe(n))if(t=r.start,e=r.end,void 0===e&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(window.getSelection){t=window.getSelection();var o=n[N()].length;e=Math.min(r.start,o),r=void 0===r.end?e:Math.min(r.end,o),!t.extend&&e>r&&(o=r,r=e,e=o),o=Ye(n,e);var a=Ye(n,r);if(o&&a&&(1!==t.rangeCount||t.anchorNode!==o.node||t.anchorOffset!==o.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)){var i=document.createRange();i.setStart(o.node,o.offset),t.removeAllRanges(),e>r?(t.addRange(i),t.extend(a.node,a.offset)):(i.setEnd(a.node,a.offset),t.addRange(i))}}for(t=[],e=n;e=e.parentNode;)1===e.nodeType&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}Ko=null,Ve($o),$o=null},createInstance:function(e,t,n,r,o){return e=Kt(e,t,n,r),e[Rn]=o,e[Mn]=t,e},appendInitialChild:function(e,t){e.appendChild(t)},finalizeInitialChildren:function(e,t,n,r){return Yt(e,t,n,r),on(t,n)},prepareUpdate:function(e,t,n,r,o){return Qt(e,t,n,r,o)},shouldSetTextContent:function(e,t){return"textarea"===e||"string"==typeof t.children||"number"==typeof t.children||"object"==typeof t.dangerouslySetInnerHTML&&null!==t.dangerouslySetInnerHTML&&"string"==typeof t.dangerouslySetInnerHTML.__html},shouldDeprioritizeSubtree:function(e,t){return!!t.hidden},createTextInstance:function(e,t,n,r){return e=Gt(e,t),e[Rn]=r,e},now:Co,mutation:{commitMount:function(e,t,n){on(t,n)&&e.focus()},commitUpdate:function(e,t,n,r,o){e[Mn]=o,Jt(e,t,n,r,o)},resetTextContent:function(e){zt(e,"")},commitTextUpdate:function(e,t,n){e.nodeValue=n},appendChild:function(e,t){e.appendChild(t)},appendChildToContainer:function(e,t){8===e.nodeType?e.parentNode.insertBefore(t,e):e.appendChild(t)},insertBefore:function(e,t,n){e.insertBefore(t,n)},insertInContainerBefore:function(e,t,n){8===e.nodeType?e.parentNode.insertBefore(t,n):e.insertBefore(t,n)},removeChild:function(e,t){e.removeChild(t)},removeChildFromContainer:function(e,t){8===e.nodeType?e.parentNode.removeChild(t):e.removeChild(t)}},hydration:{canHydrateInstance:function(e,t){return 1!==e.nodeType||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e},canHydrateTextInstance:function(e,t){return""===t||3!==e.nodeType?null:e},getNextHydratableSibling:function(e){for(e=e.nextSibling;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},getFirstHydratableChild:function(e){for(e=e.firstChild;e&&1!==e.nodeType&&3!==e.nodeType;)e=e.nextSibling;return e},hydrateInstance:function(e,t,n,r,o,a){return e[Rn]=a,e[Mn]=n,Xt(e,t,n,o,r)},hydrateTextInstance:function(e,t,n){return e[Rn]=n,Zt(e,t)},didNotMatchHydratedContainerTextInstance:function(){},didNotMatchHydratedTextInstance:function(){},didNotHydrateContainerInstance:function(){},didNotHydrateInstance:function(){},didNotFindHydratableContainerInstance:function(){},didNotFindHydratableContainerTextInstance:function(){},didNotFindHydratableInstance:function(){},didNotFindHydratableTextInstance:function(){}},scheduleDeferredCallback:xo,cancelDeferredCallback:Po}),Yo=Go;$=Yo.batchedUpdates,K=Yo.interactiveUpdates,G=Yo.flushInteractiveUpdates;var Qo={createPortal:ln,findDOMNode:function(e){if(null==e)return null;if(1===e.nodeType)return e;var t=e._reactInternalFiber;if(t)return Go.findHostInstance(t);"function"==typeof e.render?r("188"):r("213",Object.keys(e))},hydrate:function(e,t,n){return un(null,e,t,!0,n)},render:function(e,t,n){return un(null,e,t,!1,n)},unstable_renderSubtreeIntoContainer:function(e,t,n,o){return(null==e||void 0===e._reactInternalFiber)&&r("38"),un(e,t,n,!1,o)},unmountComponentAtNode:function(e){return rn(e)||r("40"),!!e._reactRootContainer&&(Go.unbatchedUpdates(function(){un(null,null,e,!1,function(){e._reactRootContainer=null})}),!0)},unstable_createPortal:function(){return ln.apply(void 0,arguments)},unstable_batchedUpdates:Go.batchedUpdates,unstable_deferredUpdates:Go.deferredUpdates,flushSync:Go.flushSync,unstable_flushControlled:Go.flushControlled,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:jn,EventPluginRegistry:Cn,EventPropagators:Un,ReactControlledComponent:nr,ReactDOMComponentTree:An,ReactDOMEventListener:Yr},unstable_createRoot:function(e,t){return new nn(e,!0,null!=t&&!0===t.hydrate)}};Go.injectIntoDevTools({findFiberByHostInstance:g,bundleType:0,version:"16.3.1",rendererPackageName:"react-dom"});var Jo=Object.freeze({default:Qo}),Xo=Jo&&Qo||Jo;e.exports=Xo.default?Xo.default:Xo},function(e,t,n){"use strict";var r=!("undefined"==typeof window||!window.document||!window.document.createElement),o={canUseDOM:r,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:r&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:r&&!!window.screen,isInWorker:!r};e.exports=o},function(e,t,n){"use strict";function r(e){if(void 0===(e=e||("undefined"!=typeof document?document:void 0)))return null;try{return e.activeElement||e.body}catch(t){return e.body}}e.exports=r},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var i=0;i<n.length;i++)if(!a.call(t,n[i])||!r(e[n[i]],t[n[i]]))return!1;return!0}var a=Object.prototype.hasOwnProperty;e.exports=o},function(e,t,n){"use strict";function r(e,t){return!(!e||!t)&&(e===t||!o(e)&&(o(t)?r(e,t.parentNode):"contains"in e?e.contains(t):!!e.compareDocumentPosition&&!!(16&e.compareDocumentPosition(t))))}var o=n(89);e.exports=r},function(e,t,n){"use strict";function r(e){return o(e)&&3==e.nodeType}var o=n(90);e.exports=r},function(e,t,n){"use strict";function r(e){var t=e?e.ownerDocument||e:document,n=t.defaultView||window;return!(!e||!("function"==typeof n.Node?e instanceof n.Node:"object"==typeof e&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName))}e.exports=r},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),a=n(106),i=r(a),u=n(107),l=r(u),s=n(108),c=r(s),f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,o.createStore)(c.default,e,(0,o.applyMiddleware)(l.default,i.default))};t.default=f},function(e,t,n){"use strict";function r(e){return null==e?void 0===e?l:u:s&&s in Object(e)?Object(a.a)(e):Object(i.a)(e)}var o=n(47),a=n(95),i=n(96),u="[object Null]",l="[object Undefined]",s=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";var r=n(94),o="object"==typeof self&&self&&self.Object===Object&&self,a=r.a||o||Function("return this")();t.a=a},function(e,t,n){"use strict";(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.a=n}).call(t,n(18))},function(e,t,n){"use strict";function r(e){var t=i.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[l]=n:delete e[l]),o}var o=n(47),a=Object.prototype,i=a.hasOwnProperty,u=a.toString,l=o.a?o.a.toStringTag:void 0;t.a=r},function(e,t,n){"use strict";function r(e){return a.call(e)}var o=Object.prototype,a=o.toString;t.a=r},function(e,t,n){"use strict";var r=n(98),o=Object(r.a)(Object.getPrototypeOf,Object);t.a=o},function(e,t,n){"use strict";function r(e,t){return function(n){return e(t(n))}}t.a=r},function(e,t,n){"use strict";function r(e){return null!=e&&"object"==typeof e}t.a=r},function(e,t,n){"use strict";(function(e,r){var o,a=n(102);o="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==e?e:r;var i=Object(a.a)(o);t.a=i}).call(t,n(18),n(101)(e))},function(e,t){e.exports=function(e){if(!e.webpackPolyfill){var t=Object.create(e);t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),Object.defineProperty(t,"exports",{enumerable:!0}),t.webpackPolyfill=1}return t}},function(e,t,n){"use strict";function r(e){var t,n=e.Symbol;return"function"==typeof n?n.observable?t=n.observable:(t=n("observable"),n.observable=t):t="@@observable",t}t.a=r},function(e,t,n){"use strict";function r(e,t){var n=t&&t.type;return"Given action "+(n&&'"'+n.toString()+'"'||"an action")+', reducer "'+e+'" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.'}function o(e){Object.keys(e).forEach(function(t){var n=e[t];if(void 0===n(void 0,{type:i.a.INIT}))throw new Error('Reducer "'+t+"\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:"@@redux/PROBE_UNKNOWN_ACTION_"+Math.random().toString(36).substring(7).split("").join(".")}))throw new Error('Reducer "'+t+"\" returned undefined when probed with a random type. Don't try to handle "+i.a.INIT+' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')})}function a(e){for(var t=Object.keys(e),n={},a=0;a<t.length;a++){var i=t[a];"function"==typeof e[i]&&(n[i]=e[i])}var u=Object.keys(n),l=void 0;try{o(n)}catch(e){l=e}return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];if(l)throw l;for(var o=!1,a={},i=0;i<u.length;i++){var s=u[i],c=n[s],f=e[s],p=c(f,t);if(void 0===p){var d=r(s,t);throw new Error(d)}a[s]=p,o=o||p!==f}return o?a:e}}t.a=a;var i=n(46);n(29),n(48)},function(e,t,n){"use strict";function r(e,t){return function(){return t(e.apply(void 0,arguments))}}function o(e,t){if("function"==typeof e)return r(e,t);if("object"!=typeof e||null===e)throw new Error("bindActionCreators expected an object or a function, instead received "+(null===e?"null":typeof e)+'. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');for(var n=Object.keys(e),o={},a=0;a<n.length;a++){var i=n[a],u=e[i];"function"==typeof u&&(o[i]=r(u,t))}return o}t.a=o},function(e,t,n){"use strict";function r(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return function(n,r,i){var u=e(n,r,i),l=u.dispatch,s=[],c={getState:u.getState,dispatch:function(e){return l(e)}};return s=t.map(function(e){return e(c)}),l=o.a.apply(void 0,s)(u.dispatch),a({},u,{dispatch:l})}}}t.a=r;var o=n(49),a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},function(e,t,n){(function(e){!function(e,n){n(t)}(0,function(t){"use strict";function n(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}function r(e,t){Object.defineProperty(this,"kind",{value:e,enumerable:!0}),t&&t.length&&Object.defineProperty(this,"path",{value:t,enumerable:!0})}function o(e,t,n){o.super_.call(this,"E",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0}),Object.defineProperty(this,"rhs",{value:n,enumerable:!0})}function a(e,t){a.super_.call(this,"N",e),Object.defineProperty(this,"rhs",{value:t,enumerable:!0})}function i(e,t){i.super_.call(this,"D",e),Object.defineProperty(this,"lhs",{value:t,enumerable:!0})}function u(e,t,n){u.super_.call(this,"A",e),Object.defineProperty(this,"index",{value:t,enumerable:!0}),Object.defineProperty(this,"item",{value:n,enumerable:!0})}function l(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r),e}function s(e){var t=void 0===e?"undefined":j(e);return"object"!==t?t:e===Math?"math":null===e?"null":Array.isArray(e)?"array":"[object Date]"===Object.prototype.toString.call(e)?"date":"function"==typeof e.toString&&/^\/.*\//.test(e.toString())?"regexp":"object"}function c(e,t,n,r,f,p,d){f=f||[],d=d||[];var h=f.slice(0);if(void 0!==p){if(r){if("function"==typeof r&&r(h,p))return;if("object"===(void 0===r?"undefined":j(r))){if(r.prefilter&&r.prefilter(h,p))return;if(r.normalize){var m=r.normalize(h,p,e,t);m&&(e=m[0],t=m[1])}}}h.push(p)}"regexp"===s(e)&&"regexp"===s(t)&&(e=e.toString(),t=t.toString());var v=void 0===e?"undefined":j(e),y=void 0===t?"undefined":j(t),b="undefined"!==v||d&&d[d.length-1].lhs&&d[d.length-1].lhs.hasOwnProperty(p),g="undefined"!==y||d&&d[d.length-1].rhs&&d[d.length-1].rhs.hasOwnProperty(p);if(!b&&g)n(new a(h,t));else if(!g&&b)n(new i(h,e));else if(s(e)!==s(t))n(new o(h,e,t));else if("date"===s(e)&&e-t!=0)n(new o(h,e,t));else if("object"===v&&null!==e&&null!==t)if(d.filter(function(t){return t.lhs===e}).length)e!==t&&n(new o(h,e,t));else{if(d.push({lhs:e,rhs:t}),Array.isArray(e)){var E;for(e.length,E=0;E<e.length;E++)E>=t.length?n(new u(h,E,new i(void 0,e[E]))):c(e[E],t[E],n,r,h,E,d);for(;E<t.length;)n(new u(h,E,new a(void 0,t[E++])))}else{var _=Object.keys(e),w=Object.keys(t);_.forEach(function(o,a){var i=w.indexOf(o);i>=0?(c(e[o],t[o],n,r,h,o,d),w=l(w,i)):c(e[o],void 0,n,r,h,o,d)}),w.forEach(function(e){c(void 0,t[e],n,r,h,e,d)})}d.length=d.length-1}else e!==t&&("number"===v&&isNaN(e)&&isNaN(t)||n(new o(h,e,t)))}function f(e,t,n,r){return r=r||[],c(e,t,function(e){e&&r.push(e)},n),r.length?r:void 0}function p(e,t,n){if(n.path&&n.path.length){var r,o=e[t],a=n.path.length-1;for(r=0;r<a;r++)o=o[n.path[r]];switch(n.kind){case"A":p(o[n.path[r]],n.index,n.item);break;case"D":delete o[n.path[r]];break;case"E":case"N":o[n.path[r]]=n.rhs}}else switch(n.kind){case"A":p(e[t],n.index,n.item);break;case"D":e=l(e,t);break;case"E":case"N":e[t]=n.rhs}return e}function d(e,t,n){if(e&&t&&n&&n.kind){for(var r=e,o=-1,a=n.path?n.path.length-1:0;++o<a;)void 0===r[n.path[o]]&&(r[n.path[o]]="number"==typeof n.path[o]?[]:{}),r=r[n.path[o]];switch(n.kind){case"A":p(n.path?r[n.path[o]]:r,n.index,n.item);break;case"D":delete r[n.path[o]];break;case"E":case"N":r[n.path[o]]=n.rhs}}}function h(e,t,n){if(n.path&&n.path.length){var r,o=e[t],a=n.path.length-1;for(r=0;r<a;r++)o=o[n.path[r]];switch(n.kind){case"A":h(o[n.path[r]],n.index,n.item);break;case"D":case"E":o[n.path[r]]=n.lhs;break;case"N":delete o[n.path[r]]}}else switch(n.kind){case"A":h(e[t],n.index,n.item);break;case"D":case"E":e[t]=n.lhs;break;case"N":e=l(e,t)}return e}function m(e,t,n){if(e&&t&&n&&n.kind){var r,o,a=e;for(o=n.path.length-1,r=0;r<o;r++)void 0===a[n.path[r]]&&(a[n.path[r]]={}),a=a[n.path[r]];switch(n.kind){case"A":h(a[n.path[r]],n.index,n.item);break;case"D":case"E":a[n.path[r]]=n.lhs;break;case"N":delete a[n.path[r]]}}}function v(e,t,n){if(e&&t){c(e,t,function(r){n&&!n(e,t,r)||d(e,t,r)})}}function y(e){return"color: "+M[e].color+"; font-weight: bold"}function b(e){var t=e.kind,n=e.path,r=e.lhs,o=e.rhs,a=e.index,i=e.item;switch(t){case"E":return[n.join("."),r,"→",o];case"N":return[n.join("."),o];case"D":return[n.join(".")];case"A":return[n.join(".")+"["+a+"]",i];default:return[]}}function g(e,t,n,r){var o=f(e,t);try{r?n.groupCollapsed("diff"):n.group("diff")}catch(e){n.log("diff")}o?o.forEach(function(e){var t=e.kind,r=b(e);n.log.apply(n,["%c "+M[t].text,y(t)].concat(N(r)))}):n.log("—— no diff ——");try{n.groupEnd()}catch(e){n.log("—— diff end —— ")}}function E(e,t,n,r){switch(void 0===e?"undefined":j(e)){case"object":return"function"==typeof e[r]?e[r].apply(e,N(n)):e[r];case"function":return e(t);default:return e}}function _(e){var t=e.timestamp,n=e.duration;return function(e,r,o){var a=["action"];return a.push("%c"+String(e.type)),t&&a.push("%c@ "+r),n&&a.push("%c(in "+o.toFixed(2)+" ms)"),a.join(" ")}}function w(e,t){var n=t.logger,r=t.actionTransformer,o=t.titleFormatter,a=void 0===o?_(t):o,i=t.collapsed,u=t.colors,l=t.level,s=t.diff,c=void 0===t.titleFormatter;e.forEach(function(o,f){var p=o.started,d=o.startedTime,h=o.action,m=o.prevState,v=o.error,y=o.took,b=o.nextState,_=e[f+1];_&&(b=_.prevState,y=_.started-p);var w=r(h),O="function"==typeof i?i(function(){return b},h,o):i,C=k(d),x=u.title?"color: "+u.title(w)+";":"",P=["color: gray; font-weight: lighter;"];P.push(x),t.timestamp&&P.push("color: gray; font-weight: lighter;"),t.duration&&P.push("color: gray; font-weight: lighter;");var S=a(w,C,y);try{O?u.title&&c?n.groupCollapsed.apply(n,["%c "+S].concat(P)):n.groupCollapsed(S):u.title&&c?n.group.apply(n,["%c "+S].concat(P)):n.group(S)}catch(e){n.log(S)}var T=E(l,w,[m],"prevState"),j=E(l,w,[w],"action"),N=E(l,w,[v,m],"error"),R=E(l,w,[b],"nextState");if(T)if(u.prevState){var M="color: "+u.prevState(m)+"; font-weight: bold";n[T]("%c prev state",M,m)}else n[T]("prev state",m);if(j)if(u.action){var A="color: "+u.action(w)+"; font-weight: bold";n[j]("%c action    ",A,w)}else n[j]("action    ",w);if(v&&N)if(u.error){var U="color: "+u.error(v,m)+"; font-weight: bold;";n[N]("%c error     ",U,v)}else n[N]("error     ",v);if(R)if(u.nextState){var I="color: "+u.nextState(b)+"; font-weight: bold";n[R]("%c next state",I,b)}else n[R]("next state",b);s&&g(m,b,n,O);try{n.groupEnd()}catch(e){n.log("—— log end ——")}})}function O(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=Object.assign({},A,e),n=t.logger,r=t.stateTransformer,o=t.errorTransformer,a=t.predicate,i=t.logErrors,u=t.diffPredicate;if(void 0===n)return function(){return function(e){return function(t){return e(t)}}};if(e.getState&&e.dispatch)return console.error("[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:\n// Logger with default options\nimport { logger } from 'redux-logger'\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n// Or you can create your own logger with custom options http://bit.ly/redux-logger-options\nimport createLogger from 'redux-logger'\nconst logger = createLogger({\n  // ...options\n});\nconst store = createStore(\n  reducer,\n  applyMiddleware(logger)\n)\n"),function(){return function(e){return function(t){return e(t)}}};var l=[];return function(e){var n=e.getState;return function(e){return function(s){if("function"==typeof a&&!a(n,s))return e(s);var c={};l.push(c),c.started=T.now(),c.startedTime=new Date,c.prevState=r(n()),c.action=s;var f=void 0;if(i)try{f=e(s)}catch(e){c.error=o(e)}else f=e(s);c.took=T.now()-c.started,c.nextState=r(n());var p=t.diff&&"function"==typeof u?u(n,s):t.diff;if(w(l,Object.assign({},t,{diff:p})),l.length=0,c.error)throw c.error;return f}}}}var C,x,P=function(e,t){return new Array(t+1).join(e)},S=function(e,t){return P("0",t-e.toString().length)+e},k=function(e){return S(e.getHours(),2)+":"+S(e.getMinutes(),2)+":"+S(e.getSeconds(),2)+"."+S(e.getMilliseconds(),3)},T="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance:Date,j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},N=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},R=[];C="object"===(void 0===e?"undefined":j(e))&&e?e:"undefined"!=typeof window?window:{},x=C.DeepDiff,x&&R.push(function(){void 0!==x&&C.DeepDiff===f&&(C.DeepDiff=x,x=void 0)}),n(o,r),n(a,r),n(i,r),n(u,r),Object.defineProperties(f,{diff:{value:f,enumerable:!0},observableDiff:{value:c,enumerable:!0},applyDiff:{value:v,enumerable:!0},applyChange:{value:d,enumerable:!0},revertChange:{value:m,enumerable:!0},isConflict:{value:function(){return void 0!==x},enumerable:!0},noConflict:{value:function(){return R&&(R.forEach(function(e){e()}),R=null),f},enumerable:!0}});var M={E:{color:"#2196F3",text:"CHANGED:"},N:{color:"#4CAF50",text:"ADDED:"},D:{color:"#F44336",text:"DELETED:"},A:{color:"#2196F3",text:"ARRAY:"}},A={level:"log",logger:console,logErrors:!0,collapsed:void 0,predicate:void 0,duration:!1,timestamp:!0,stateTransformer:function(e){return e},actionTransformer:function(e){return e},errorTransformer:function(e){return e},colors:{title:function(){return"inherit"},prevState:function(){return"#9E9E9E"},action:function(){return"#03A9F4"},nextState:function(){return"#4CAF50"},error:function(){return"#F20404"}},diff:!1,diffPredicate:void 0,transformer:void 0},U=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.dispatch,n=e.getState;return"function"==typeof t||"function"==typeof n?O()({dispatch:t,getState:n}):void console.error("\n[redux-logger v3] BREAKING CHANGE\n[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.\n[redux-logger v3] Change\n[redux-logger v3] import createLogger from 'redux-logger'\n[redux-logger v3] to\n[redux-logger v3] import { createLogger } from 'redux-logger'\n")};t.defaults=A,t.createLogger=O,t.logger=U,t.default=U,Object.defineProperty(t,"__esModule",{value:!0})})}).call(t,n(18))},function(e,t,n){"use strict";function r(e){return function(t){var n=t.dispatch,r=t.getState;return function(t){return function(o){return"function"==typeof o?o(n,r,e):t(o)}}}}t.__esModule=!0;var o=r();o.withExtraArgument=r,t.default=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),a=n(109),i=r(a),u=n(122),l=r(u),s=n(186),c=r(s),f=n(187),p=r(f),d=n(188),h=r(d),m=n(189),v=r(m),y=n(190),b=r(y),g=n(191),E=r(g),_=(0,o.combineReducers)({errors:i.default,session:l.default,users:c.default,photos:p.default,albums:h.default,comments:v.default,tags:b.default,search:E.default});t.default=_},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(17),a=n(110),i=r(a),u=n(112),l=r(u),s=n(114),c=r(s),f=n(116),p=r(f),d=n(118),h=r(d),m=n(120),v=r(m),y=(0,o.combineReducers)({session:i.default,user:l.default,photo:c.default,album:p.default,comment:h.default,tag:v.default});t.default=y},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_SESSION_ERRORS:return t.errors;case r.RECEIVE_CURRENT_USER:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.signup=function(e){return $.ajax({method:"POST",url:"api/users",data:{user:e}})},t.login=function(e){return $.ajax({method:"POST",url:"api/session",data:{user:e}})},t.logout=function(){return $.ajax({method:"DELETE",url:"api/session"})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_USER_ERRORS:return t.errors;case r.RECEIVE_USER:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchAllUsers=function(){return $.ajax({method:"GET",url:"api/users"})},t.fetchUser=function(e){return $.ajax({method:"GET",url:"api/users/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_PHOTO_ERRORS:return t.errors;case r.RECEIVE_PHOTO:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.searchTaggedPhotos=function(e){return $.ajax({url:"api/search/photos/"+e,method:"GET"})},t.fetchPhotos=function(){return $.ajax({method:"GET",url:"api/photos"})},t.fetchPhoto=function(e){return $.ajax({method:"GET",url:"api/photos/"+e})},t.createPhoto=function(e){return $.ajax({method:"POST",url:"api/photos",contentType:!1,processData:!1,data:e})},t.updatePhoto=function(e){return $.ajax({method:"PATCH",url:"api/photos/"+e.id,data:{photo:e}})},t.deletePhoto=function(e){return $.ajax({method:"DELETE",url:"api/photos/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_ALBUM_ERRORS:return t.errors;case r.RECEIVE_ALBUM:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchAlbums=function(){return $.ajax({method:"GET",url:"api/albums"})},t.fetchAlbum=function(e){return $.ajax({method:"GET",url:"api/albums/"+e})},t.createAlbum=function(e){return $.ajax({method:"POST",url:"api/albums",contentType:!1,processData:!1,data:e})},t.updateAlbum=function(e){return $.ajax({method:"PATCH",url:"api/albums/"+e.get("id"),contentType:!1,processData:!1,data:e})},t.deleteAlbum=function(e){return $.ajax({method:"DELETE",url:"api/albums/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(13),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_COMMENT_ERRORS:return t.errors;case r.RECEIVE_COMMENT:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchComments=function(e){return $.ajax({method:"GET",url:"api/photos/"+e+"/comments"})},t.fetchComment=function(e){return $.ajax({method:"GET",url:"api/comment/"+e})},t.createComment=function(e){return $.ajax({method:"POST",url:"api/photos/"+e.photo_id+"/comments",data:{comment:e}})},t.updateComment=function(e,t){return $.ajax({method:"PATCH",url:"api/photos/"+e.photo_id+"/comments/"+t,data:{comment:e}})},t.deleteComment=function(e){return $.ajax({method:"DELETE",url:"api/comments/"+e})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(19),o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_TAG_ERRORS:return t.errors;case r.RECEIVE_TAG:return[];default:return e}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.fetchTags=function(e){return $.ajax({method:"GET",url:"api/photos/"+e+"/tags"})},t.fetchTag=function(e){return $.ajax({method:"GET",url:"api/tag/"+e})},t.createTag=function(e){return $.ajax({method:"POST",url:"api/photos/"+e.photo_id+"/tags",data:{tag:e}})},t.deleteTag=function(e,t){return $.ajax({method:"DELETE",url:"api/tags/"+e+"/photo/"+t})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10),o=n(8),a=n(9),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=Object.freeze({currentUser:null}),l=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,t=arguments[1];Object.freeze(e);var n=(0,i.default)({},e);switch(t.type){case r.RECEIVE_CURRENT_USER:var a=t.currentUser;return(0,i.default)({},{currentUser:a});case o.REMOVE_ALBUM:return n.currentUser.album_ids=n.currentUser.album_ids.filter(function(e){return e!=t.albumId}),n;case o.RECEIVE_CREATED_ALBUM:return n.currentUser.album_ids.push(t.albumId),n;default:return e}};t.default=l},function(e,t,n){function r(e,t,n,f,p){e!==t&&i(t,function(i,s){if(l(i))p||(p=new o),u(e,t,s,n,r,f,p);else{var d=f?f(c(e,s),i,s+"",e,t,p):void 0;void 0===d&&(d=i),a(e,s,d)}},s)}var o=n(124),a=n(53),i=n(155),u=n(157),l=n(11),s=n(63),c=n(62);e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e);this.size=t.size}var o=n(20),a=n(130),i=n(131),u=n(132),l=n(133),s=n(134);r.prototype.clear=a,r.prototype.delete=i,r.prototype.get=u,r.prototype.has=l,r.prototype.set=s,e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return!(n<0)&&(n==t.length-1?t.pop():i.call(t,n,1),--this.size,!0)}var o=n(21),a=Array.prototype,i=a.splice;e.exports=r},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return n<0?void 0:t[n][1]}var o=n(21);e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(21);e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(21);e.exports=r},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(20);e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){var n=this.__data__;if(n instanceof o){var r=n.__data__;if(!a||r.length<u-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new i(r)}return n.set(e,t),this.size=n.size,this}var o=n(20),a=n(50),i=n(142),u=200;e.exports=r},function(e,t,n){function r(e){return!(!i(e)||a(e))&&(o(e)?h:s).test(u(e))}var o=n(31),a=n(138),i=n(11),u=n(140),l=/[\\^$.*+?()[\]{}|]/g,s=/^\[object .+?Constructor\]$/,c=Function.prototype,f=Object.prototype,p=c.toString,d=f.hasOwnProperty,h=RegExp("^"+p.call(d).replace(l,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=r},function(e,t,n){function r(e){var t=i.call(e,l),n=e[l];try{e[l]=void 0;var r=!0}catch(e){}var o=u.call(e);return r&&(t?e[l]=n:delete e[l]),o}var o=n(51),a=Object.prototype,i=a.hasOwnProperty,u=a.toString,l=o?o.toStringTag:void 0;e.exports=r},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString;e.exports=n},function(e,t,n){function r(e){return!!a&&a in e}var o=n(139),a=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=r},function(e,t,n){var r=n(12),o=r["__core-js_shared__"];e.exports=o},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString;e.exports=n},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(143),a=n(150),i=n(152),u=n(153),l=n(154);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(i||a),string:new o}}var o=n(144),a=n(20),i=n(50);e.exports=r},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(145),a=n(146),i=n(147),u=n(148),l=n(149);r.prototype.clear=o,r.prototype.delete=a,r.prototype.get=i,r.prototype.has=u,r.prototype.set=l,e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(24);e.exports=r},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__;if(o){var n=t[e];return n===a?void 0:n}return u.call(t,e)?t[e]:void 0}var o=n(24),a="__lodash_hash_undefined__",i=Object.prototype,u=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return o?void 0!==t[e]:i.call(t,e)}var o=n(24),a=Object.prototype,i=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?a:t,this}var o=n(24),a="__lodash_hash_undefined__";e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e);return this.size-=t?1:0,t}var o=n(25);e.exports=r},function(e,t){function n(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(25);e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(25);e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(25);e.exports=r},function(e,t,n){var r=n(156),o=r();e.exports=o},function(e,t){function n(e){return function(t,n,r){for(var o=-1,a=Object(t),i=r(t),u=i.length;u--;){var l=i[e?u:++o];if(!1===n(a[l],l,a))break}return t}}e.exports=n},function(e,t,n){function r(e,t,n,r,g,E,_){var w=y(e,n),O=y(t,n),C=_.get(O);if(C)return void o(e,n,C);var x=E?E(w,O,n+"",e,t,_):void 0,P=void 0===x;if(P){var S=c(O),k=!S&&p(O),T=!S&&!k&&v(O);x=O,S||k||T?c(w)?x=w:f(w)?x=u(w):k?(P=!1,x=a(O,!0)):T?(P=!1,x=i(O,!0)):x=[]:m(O)||s(O)?(x=w,s(w)?x=b(w):(!h(w)||r&&d(w))&&(x=l(O))):P=!1}P&&(_.set(O,x),g(x,O,r,E,_),_.delete(O)),o(e,n,x)}var o=n(53),a=n(158),i=n(159),u=n(55),l=n(162),s=n(58),c=n(35),f=n(165),p=n(60),d=n(31),h=n(11),m=n(167),v=n(61),y=n(62),b=n(171);e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice();var n=e.length,r=s?s(n):new e.constructor(n);return e.copy(r),r}var o=n(12),a="object"==typeof t&&t&&!t.nodeType&&t,i=a&&"object"==typeof e&&e&&!e.nodeType&&e,u=i&&i.exports===a,l=u?o.Buffer:void 0,s=l?l.allocUnsafe:void 0;e.exports=r}).call(t,n(33)(e))},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}var o=n(160);e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength);return new o(t).set(new o(e)),t}var o=n(161);e.exports=r},function(e,t,n){var r=n(12),o=r.Uint8Array;e.exports=o},function(e,t,n){function r(e){return"function"!=typeof e.constructor||i(e)?{}:o(a(e))}var o=n(163),a=n(56),i=n(34);e.exports=r},function(e,t,n){var r=n(11),o=Object.create,a=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=a},function(e,t,n){function r(e){return a(e)&&o(e)==i}var o=n(23),a=n(14),i="[object Arguments]";e.exports=r},function(e,t,n){function r(e){return a(e)&&o(e)}var o=n(26),a=n(14);e.exports=r},function(e,t){function n(){return!1}e.exports=n},function(e,t,n){function r(e){if(!i(e)||o(e)!=u)return!1;var t=a(e);if(null===t)return!0;var n=f.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==p}var o=n(23),a=n(56),i=n(14),u="[object Object]",l=Function.prototype,s=Object.prototype,c=l.toString,f=s.hasOwnProperty,p=c.call(Object);e.exports=r},function(e,t,n){function r(e){return i(e)&&a(e.length)&&!!u[o(e)]}var o=n(23),a=n(59),i=n(14),u={};u["[object Float32Array]"]=u["[object Float64Array]"]=u["[object Int8Array]"]=u["[object Int16Array]"]=u["[object Int32Array]"]=u["[object Uint8Array]"]=u["[object Uint8ClampedArray]"]=u["[object Uint16Array]"]=u["[object Uint32Array]"]=!0,u["[object Arguments]"]=u["[object Array]"]=u["[object ArrayBuffer]"]=u["[object Boolean]"]=u["[object DataView]"]=u["[object Date]"]=u["[object Error]"]=u["[object Function]"]=u["[object Map]"]=u["[object Number]"]=u["[object Object]"]=u["[object RegExp]"]=u["[object Set]"]=u["[object String]"]=u["[object WeakMap]"]=!1,e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){(function(e){var r=n(52),o="object"==typeof t&&t&&!t.nodeType&&t,a=o&&"object"==typeof e&&e&&!e.nodeType&&e,i=a&&a.exports===o,u=i&&r.process,l=function(){try{return u&&u.binding&&u.binding("util")}catch(e){}}();e.exports=l}).call(t,n(33)(e))},function(e,t,n){function r(e){return o(e,a(e))}var o=n(172),a=n(63);e.exports=r},function(e,t,n){function r(e,t,n,r){var i=!n;n||(n={});for(var u=-1,l=t.length;++u<l;){var s=t[u],c=r?r(n[s],e[s],s,n,e):void 0;void 0===c&&(c=e[s]),i?a(n,s,c):o(n,s,c)}return n}var o=n(173),a=n(32);e.exports=r},function(e,t,n){function r(e,t,n){var r=e[t];u.call(e,t)&&a(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(32),a=n(22),i=Object.prototype,u=i.hasOwnProperty;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}e.exports=n},function(e,t,n){function r(e){if(!o(e))return i(e);var t=a(e),n=[];for(var r in e)("constructor"!=r||!t&&l.call(e,r))&&n.push(r);return n}var o=n(11),a=n(34),i=n(176),u=Object.prototype,l=u.hasOwnProperty;e.exports=r},function(e,t){function n(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}e.exports=n},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,i=o>1?n[o-1]:void 0,u=o>2?n[2]:void 0;for(i=e.length>3&&"function"==typeof i?(o--,i):void 0,u&&a(n[0],n[1],u)&&(i=o<3?void 0:i,o=1),t=Object(t);++r<o;){var l=n[r];l&&e(t,l,r,i)}return t})}var o=n(178),a=n(185);e.exports=r},function(e,t,n){function r(e,t){return i(a(e,t,o),e+"")}var o=n(66),a=n(179),i=n(181);e.exports=r},function(e,t,n){function r(e,t,n){return t=a(void 0===t?e.length-1:t,0),function(){for(var r=arguments,i=-1,u=a(r.length-t,0),l=Array(u);++i<u;)l[i]=r[t+i];i=-1;for(var s=Array(t+1);++i<t;)s[i]=r[i];return s[t]=n(l),o(e,this,s)}}var o=n(180),a=Math.max;e.exports=r},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){var r=n(182),o=n(184),a=o(r);e.exports=a},function(e,t,n){var r=n(183),o=n(54),a=n(66),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:a;e.exports=i},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t){function n(e){var t=0,n=0;return function(){var i=a(),u=o-(i-n);if(n=i,u>0){if(++t>=r)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}var r=800,o=16,a=Date.now;e.exports=n},function(e,t,n){function r(e,t,n){if(!u(n))return!1;var r=typeof t;return!!("number"==r?a(n)&&i(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(22),a=n(26),i=n(65),u=n(11);e.exports=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,a.default)({},e);switch(t.type){case r.RECEIVE_ALL_USERS:return(0,a.default)({},t.users);case r.RECEIVE_USER:return n[t.user.id]=t.user,n;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,a.default)({},e);switch(t.type){case r.RECEIVE_PHOTOS:return(0,a.default)({},t.photos);case r.RECEIVE_PHOTO:return n[t.photo.id]=t.photo,n;case r.REMOVE_PHOTO:return delete n[t.photoId],n;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,a.default)({},e);switch(t.type){case r.RECEIVE_ALBUMS:return(0,a.default)({},t.albums);case r.RECEIVE_ALBUM:return n[t.album.id]=t.album,n;case r.REMOVE_ALBUM:return delete n[t.albumId],n;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(13),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,a.default)({},e);switch(t.type){case r.RECEIVE_ALL_COMMENTS:return(0,a.default)({},t.comments);case r.RECEIVE_COMMENT:return n[t.comment.id]=t.comment,n;case r.REMOVE_COMMENT:return delete n[t.commentId],n;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(19),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments[1];Object.freeze(e);var n=(0,a.default)({},e);switch(t.type){case r.RECEIVE_ALL_TAGS:return(0,a.default)({},t.tags);case r.RECEIVE_TAG:return n[t.tag.id]=t.tag,n;case r.REMOVE_TAG:return delete n[t.tagId],n;default:return e}};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),o=n(9),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{photos:{}},t=arguments[1];switch(Object.freeze(e),t.type){case r.RECEIVE_SEARCH_PHOTOS:return(0,a.default)({},{photos:t.photos});default:return e}};t.default=i},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(2),u=n(1),l=n(230),s=r(l),c=function(e){var t=e.store;return a.default.createElement(i.Provider,{store:t},a.default.createElement(u.HashRouter,null,a.default.createElement(s.default,null)))};t.default=c},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"store",n=arguments[1],i=n||t+"Subscription",l=function(e){function n(a,i){r(this,n);var u=o(this,e.call(this,a,i));return u[t]=a.store,u}return a(n,e),n.prototype.getChildContext=function(){var e;return e={},e[t]=this[t],e[i]=null,e},n.prototype.render=function(){return u.Children.only(this.props.children)},n}(u.Component);return l.propTypes={store:c.a.isRequired,children:s.a.element.isRequired},l.childContextTypes=(e={},e[t]=c.a.isRequired,e[i]=c.b,e),l}t.a=i;var u=n(0),l=(n.n(u),n(4)),s=n.n(l),c=n(67);n(36);t.b=i()},function(e,t,n){"use strict";var r=n(28),o=n(195),a=n(196);e.exports=function(){function e(e,t,n,r,i,u){u!==a&&o(!1,"Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types")}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=r,n.PropTypes=n,n}},function(e,t,n){"use strict";function r(e,t,n,r,a,i,u,l){if(o(t),!e){var s;if(void 0===t)s=new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var c=[n,r,a,i,u,l],f=0;s=new Error(t.replace(/%s/g,function(){return c[f++]})),s.name="Invariant Violation"}throw s.framesToPop=1,s}}var o=function(e){};e.exports=r},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){var e=[],t=[];return{clear:function(){t=a,e=a},notify:function(){for(var n=e=t,r=0;r<n.length;r++)n[r]()},get:function(){return t},subscribe:function(n){var r=!0;return t===e&&(t=e.slice()),t.push(n),function(){r&&e!==a&&(r=!1,t===e&&(t=e.slice()),t.splice(t.indexOf(n),1))}}}}n.d(t,"a",function(){return u});var a=null,i={notify:function(){}},u=function(){function e(t,n,o){r(this,e),this.store=t,this.parentSub=n,this.onStateChange=o,this.unsubscribe=null,this.listeners=i}return e.prototype.addNestedSub=function(e){return this.trySubscribe(),this.listeners.subscribe(e)},e.prototype.notifyNestedSubs=function(){this.listeners.notify()},e.prototype.isSubscribed=function(){return Boolean(this.unsubscribe)},e.prototype.trySubscribe=function(){this.unsubscribe||(this.unsubscribe=this.parentSub?this.parentSub.addNestedSub(this.onStateChange):this.store.subscribe(this.onStateChange),this.listeners=o())},e.prototype.tryUnsubscribe=function(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null,this.listeners.clear(),this.listeners=i)},e}()},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n){for(var r=t.length-1;r>=0;r--){var o=t[r](e);if(o)return o}return function(t,r){throw new Error("Invalid value of type "+typeof e+" for "+n+" argument when connecting component "+r.wrappedComponentName+".")}}function a(e,t){return e===t}var i=n(68),u=n(199),l=n(200),s=n(201),c=n(202),f=n(203),p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.connectHOC,n=void 0===t?i.a:t,d=e.mapStateToPropsFactories,h=void 0===d?s.a:d,m=e.mapDispatchToPropsFactories,v=void 0===m?l.a:m,y=e.mergePropsFactories,b=void 0===y?c.a:y,g=e.selectorFactory,E=void 0===g?f.a:g;return function(e,t,i){var l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},s=l.pure,c=void 0===s||s,f=l.areStatesEqual,d=void 0===f?a:f,m=l.areOwnPropsEqual,y=void 0===m?u.a:m,g=l.areStatePropsEqual,_=void 0===g?u.a:g,w=l.areMergedPropsEqual,O=void 0===w?u.a:w,C=r(l,["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"]),x=o(e,h,"mapStateToProps"),P=o(t,v,"mapDispatchToProps"),S=o(i,b,"mergeProps");return n(E,p({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:Boolean(e),initMapStateToProps:x,initMapDispatchToProps:P,initMergeProps:S,pure:c,areStatesEqual:d,areOwnPropsEqual:y,areStatePropsEqual:_,areMergedPropsEqual:O},C))}}()},function(e,t,n){"use strict";function r(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!==e&&t!==t}function o(e,t){if(r(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(var i=0;i<n.length;i++)if(!a.call(t,n[i])||!r(e[n[i]],t[n[i]]))return!1;return!0}t.a=o;var a=Object.prototype.hasOwnProperty},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(u.b)(e,"mapDispatchToProps"):void 0}function o(e){return e?void 0:Object(u.a)(function(e){return{dispatch:e}})}function a(e){return e&&"object"==typeof e?Object(u.a)(function(t){return Object(i.bindActionCreators)(e,t)}):void 0}var i=n(17),u=n(70);t.a=[r,o,a]},function(e,t,n){"use strict";function r(e){return"function"==typeof e?Object(a.b)(e,"mapStateToProps"):void 0}function o(e){return e?void 0:Object(a.a)(function(){return{}})}var a=n(70);t.a=[r,o]},function(e,t,n){"use strict";function r(e,t,n){return u({},n,e,t)}function o(e){return function(t,n){var r=(n.displayName,n.pure),o=n.areMergedPropsEqual,a=!1,i=void 0;return function(t,n,u){var l=e(t,n,u);return a?r&&o(l,i)||(i=l):(a=!0,i=l),i}}}function a(e){return"function"==typeof e?o(e):void 0}function i(e){return e?void 0:function(){return r}}var u=(n(71),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e});t.a=[a,i]},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t,n,r){return function(o,a){return n(e(o,a),t(r,a),a)}}function a(e,t,n,r,o){function a(o,a){return h=o,m=a,v=e(h,m),y=t(r,m),b=n(v,y,m),d=!0,b}function i(){return v=e(h,m),t.dependsOnOwnProps&&(y=t(r,m)),b=n(v,y,m)}function u(){return e.dependsOnOwnProps&&(v=e(h,m)),t.dependsOnOwnProps&&(y=t(r,m)),b=n(v,y,m)}function l(){var t=e(h,m),r=!p(t,v);return v=t,r&&(b=n(v,y,m)),b}function s(e,t){var n=!f(t,m),r=!c(e,h);return h=e,m=t,n&&r?i():n?u():r?l():b}var c=o.areStatesEqual,f=o.areOwnPropsEqual,p=o.areStatePropsEqual,d=!1,h=void 0,m=void 0,v=void 0,y=void 0,b=void 0;return function(e,t){return d?s(e,t):a(e,t)}}function i(e,t){var n=t.initMapStateToProps,i=t.initMapDispatchToProps,u=t.initMergeProps,l=r(t,["initMapStateToProps","initMapDispatchToProps","initMergeProps"]),s=n(e,l),c=i(e,l),f=u(e,l);return(l.pure?a:o)(s,c,f,e,l)}t.a=i;n(204)},function(e,t,n){"use strict";n(36)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(3),u=n.n(i),l=n(0),s=n.n(l),c=n(4),f=n.n(c),p=n(206),d=n.n(p),h=n(39),m=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=a=o(this,e.call.apply(e,[this].concat(l))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<BrowserRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { BrowserRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);m.propTypes={basename:f.a.string,forceRefresh:f.a.bool,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(3),u=r(i),l=n(6),s=r(l),c=n(37),f=n(15),p=n(38),d=r(p),h=n(74),m=function(){try{return window.history.state||{}}catch(e){return{}}},v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,s.default)(h.canUseDOM,"Browser history needs a DOM");var t=window.history,n=(0,h.supportsHistory)(),r=!(0,h.supportsPopStateOnHashChange)(),i=e.forceRefresh,l=void 0!==i&&i,p=e.getUserConfirmation,v=void 0===p?h.getConfirmation:p,y=e.keyLength,b=void 0===y?6:y,g=e.basename?(0,f.stripTrailingSlash)((0,f.addLeadingSlash)(e.basename)):"",E=function(e){var t=e||{},n=t.key,r=t.state,o=window.location,a=o.pathname,i=o.search,l=o.hash,s=a+i+l;return(0,u.default)(!g||(0,f.hasBasename)(s,g),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+s+'" to begin with "'+g+'".'),g&&(s=(0,f.stripBasename)(s,g)),(0,c.createLocation)(s,r,n)},_=function(){return Math.random().toString(36).substr(2,b)},w=(0,d.default)(),O=function(e){a(z,e),z.length=t.length,w.notifyListeners(z.location,z.action)},C=function(e){(0,h.isExtraneousPopstateEvent)(e)||S(E(e.state))},x=function(){S(E(m()))},P=!1,S=function(e){if(P)P=!1,O();else{w.confirmTransitionTo(e,"POP",v,function(t){t?O({action:"POP",location:e}):k(e)})}},k=function(e){var t=z.location,n=j.indexOf(t.key);-1===n&&(n=0);var r=j.indexOf(e.key);-1===r&&(r=0);var o=n-r;o&&(P=!0,A(o))},T=E(m()),j=[T.key],N=function(e){return g+(0,f.createPath)(e)},R=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,c.createLocation)(e,r,_(),z.location);w.confirmTransitionTo(a,"PUSH",v,function(e){if(e){var r=N(a),o=a.key,i=a.state;if(n)if(t.pushState({key:o,state:i},null,r),l)window.location.href=r;else{var s=j.indexOf(z.location.key),c=j.slice(0,-1===s?0:s+1);c.push(a.key),j=c,O({action:"PUSH",location:a})}else(0,u.default)(void 0===i,"Browser history cannot push state in browsers that do not support HTML5 history"),window.location.href=r}})},M=function(e,r){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==r),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var a=(0,c.createLocation)(e,r,_(),z.location);w.confirmTransitionTo(a,"REPLACE",v,function(e){if(e){var r=N(a),o=a.key,i=a.state;if(n)if(t.replaceState({key:o,state:i},null,r),l)window.location.replace(r);else{var s=j.indexOf(z.location.key);-1!==s&&(j[s]=a.key),O({action:"REPLACE",location:a})}else(0,u.default)(void 0===i,"Browser history cannot replace state in browsers that do not support HTML5 history"),window.location.replace(r)}})},A=function(e){t.go(e)},U=function(){return A(-1)},I=function(){return A(1)},L=0,D=function(e){L+=e,1===L?((0,h.addEventListener)(window,"popstate",C),r&&(0,h.addEventListener)(window,"hashchange",x)):0===L&&((0,h.removeEventListener)(window,"popstate",C),r&&(0,h.removeEventListener)(window,"hashchange",x))},F=!1,V=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=w.setPrompt(e);return F||(D(1),F=!0),function(){return F&&(F=!1,D(-1)),t()}},H=function(e){var t=w.appendListener(e);return D(1),function(){D(-1),t()}},z={length:t.length,action:"POP",location:T,createHref:N,push:R,replace:M,go:A,goBack:U,goForward:I,block:V,listen:H};return z};t.default=v},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(3),u=n.n(i),l=n(0),s=n.n(l),c=n(4),f=n.n(c),p=n(208),d=n.n(p),h=n(39),m=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=a=o(this,e.call.apply(e,[this].concat(l))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<HashRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { HashRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);m.propTypes={basename:f.a.string,getUserConfirmation:f.a.func,hashType:f.a.oneOf(["hashbang","noslash","slash"]),children:f.a.node},t.a=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(3),i=r(a),u=n(6),l=r(u),s=n(37),c=n(15),f=n(38),p=r(f),d=n(74),h={hashbang:{encodePath:function(e){return"!"===e.charAt(0)?e:"!/"+(0,c.stripLeadingSlash)(e)},decodePath:function(e){return"!"===e.charAt(0)?e.substr(1):e}},noslash:{encodePath:c.stripLeadingSlash,decodePath:c.addLeadingSlash},slash:{encodePath:c.addLeadingSlash,decodePath:c.addLeadingSlash}},m=function(){var e=window.location.href,t=e.indexOf("#");return-1===t?"":e.substring(t+1)},v=function(e){return window.location.hash=e},y=function(e){var t=window.location.href.indexOf("#");window.location.replace(window.location.href.slice(0,t>=0?t:0)+"#"+e)},b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,l.default)(d.canUseDOM,"Hash history needs a DOM");var t=window.history,n=(0,d.supportsGoWithoutReloadUsingHash)(),r=e.getUserConfirmation,a=void 0===r?d.getConfirmation:r,u=e.hashType,f=void 0===u?"slash":u,b=e.basename?(0,c.stripTrailingSlash)((0,c.addLeadingSlash)(e.basename)):"",g=h[f],E=g.encodePath,_=g.decodePath,w=function(){var e=_(m());return(0,i.default)(!b||(0,c.hasBasename)(e,b),'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "'+e+'" to begin with "'+b+'".'),b&&(e=(0,c.stripBasename)(e,b)),(0,s.createLocation)(e)},O=(0,p.default)(),C=function(e){o(q,e),q.length=t.length,O.notifyListeners(q.location,q.action)},x=!1,P=null,S=function(){var e=m(),t=E(e);if(e!==t)y(t);else{var n=w(),r=q.location;if(!x&&(0,s.locationsAreEqual)(r,n))return;if(P===(0,c.createPath)(n))return;P=null,k(n)}},k=function(e){if(x)x=!1,C();else{O.confirmTransitionTo(e,"POP",a,function(t){t?C({action:"POP",location:e}):T(e)})}},T=function(e){var t=q.location,n=M.lastIndexOf((0,c.createPath)(t));-1===n&&(n=0);var r=M.lastIndexOf((0,c.createPath)(e));-1===r&&(r=0);var o=n-r;o&&(x=!0,L(o))},j=m(),N=E(j);j!==N&&y(N);var R=w(),M=[(0,c.createPath)(R)],A=function(e){return"#"+E(b+(0,c.createPath)(e))},U=function(e,t){(0,i.default)(void 0===t,"Hash history cannot push state; it is ignored");var n=(0,s.createLocation)(e,void 0,void 0,q.location);O.confirmTransitionTo(n,"PUSH",a,function(e){if(e){var t=(0,c.createPath)(n),r=E(b+t);if(m()!==r){P=t,v(r);var o=M.lastIndexOf((0,c.createPath)(q.location)),a=M.slice(0,-1===o?0:o+1);a.push(t),M=a,C({action:"PUSH",location:n})}else(0,i.default)(!1,"Hash history cannot PUSH the same path; a new entry will not be added to the history stack"),C()}})},I=function(e,t){(0,i.default)(void 0===t,"Hash history cannot replace state; it is ignored");var n=(0,s.createLocation)(e,void 0,void 0,q.location);O.confirmTransitionTo(n,"REPLACE",a,function(e){if(e){var t=(0,c.createPath)(n),r=E(b+t);m()!==r&&(P=t,y(r));var o=M.indexOf((0,c.createPath)(q.location));-1!==o&&(M[o]=t),C({action:"REPLACE",location:n})}})},L=function(e){(0,i.default)(n,"Hash history go(n) causes a full page reload in this browser"),t.go(e)},D=function(){return L(-1)},F=function(){return L(1)},V=0,H=function(e){V+=e,1===V?(0,d.addEventListener)(window,"hashchange",S):0===V&&(0,d.removeEventListener)(window,"hashchange",S)},z=!1,B=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=O.setPrompt(e);return z||(H(1),z=!0),function(){return z&&(z=!1,H(-1)),t()}},W=function(e){var t=O.appendListener(e);return H(1),function(){H(-1),t()}},q={length:t.length,action:"POP",location:R,createHref:A,push:U,replace:I,go:L,goBack:D,goForward:F,block:B,listen:W};return q};t.default=b},function(e,t,n){"use strict";var r=n(210);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(3),u=n.n(i),l=n(0),s=n.n(l),c=n(4),f=n.n(c),p=n(211),d=n.n(p),h=n(40),m=function(e){function t(){var n,a,i;r(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=a=o(this,e.call.apply(e,[this].concat(l))),a.history=d()(a.props),i=n,o(a,i)}return a(t,e),t.prototype.componentWillMount=function(){u()(!this.props.history,"<MemoryRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { MemoryRouter as Router }`.")},t.prototype.render=function(){return s.a.createElement(h.a,{history:this.history,children:this.props.children})},t}(s.a.Component);m.propTypes={initialEntries:f.a.array,initialIndex:f.a.number,getUserConfirmation:f.a.func,keyLength:f.a.number,children:f.a.node},t.a=m},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(3),u=r(i),l=n(15),s=n(37),c=n(38),f=r(c),p=function(e,t,n){return Math.min(Math.max(e,t),n)},d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.getUserConfirmation,n=e.initialEntries,r=void 0===n?["/"]:n,i=e.initialIndex,c=void 0===i?0:i,d=e.keyLength,h=void 0===d?6:d,m=(0,f.default)(),v=function(e){a(T,e),T.length=T.entries.length,m.notifyListeners(T.location,T.action)},y=function(){return Math.random().toString(36).substr(2,h)},b=p(c,0,r.length-1),g=r.map(function(e){return"string"==typeof e?(0,s.createLocation)(e,void 0,y()):(0,s.createLocation)(e,void 0,e.key||y())}),E=l.createPath,_=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,s.createLocation)(e,n,y(),T.location);m.confirmTransitionTo(r,"PUSH",t,function(e){if(e){var t=T.index,n=t+1,o=T.entries.slice(0);o.length>n?o.splice(n,o.length-n,r):o.push(r),v({action:"PUSH",location:r,index:n,entries:o})}})},w=function(e,n){(0,u.default)(!("object"===(void 0===e?"undefined":o(e))&&void 0!==e.state&&void 0!==n),"You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored");var r=(0,s.createLocation)(e,n,y(),T.location);m.confirmTransitionTo(r,"REPLACE",t,function(e){e&&(T.entries[T.index]=r,v({action:"REPLACE",location:r}))})},O=function(e){var n=p(T.index+e,0,T.entries.length-1),r=T.entries[n];m.confirmTransitionTo(r,"POP",t,function(e){e?v({action:"POP",location:r,index:n}):v()})},C=function(){return O(-1)},x=function(){return O(1)},P=function(e){var t=T.index+e;return t>=0&&t<T.entries.length},S=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return m.setPrompt(e)},k=function(e){return m.appendListener(e)},T={length:g.length,action:"POP",location:g[b],index:b,entries:g,createHref:E,push:_,replace:w,go:O,goBack:C,goForward:x,canGo:P,block:S,listen:k};return T};t.default=d},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),a=n.n(o),i=n(4),u=n.n(i),l=n(76),s=n(75),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p=function(e){var t=e.to,n=e.exact,o=e.strict,i=e.location,u=e.activeClassName,p=e.className,d=e.activeStyle,h=e.style,m=e.isActive,v=e.ariaCurrent,y=r(e,["to","exact","strict","location","activeClassName","className","activeStyle","style","isActive","ariaCurrent"]);return a.a.createElement(l.a,{path:"object"===(void 0===t?"undefined":f(t))?t.pathname:t,exact:n,strict:o,location:i,children:function(e){var n=e.location,r=e.match,o=!!(m?m(r,n):r);return a.a.createElement(s.a,c({to:t,className:o?[p,u].filter(function(e){return e}).join(" "):p,style:o?c({},h,d):h,"aria-current":o&&v},y))}})};p.propTypes={to:s.a.propTypes.to,exact:u.a.bool,strict:u.a.bool,location:u.a.object,activeClassName:u.a.string,className:u.a.string,activeStyle:u.a.object,style:u.a.object,isActive:u.a.func,ariaCurrent:u.a.oneOf(["page","step","location","true"])},p.defaultProps={activeClassName:"active",ariaCurrent:"true"},t.a=p},function(e,t,n){function r(e,t){for(var n,r=[],o=0,a=0,i="",u=t&&t.delimiter||"/";null!=(n=b.exec(e));){var c=n[0],f=n[1],p=n.index;if(i+=e.slice(a,p),a=p+c.length,f)i+=f[1];else{var d=e[a],h=n[2],m=n[3],v=n[4],y=n[5],g=n[6],E=n[7];i&&(r.push(i),i="");var _=null!=h&&null!=d&&d!==h,w="+"===g||"*"===g,O="?"===g||"*"===g,C=n[2]||u,x=v||y;r.push({name:m||o++,prefix:h||"",delimiter:C,optional:O,repeat:w,partial:_,asterisk:!!E,pattern:x?s(x):E?".*":"[^"+l(C)+"]+?"})}}return a<e.length&&(i+=e.substr(a)),i&&r.push(i),r}function o(e,t){return u(r(e,t))}function a(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function i(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function u(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var o="",u=n||{},l=r||{},s=l.pretty?a:encodeURIComponent,c=0;c<e.length;c++){var f=e[c];if("string"!=typeof f){var p,d=u[f.name];if(null==d){if(f.optional){f.partial&&(o+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(y(d)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(d)+"`");if(0===d.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var h=0;h<d.length;h++){if(p=s(d[h]),!t[c].test(p))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===h?f.prefix:f.delimiter)+p}}else{if(p=f.asterisk?i(d):s(d),!t[c].test(p))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+p+'"');o+=f.prefix+p}}else o+=f}return o}}function l(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function f(e){return e.sensitive?"":"i"}function p(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}function d(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(v(e[o],t,n).source);return c(new RegExp("(?:"+r.join("|")+")",f(n)),t)}function h(e,t,n){return m(r(e,n),t,n)}function m(e,t,n){y(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=!1!==n.end,a="",i=0;i<e.length;i++){var u=e[i];if("string"==typeof u)a+=l(u);else{var s=l(u.prefix),p="(?:"+u.pattern+")";t.push(u),u.repeat&&(p+="(?:"+s+p+")*"),p=u.optional?u.partial?s+"("+p+")?":"(?:"+s+"("+p+"))?":s+"("+p+")",a+=p}}var d=l(n.delimiter||"/"),h=a.slice(-d.length)===d;return r||(a=(h?a.slice(0,-d.length):a)+"(?:"+d+"(?=$))?"),a+=o?"$":r&&h?"":"(?="+d+"|$)",c(new RegExp("^"+a,f(n)),t)}function v(e,t,n){return y(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?p(e,t):y(e)?d(e,t,n):h(e,t,n)}var y=n(214);e.exports=v,e.exports.parse=r,e.exports.compile=o,e.exports.tokensToFunction=u,e.exports.tokensToRegExp=m;var b=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},function(e,t){e.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},function(e,t,n){"use strict";var r=n(216);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),l=n(4),s=n.n(l),c=n(6),f=n.n(c),p=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.enable=function(e){this.unblock&&this.unblock(),this.unblock=this.context.router.history.block(e)},t.prototype.disable=function(){this.unblock&&(this.unblock(),this.unblock=null)},t.prototype.componentWillMount=function(){f()(this.context.router,"You should not use <Prompt> outside a <Router>"),this.props.when&&this.enable(this.props.message)},t.prototype.componentWillReceiveProps=function(e){e.when?this.props.when&&this.props.message===e.message||this.enable(e.message):this.disable()},t.prototype.componentWillUnmount=function(){this.disable()},t.prototype.render=function(){return null},t}(u.a.Component);p.propTypes={when:s.a.bool,message:s.a.oneOfType([s.a.func,s.a.string]).isRequired},p.defaultProps={when:!0},p.contextTypes={router:s.a.shape({history:s.a.shape({block:s.a.func.isRequired}).isRequired}).isRequired},t.a=p},function(e,t,n){"use strict";var r=n(218);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),l=n(4),s=n.n(l),c=n(3),f=n.n(c),p=n(6),d=n.n(p),h=n(219),m=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(h.a)(e.to),n=Object(h.a)(this.props.to);if(Object(h.b)(t,n))return void f()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"');this.perform()},t.prototype.perform=function(){var e=this.context.router.history,t=this.props,n=t.push,r=t.to;n?e.push(r):e.replace(r)},t.prototype.render=function(){return null},t}(u.a.Component);m.propTypes={push:s.a.bool,from:s.a.string,to:s.a.oneOfType([s.a.string,s.a.object]).isRequired},m.defaultProps={push:!1},m.contextTypes={router:s.a.shape({history:s.a.shape({push:s.a.func.isRequired,replace:s.a.func.isRequired}).isRequired,staticContext:s.a.object}).isRequired},t.a=m},function(e,t,n){"use strict";var r=(n(220),n(221),n(222),n(27));n.d(t,"a",function(){return r.a}),n.d(t,"b",function(){return r.b});n(16)},function(e,t,n){"use strict";var r=n(3),o=(n.n(r),n(6));n.n(o),n(27),n(16),n(42),n(78),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(3),o=(n.n(r),n(6)),a=(n.n(o),n(27),n(16));n(42),n(78),Object.assign,a.f,a.a,a.a,a.a},function(e,t,n){"use strict";var r=n(3);n.n(r),n(16),n(27),n(42),"function"==typeof Symbol&&Symbol.iterator,Object.assign},function(e,t,n){"use strict";var r=n(224);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var u=n(3),l=n.n(u),s=n(6),c=n.n(s),f=n(0),p=n.n(f),d=n(4),h=n.n(d),m=n(15),v=(n.n(m),n(40)),y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},b=function(e){var t=e.pathname,n=void 0===t?"/":t,r=e.search,o=void 0===r?"":r,a=e.hash,i=void 0===a?"":a;return{pathname:n,search:"?"===o?"":o,hash:"#"===i?"":i}},g=function(e,t){return e?y({},t,{pathname:Object(m.addLeadingSlash)(e)+t.pathname}):t},E=function(e,t){if(!e)return t;var n=Object(m.addLeadingSlash)(e);return 0!==t.pathname.indexOf(n)?t:y({},t,{pathname:t.pathname.substr(n.length)})},_=function(e){return"string"==typeof e?Object(m.parsePath)(e):b(e)},w=function(e){return"string"==typeof e?e:Object(m.createPath)(e)},O=function(e){return function(){c()(!1,"You cannot %s with <StaticRouter>",e)}},C=function(){},x=function(e){function t(){var n,r,i;o(this,t);for(var u=arguments.length,l=Array(u),s=0;s<u;s++)l[s]=arguments[s];return n=r=a(this,e.call.apply(e,[this].concat(l))),r.createHref=function(e){return Object(m.addLeadingSlash)(r.props.basename+w(e))},r.handlePush=function(e){var t=r.props,n=t.basename,o=t.context;o.action="PUSH",o.location=g(n,_(e)),o.url=w(o.location)},r.handleReplace=function(e){var t=r.props,n=t.basename,o=t.context;o.action="REPLACE",o.location=g(n,_(e)),o.url=w(o.location)},r.handleListen=function(){return C},r.handleBlock=function(){return C},i=n,a(r,i)}return i(t,e),t.prototype.getChildContext=function(){return{router:{staticContext:this.props.context}}},t.prototype.componentWillMount=function(){l()(!this.props.history,"<StaticRouter> ignores the history prop. To use a custom history, use `import { Router }` instead of `import { StaticRouter as Router }`.")},t.prototype.render=function(){var e=this.props,t=e.basename,n=(e.context,e.location),o=r(e,["basename","context","location"]),a={createHref:this.createHref,action:"POP",location:E(t,_(n)),push:this.handlePush,replace:this.handleReplace,go:O("go"),goBack:O("goBack"),goForward:O("goForward"),listen:this.handleListen,block:this.handleBlock};return p.a.createElement(v.a,y({},o,{history:a}))},t}(p.a.Component);x.propTypes={basename:h.a.string,context:h.a.object.isRequired,location:h.a.oneOfType([h.a.string,h.a.object])},x.defaultProps={basename:"",location:"/"},x.childContextTypes={router:h.a.object.isRequired},t.a=x},function(e,t,n){"use strict";var r=n(226);t.a=r.a},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(0),u=n.n(i),l=n(4),s=n.n(l),c=n(3),f=n.n(c),p=n(6),d=n.n(p),h=n(41),m=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return a(t,e),t.prototype.componentWillMount=function(){d()(this.context.router,"You should not use <Switch> outside a <Router>")},t.prototype.componentWillReceiveProps=function(e){f()(!(e.location&&!this.props.location),'<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'),f()(!(!e.location&&this.props.location),'<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.')},t.prototype.render=function(){var e=this.context.router.route,t=this.props.children,n=this.props.location||e.location,r=void 0,o=void 0;return u.a.Children.forEach(t,function(t){if(u.a.isValidElement(t)){var a=t.props,i=a.path,l=a.exact,s=a.strict,c=a.sensitive,f=a.from,p=i||f;null==r&&(o=t,r=p?Object(h.a)(n.pathname,{path:p,exact:l,strict:s,sensitive:c}):e.match)}}),r?u.a.cloneElement(o,{location:n,computedMatch:r}):null},t}(u.a.Component);m.contextTypes={router:s.a.shape({route:s.a.object.isRequired}).isRequired},m.propTypes={children:s.a.node,location:s.a.object},t.a=m},function(e,t,n){"use strict";var r=n(41);t.a=r.a},function(e,t,n){"use strict";var r=n(229);t.a=r.a},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}var o=n(0),a=n.n(o),i=n(4),u=n.n(i),l=n(69),s=n.n(l),c=n(77),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p=function(e){var t=function(t){var n=t.wrappedComponentRef,o=r(t,["wrappedComponentRef"]);return a.a.createElement(c.a,{render:function(t){return a.a.createElement(e,f({},o,t,{ref:n}))}})};return t.displayName="withRouter("+(e.displayName||e.name)+")",t.WrappedComponent=e,t.propTypes={wrappedComponentRef:u.a.func},s()(t,e)};t.a=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(1),u=n(231),l=n(232),s=r(l),c=n(234),f=r(c),p=n(236),d=r(p),h=n(237),m=r(h),v=n(239),y=r(v),b=n(241),g=r(b),E=n(254),_=r(E),w=n(259),O=r(w),C=n(261),x=r(C),P=n(263),S=r(P),k=n(275),T=r(k),j=n(277),N=r(j),R=n(279),M=r(R),A=n(281),U=r(A),I=n(283),L=r(I),D=n(285),F=r(D),V=n(289),H=r(V),z=function(){return a.default.createElement("div",null,a.default.createElement(i.Switch,null,a.default.createElement(u.AuthRoute,{exact:!0,path:"/signup",component:d.default}),a.default.createElement(u.AuthRoute,{exact:!0,path:"/login",component:d.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/photos/upload",component:O.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/albums/new",component:T.default}),a.default.createElement(u.ProtectedRoute,{path:"/albums/:albumId/edit",component:U.default}),a.default.createElement(i.Route,{path:"/",component:s.default})),a.default.createElement(i.Switch,null,a.default.createElement(u.AuthRoute,{exact:!0,path:"/signup",component:m.default}),a.default.createElement(u.AuthRoute,{exact:!0,path:"/login",component:y.default}),a.default.createElement(u.AuthRoute,{exact:!0,path:"/",component:f.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/feed",component:g.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/users/:userId",component:_.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/photos/upload",component:x.default}),a.default.createElement(u.ProtectedRoute,{path:"/photos/:photoId",component:S.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/albums/new",component:N.default}),a.default.createElement(u.ProtectedRoute,{path:"/albums/:albumId/edit",component:L.default}),a.default.createElement(u.ProtectedRoute,{path:"/albums/:albumId",component:M.default}),a.default.createElement(u.ProtectedRoute,{exact:!0,path:"/search/photos/:searchParams",component:F.default}),a.default.createElement(i.Redirect,{to:"/"})),a.default.createElement(H.default,null))};t.default=z},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProtectedRoute=t.AuthRoute=void 0;var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(2),i=n(1),u=function(e){var t=e.component,n=e.path,r=e.loggedIn,a=e.exact;return o.default.createElement(i.Route,{path:n,exact:a,render:function(e){return r?o.default.createElement(i.Redirect,{to:"/feed"}):o.default.createElement(t,e)}})},l=function(e){var t=e.component,n=e.path,r=e.loggedIn,a=e.exact;return o.default.createElement(i.Route,{path:n,exact:a,render:function(e){return r?o.default.createElement(t,e):o.default.createElement(i.Redirect,{to:"/login"})}})},s=function(e){return{loggedIn:Boolean(e.session.currentUser)}};t.AuthRoute=(0,i.withRouter)((0,a.connect)(s,null)(u)),t.ProtectedRoute=(0,i.withRouter)((0,a.connect)(s,null)(l))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(10),a=n(5),i=(n(1),n(233)),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(e,t){return{currentUser:e.session.currentUser,searchParams:t.match.params.searchParams,errors:e.errors.search}},s=function(e){return{searchTaggedPhotos:function(t){return e((0,a.searchTaggedPhotos)(t))},logout:function(){return e((0,o.logout)())}}};t.default=(0,r.connect)(l,s)(u.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(1),c=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={showProfilePopup:!1,search:n.props.searchParams,searchErrorMessage:""},n.toggleProfilePopup=n.toggleProfilePopup.bind(n),n.handleLogOut=n.handleLogOut.bind(n),n.update=n.update.bind(n),n.handleSubmitSearch=n.handleSubmitSearch.bind(n),n}return a(t,e),i(t,[{key:"toggleProfilePopup",value:function(){this.setState({showProfilePopup:!this.state.showProfilePopup})}},{key:"handleLogOut",value:function(){var e=this;this.toggleProfilePopup(),this.props.logout().then(function(){return e.props.history.push("/")})}},{key:"handleSubmitSearch",value:function(){var e=this.state.search;if(!e||0===e.trim().length)return void this.setState({searchErrorMessage:"Search field cannot be empty.",search:""});this.setState({searchErrorMessage:""}),this.setState({search:""}),this.props.searchTaggedPhotos(e).then(this.props.history.push("/search/photos/"+e))}},{key:"update",value:function(e){return this.setState({search:e.target.value})}},{key:"sessionLoggedOut",value:function(){return l.default.createElement("header",null,l.default.createElement("nav",{className:"navbar-logged-out"},l.default.createElement(s.Link,{to:"/",className:"navbar-logged-out-logo"},l.default.createElement("h1",null,"apertr")),l.default.createElement("div",{className:"navbar-logged-out-redirects"},l.default.createElement(s.Link,{to:"/login",className:"navbar-logged-out-login-link"},"Log In"),l.default.createElement(s.Link,{to:"/signup",className:"navbar-logged-out-signup-button"},l.default.createElement("button",null,"Sign Up")))))}},{key:"sessionLoggedIn",value:function(){var e=this.props.currentUser.email,t=e.substring(0,e.lastIndexOf("@")),n=[["Yo","English"],["Ni hao","Chinese"],["Li ho","Taiwanese"],["Hola","Spanish"],["Bonjour","French"],["Konichiwa","Japanese"],["Aloha","Hawaiian"],["Góðan daginn","Icelandic"]],r=n[Math.floor(Math.random()*n.length)],o=r[0],a=r[1],i=this.state.showProfilePopup?l.default.createElement("div",null,l.default.createElement("div",{onClick:this.toggleProfilePopup,className:"popup-overlay"}),l.default.createElement("hgroup",{className:"navbar-logged-in-popup"},l.default.createElement("h2",{className:"navbar-logged-in-greet-name"},o,", ",t,"!"),l.default.createElement("p",{className:"navbar-logged-in-greet-text"},"Now you know how to greet people in ",a),l.default.createElement("a",{className:"navbar-logged-in-signout-link",onClick:this.handleLogOut},"Sign Out"))):"";return l.default.createElement("header",null,l.default.createElement("nav",{className:"navbar-logged-in"},l.default.createElement("div",{className:"navbar-logged-in-left"},l.default.createElement(s.Link,{to:"/feed",className:"navbar-logged-in-logo"},l.default.createElement("h1",null,"apertr")),l.default.createElement("div",{className:"navbar-logged-in-links"},l.default.createElement(s.Link,{to:"/users/"+this.props.currentUser.id},"You"))),l.default.createElement("div",{className:"navbar-logged-in-right"},l.default.createElement("div",{className:"navbar-logged-in-search-bar"},l.default.createElement("p",{className:"navbar-logged-in-search-bar-error"},this.state.searchErrorMessage),l.default.createElement("form",{className:"navbar-logged-in-search-bar-input-field",onSubmit:this.handleSubmitSearch},l.default.createElement("span",{id:"navbar-logged-in-search-bar-logo",className:"fas fa-search"}),l.default.createElement("input",{type:"text",onChange:this.update,placeholder:"Search photos (try 'nature', 'canon', or 'tennis')",value:this.state.search}))),l.default.createElement(s.Link,{className:"navbar-logged-in-upload-icon",to:"/photos/upload"}),l.default.createElement("div",{className:"navbar-logged-in-profile-popup"},l.default.createElement("img",{src:this.props.currentUser.profile_pic,onClick:this.toggleProfilePopup}),i))))}},{key:"render",value:function(){return this.props.currentUser?this.sessionLoggedIn():this.sessionLoggedOut()}}]),t}(l.default.Component);t.default=(0,s.withRouter)(c)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(235),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=n(10),u=function(e){return{}},l=function(e){return{login:function(t){return e((0,i.login)(t))}}};t.default=(0,r.connect)(u,l)(a.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.demoLogIn=n.demoLogIn.bind(n),n}return a(t,e),i(t,[{key:"demoLogIn",value:function(){var e=this,t={email:"gabethecommie@gabriel.com",password:"password"};this.props.login(t).then(function(){return e.props.history.push("/feed")})}},{key:"render",value:function(){return l.default.createElement("div",null,l.default.createElement("div",{className:"splash-background-photostream"},l.default.createElement("span",{className:"splash-background-image"}),l.default.createElement("span",{className:"splash-background-image"}),l.default.createElement("span",{className:"splash-background-image"}),l.default.createElement("span",{className:"splash-background-image"}),l.default.createElement("span",{className:"splash-background-image"}),l.default.createElement("span",{className:"splash-background-image"})),l.default.createElement("div",{className:"splash-welcome-message"},l.default.createElement("h1",{className:"splash-intro-header"},"Find your inspiration."),l.default.createElement("div",{className:"splash-intro-text"},l.default.createElement("p",null,"Join the Apertr community, home to photos from people who ran out of free storage on Flickr.")),l.default.createElement("button",{onClick:this.demoLogIn,className:"splash-signup-button-main"},"Demo")))}}]),t}(l.default.Component);t.default=s},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e){function t(){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),i(t,[{key:"render",value:function(){var e=this;return l.default.createElement("nav",{className:"user-create-navbar"},l.default.createElement("div",{className:"user-create-navbar-logo"},l.default.createElement("img",{onClick:function(){return e.props.history.push("/")},src:"https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"})))}}]),t}(l.default.Component);t.default=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(2),u=n(10),l=n(1),s=n(238),c=r(s),f=function(e){return{errors:e.errors.session,navLink:a.default.createElement(l.Link,{to:"/login"},"Sign in")}},p=function(e){return{signupForm:function(t){return e((0,u.signup)(t))},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,i.connect)(f,p)(c.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=n(1),f=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={first_name:"",last_name:"",email:"",password:""},n.handleSubmit=n.handleSubmit.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(r({},e,n.currentTarget.value))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=Object.assign({},this.state);this.props.signupForm(n).then(function(){return t.props.history.push("/feed")})}},{key:"renderErrors",value:function(){return s.default.createElement("ul",null,this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){return s.default.createElement("div",{className:"user-create-page"},s.default.createElement("div",{className:"user-create-container"},s.default.createElement("form",{onSubmit:this.handleSubmit,className:"user-create-form"},s.default.createElement("div",{className:"user-create-details"},s.default.createElement("div",{className:"user-create-text-top"},s.default.createElement("h2",null,"Sign Up"),s.default.createElement("p",null,this.renderErrors())),s.default.createElement("div",{className:"user-create-name-fields"},s.default.createElement("input",{type:"text",value:this.state.first_name,placeholder:"First Name",onChange:this.update("first_name")}),s.default.createElement("input",{type:"text",value:this.state.last_name,placeholder:"Last Name",onChange:this.update("last_name")})),s.default.createElement("input",{type:"text",value:this.state.email,placeholder:"Your current email address",onChange:this.update("email"),className:"user-create-creds"}),s.default.createElement("input",{type:"password",value:this.state.password,placeholder:"Password",onChange:this.update("password"),className:"user-create-creds"}),s.default.createElement("input",{type:"submit",value:"Continue",className:"user-create-submit"}),s.default.createElement("div",{className:"user-create-text-bottom"},s.default.createElement("p",null,"Already have an account?"),s.default.createElement("div",null,this.props.navLink))))))}}]),t}(s.default.Component);t.default=(0,c.withRouter)(f)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),a=r(o),i=n(2),u=n(10),l=n(1),s=n(240),c=r(s),f=function(e){return{errors:e.errors.session,navLink:a.default.createElement(l.Link,{to:"/signup"},"Sign up")}},p=function(e){return{loginForm:function(t){return e((0,u.login)(t))},clearErrors:function(){return e((0,u.receiveErrors)([]))}}};t.default=(0,i.connect)(f,p)(c.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=n(1),f=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={email:"",password:""},n.handleSubmit=n.handleSubmit.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){return t.setState(r({},e,n.currentTarget.value))}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=Object.assign({},this.state);this.props.loginForm(n).then(function(){return t.props.history.push("/feed")})}},{key:"renderErrors",value:function(){return s.default.createElement("ul",null,this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){return s.default.createElement("div",{className:"session-create-page"},s.default.createElement("div",{className:"session-create-container"},s.default.createElement("form",{onSubmit:this.handleSubmit,className:"session-create-form"},s.default.createElement("div",{className:"session-create-details"},s.default.createElement("div",{className:"session-create-logo-container"},s.default.createElement("img",{src:"https://s3-us-west-1.amazonaws.com/apertr-dev/photos/images/static+images/yeehaw.png"})),s.default.createElement("div",{className:"session-create-text-top"},s.default.createElement("h2",null,"Sign In"),s.default.createElement("p",null,this.renderErrors()),s.default.createElement("br",null)),s.default.createElement("input",{type:"text",value:this.state.email,placeholder:"Enter your email",onChange:this.update("email"),className:"session-create-input"}),s.default.createElement("input",{type:"password",value:this.state.password,placeholder:"Password",onChange:this.update("password"),className:"session-create-input"}),s.default.createElement("input",{type:"submit",value:"Sign in",className:"session-create-submit"}),s.default.createElement("div",{className:"session-create-text-bottom"},s.default.createElement("p",null,"Don't have an account?"),s.default.createElement("div",null,this.props.navLink))))))}}]),t}(s.default.Component);t.default=(0,c.withRouter)(f)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(7),a=n(5),i=(n(13),n(242)),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(e){return{users:e.users,currentUser:e.session.currentUser,photos:Object.values(e.photos)}},s=function(e){return{fetchAllUsers:function(t){return e((0,o.fetchAllUsers)())},fetchPhotos:function(t){return e((0,a.fetchPhotos)())}}};t.default=(0,r.connect)(l,s)(u.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(243),f=r(c),p=n(244),d=r(p),h=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0},n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAllUsers().then(this.props.fetchPhotos().then(function(){return e.setState({firstLoad:!1})})),window.scrollTo(0,0)}},{key:"render",value:function(){var e=this,t=(0,d.default)(this.props.photos),n=t.map(function(t){return s.default.createElement(f.default,{currentUser:e.props.currentUser,users:e.props.users,photo:t})});return this.state.firstLoad?s.default.createElement("div",{className:"photo-index-feed-background"},s.default.createElement("div",{className:"navbar-logged-in-header"},s.default.createElement("p",null,"All Activity")),s.default.createElement("p",{className:"photo-index-feed-loading"},"Loading...")):s.default.createElement("div",{className:"photo-index-feed-background"},s.default.createElement("div",{className:"navbar-logged-in-header"},s.default.createElement("p",null,"All Activity")),s.default.createElement("div",{className:"photo-index-feed-container"},s.default.createElement("ul",{className:"photo-index-feed-list"},n)))}}]),t}(s.default.Component);t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(1),i=function(e){var t=e.photo.comments.length,n=t<=1?"comment":"comments";return o.default.createElement("li",{className:"photo-index-feed-item-container"},o.default.createElement("div",{className:"photo-index-feed-item"},o.default.createElement("div",{className:"photo-index-feed-author"},o.default.createElement("img",{src:e.users[e.photo.user_id].profile_pic}),o.default.createElement(a.Link,{to:"/users/"+e.photo.user_id},e.photo.userFname," ",e.photo.userLname)),o.default.createElement("div",{className:"photo-index-feed-image-container"},o.default.createElement(a.Link,{to:"/photos/"+e.photo.id},o.default.createElement("img",{className:"photo-index-feed-image",src:e.photo.image_url}))),o.default.createElement("div",{className:"photo-index-feed-title"},e.photo.title),o.default.createElement("div",{className:"photo-index-feed-details"},o.default.createElement("p",null,t," ",n))))};t.default=i},function(e,t,n){function r(e){return(i(e)?o:a)(e)}var o=n(245),a=n(247),i=n(35);e.exports=r},function(e,t,n){function r(e){return a(o(e))}var o=n(55),a=n(79);e.exports=r},function(e,t){function n(e,t){return e+r(o()*(t-e+1))}var r=Math.floor,o=Math.random;e.exports=n},function(e,t,n){function r(e){return o(a(e))}var o=n(79),a=n(248);e.exports=r},function(e,t,n){function r(e){return null==e?[]:o(e,a(e))}var o=n(249),a=n(251);e.exports=r},function(e,t,n){function r(e,t){return o(t,function(t){return e[t]})}var o=n(250);e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}e.exports=n},function(e,t,n){function r(e){return i(e)?o(e):a(e)}var o=n(64),a=n(252),i=n(26);e.exports=r},function(e,t,n){function r(e){if(!o(e))return a(e);var t=[];for(var n in Object(e))u.call(e,n)&&"constructor"!=n&&t.push(n);return t}var o=n(34),a=n(253),i=Object.prototype,u=i.hasOwnProperty;e.exports=r},function(e,t,n){var r=n(57),o=r(Object.keys,Object);e.exports=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(7),a=n(5),i=n(8),u=n(255),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e,t){return{user:e.users[t.match.params.userId],users:e.users,currentUser:e.session.currentUser,photos:Object.values(e.photos),albums:Object.values(e.albums)}},c=function(e){return{fetchUser:function(t){return e((0,o.fetchUser)(t))},fetchAllUsers:function(t){return e((0,o.fetchAllUsers)())},fetchPhotos:function(t){return e((0,a.fetchPhotos)())},fetchAlbums:function(t){return e((0,i.fetchAlbums)())},deleteAlbum:function(t){return e((0,i.deleteAlbum)(t))}}};t.default=(0,r.connect)(s,c)(l.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=(n(1),n(256)),f=r(c),p=n(257),d=r(p),h=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0,currentTabSelected:"photostream"},n.togglePhotostreamTab=n.togglePhotostreamTab.bind(n),n.toggleAlbumsTab=n.toggleAlbumsTab.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAllUsers().then(this.props.fetchPhotos().then(this.props.fetchAlbums().then(this.props.fetchUser(this.props.match.params.userId).then(function(){return e.setState({firstLoad:!1})})))),window.scrollTo(0,0)}},{key:"togglePhotostreamTab",value:function(){document.getElementById(this.state.currentTabSelected).className-=" user-show-current-tab",document.getElementById("photostream").className+=" user-show-current-tab",this.setState({currentTabSelected:"photostream"})}},{key:"toggleAlbumsTab",value:function(){document.getElementById(this.state.currentTabSelected).className-=" user-show-current-tab",document.getElementById("albums").className+=" user-show-current-tab",this.setState({currentTabSelected:"albums"})}},{key:"render",value:function(){if(this.state.firstLoad)return s.default.createElement("div",{className:"user-show-loading"},s.default.createElement("p",null,"Loading..."));var e=this.props.user.email,t=e.substring(0,e.lastIndexOf("@")),n=this.props.user.created_at.substring(0,4),r=this.props.user.photo_ids.length,o=0===r?"":r,a=0===r?"":1===r?"photo":"photos",i=void 0;switch(this.state.currentTabSelected){case"photostream":i=s.default.createElement("div",{className:"user-show-tabs"},s.default.createElement(f.default,{user:this.props.user,currentUser:this.props.currentUser,users:this.props.users,photos:this.props.photos}));break;case"albums":i=s.default.createElement("div",{className:"user-show-tabs"},s.default.createElement(d.default,{user:this.props.user,currentUser:this.props.currentUser,albums:this.props.albums,deleteAlbum:this.props.deleteAlbum}))}return s.default.createElement("div",null,s.default.createElement("div",{className:"user-show-cover-photo"},s.default.createElement("img",{src:this.props.user.cover_photo}),s.default.createElement("div",{className:"user-show-profile-details-container"},s.default.createElement("div",{className:"user-show-details-left"},s.default.createElement("img",{src:this.props.user.profile_pic}),s.default.createElement("div",{className:"user-show-names"},s.default.createElement("h1",null,this.props.user.first_name," ",this.props.user.last_name),s.default.createElement("p",null,t))),s.default.createElement("div",{className:"user-show-details-right"},s.default.createElement("p",null,o," ",a),s.default.createElement("p",null,"Joined ",n)))),s.default.createElement("div",{className:"user-show-nav-bar"},s.default.createElement("p",{id:"photostream",className:"user-show-current-tab",onClick:this.togglePhotostreamTab},"Photostream"),s.default.createElement("p",{id:"albums",onClick:this.toggleAlbumsTab},"Albums")),i)}}]),t}(s.default.Component);t.default=h},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(43),f=r(c),p=n(1),d=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),u(t,[{key:"render",value:function(){var e=this,t=[];this.props.photos.forEach(function(n){e.props.user.id===n.user_id&&t.push(s.default.createElement(f.default,{users:e.props.users,currentUser:e.props.currentUser,photo:n}))});var n=this.props.user.id===this.props.currentUser.id?s.default.createElement("div",{className:"photo-index-no-photos-message"},s.default.createElement("h2",null,"You have no photos."),s.default.createElement("p",null,"Your photostream is your public-facing portfolio. Upload some photos to populate your photostream."),s.default.createElement(p.Link,{to:"/photos/upload"},"Select files to upload")):s.default.createElement("div",{className:"photo-index-no-photos-message"},s.default.createElement("h2",null,this.props.user.first_name," has not uploaded any photos yet."));return 0===this.props.photos.length?s.default.createElement("div",{className:"photo-index-loading"},s.default.createElement("p",null,"Loading...")):0===t.length?s.default.createElement("div",{className:"photo-index-no-photos"},n):s.default.createElement("div",{className:"photo-index-container"},s.default.createElement("ul",{className:"photo-index-list"},t))}}]),t}(s.default.Component);t.default=d},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(1),f=n(258),p=r(f),d=function(e){function t(){return o(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return i(t,e),u(t,[{key:"render",value:function(){var e=this,t=this.props.currentUser.id===this.props.user.id?s.default.createElement(c.Link,{to:"/albums/new",className:"album-index-new-album"},"New album"):"",n=[];this.props.albums.forEach(function(t){e.props.user.id===t.owner_id&&n.push(s.default.createElement(p.default,{currentUser:e.props.currentUser,album:t,deleteAlbum:e.props.deleteAlbum}))});var r=this.props.user.id===this.props.currentUser.id?"You have":this.props.user.first_name+" has";return 0===n.length?s.default.createElement("div",{className:"album-index-container"},t,s.default.createElement("div",{className:"album-index-no-albums"},s.default.createElement("div",{className:"album-index-no-albums-message"},s.default.createElement("h2",null,r," not created any albums yet.")))):s.default.createElement("div",{className:"album-index-container"},t,s.default.createElement("ul",{className:"album-index-list"},n))}}]),t}(s.default.Component);t.default=d},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(1),i=function(e){var t=Object.values(e.album.photos).length,n=1===t?"photo":"photos",r=e.currentUser.id===e.album.owner_id?o.default.createElement("div",{className:"album-index-item-delete"},o.default.createElement(a.Link,{to:"/users/"+e.album.owner_id,onClick:function(){return e.deleteAlbum(e.album.id)}},"X")):"";return o.default.createElement("li",{className:"album-index-item-container"},o.default.createElement("span",{className:"album-index-item-aesthetics-layer1"}),o.default.createElement("span",{className:"album-index-item-aesthetics-layer2"}),o.default.createElement("div",{className:"album-index-item-aesthetics-shadow"}),o.default.createElement(a.Link,{to:"/albums/"+e.album.id,className:"album-index-item-background-gradient"}),o.default.createElement("img",{className:"album-index-item-image",src:Object.values(e.album.photos)[0].image_url}),o.default.createElement("div",{className:"album-index-item-details"},o.default.createElement("p",null,e.album.title),o.default.createElement("p",null,t," ",n)),r)};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(10),a=n(260),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{currentUser:e.session.currentUser}},l=function(e){return{logout:function(){return e((0,o.logout)())}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(1),c=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={showProfilePopup:!1},n.toggleProfilePopup=n.toggleProfilePopup.bind(n),n.handleLogOut=n.handleLogOut.bind(n),n}return a(t,e),i(t,[{key:"toggleProfilePopup",value:function(){this.setState({showProfilePopup:!this.state.showProfilePopup})}},{key:"handleLogOut",value:function(){var e=this;this.toggleProfilePopup(),this.props.logout().then(function(){return e.props.history.push("/")})}},{key:"render",value:function(){var e=this.state.showProfilePopup?l.default.createElement("div",null,l.default.createElement("div",{onClick:this.toggleProfilePopup,className:"popup-overlay"}),l.default.createElement("hgroup",{className:"photo-create-navbar-popup"},l.default.createElement("a",{className:"photo-create-navbar-signout-link",onClick:this.handleLogOut},"Sign Out"))):"";return l.default.createElement("header",null,l.default.createElement("nav",{className:"photo-create-navbar"},l.default.createElement("div",{className:"photo-create-nav-left"},l.default.createElement(s.Link,{to:"/feed",className:"photo-create-logo-link"},l.default.createElement("h1",null,"apertr")),l.default.createElement("div",{className:"photo-create-nav-links"},l.default.createElement(s.Link,{className:"photo-create-nav-photostream",to:"/users/"+this.props.currentUser.id},"Your Photostream"))),l.default.createElement("div",{className:"photo-create-nav-right"},l.default.createElement("div",{className:"photo-create-profile-popup"},l.default.createElement("span",null,l.default.createElement("img",{src:this.props.currentUser.profile_pic,onClick:this.toggleProfilePopup}),e)))),l.default.createElement("div",{className:"photo-create-header"}))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(5),a=n(262),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{errors:e.errors.photo,userId:e.session.currentUser.id}},l=function(e){return{createPhoto:function(t){return e((0,o.createPhoto)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:"",description:"",imageFile:null,imageUrl:null,toggledUploadPhotoButton:!1},n.handleSubmit=n.handleSubmit.bind(n),n.updateFile=n.updateFile.bind(n),n.displayPhotoUpload=n.displayPhotoUpload.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"updateFile",value:function(e){var t=this,n=e.currentTarget.files[0],r=new FileReader;r.onloadend=function(){return t.setState({imageFile:n,imageUrl:r.result})},n&&r.readAsDataURL(n)}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=new FormData;n.append("photo[title]",this.state.title),n.append("photo[description]",this.state.description),this.state.imageFile&&n.append("photo[image]",this.state.imageFile),this.props.createPhoto(n).then(function(e){return t.props.history.push("/photos/"+e.photo.id)})}},{key:"displayPhotoUpload",value:function(){this.setState({toggledUploadPhotoButton:!0})}},{key:"renderErrors",value:function(){return s.default.createElement("ul",{className:"photo-create-errors"},this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){return!1===this.state.toggledUploadPhotoButton?s.default.createElement("div",{className:"photo-create-background"},s.default.createElement("div",{className:"photo-create-greeting-container"},s.default.createElement("p",null,"Upload photos here"),s.default.createElement("button",{onClick:this.displayPhotoUpload},"Choose photos to upload"))):!0===this.state.toggledUploadPhotoButton?s.default.createElement("div",{className:"photo-create-background"},s.default.createElement("div",{className:"photo-create-container"},s.default.createElement("p",null,"Upload a photo:"),s.default.createElement("form",{onSubmit:this.handleSubmit,className:"photo-create-form"},s.default.createElement("div",null,this.renderErrors()),s.default.createElement("div",{className:"photo-create-details"},s.default.createElement("input",{className:"photo-create-title",type:"text",value:this.state.title,placeholder:"Add a title",onChange:this.update("title")}),s.default.createElement("input",{className:"photo-create-description",type:"text",value:this.state.description,placeholder:"Add a description",onChange:this.update("description")})),s.default.createElement("div",{className:"photo-create-image-container"},s.default.createElement("input",{className:"photo-create-upload",type:"file",onChange:this.updateFile}),s.default.createElement("div",{className:"photo-create-image"},s.default.createElement("img",{src:this.state.imageUrl}))),s.default.createElement("input",{className:"photo-create-button",type:"submit",value:"Upload Photo"}))),s.default.createElement("div",{className:"photo-create-placeholder-image"})):void 0}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(7),a=n(5),i=n(264),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(e,t){return{errors:e.errors.photo,users:e.users,currentUser:e.session.currentUser,photo:e.photos[t.match.params.photoId]}},s=function(e){return{fetchAllUsers:function(t){return e((0,o.fetchAllUsers)())},fetchPhoto:function(t){return e((0,a.fetchPhoto)(t))},updatePhoto:function(t){return e((0,a.updatePhoto)(t))},deletePhoto:function(t){return e((0,a.deletePhoto)(t))},clearErrors:function(){return e((0,a.receiveErrors)([]))}}};t.default=(0,r.connect)(l,s)(u.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=r(s),f=n(1),p=n(265),d=r(p),h=n(268),m=r(h),v=n(270),y=r(v),b=n(272),g=r(b),E=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state=n.props.photo,n.state={firstLoad:!0,openEditableFields:!1},n.handleSubmitUpdate=n.handleSubmitUpdate.bind(n),n.toggleEditableFields=n.toggleEditableFields.bind(n),n}return u(t,e),l(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchPhoto(this.props.match.params.photoId).then(this.props.fetchAllUsers().then(function(){return e.setState({firstLoad:!1})})),window.scrollTo(0,0)}},{key:"componentDidUpdate",value:function(e){e!==this.props&&(e.match.params.photoId!==this.props.match.params.photoId?this.props.fetchPhoto(this.props.match.params.photoId):this.setState({id:this.props.photo.id,title:this.props.photo.title,description:this.props.photo.description,image_url:this.props.photo.image_url}))}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"toggleEditableFields",value:function(){this.setState({openEditableFields:!this.state.openEditableFields})}},{key:"update",value:function(e){var t=this;return function(n){t.setState(o({},e,n.target.value))}}},{key:"handleSubmitUpdate",value:function(e){e.preventDefault(),this.props.updatePhoto(this.state),this.toggleEditableFields()}},{key:"renderErrors",value:function(){return c.default.createElement("ul",null,this.props.errors.map(function(e,t){return c.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return c.default.createElement("div",{className:"photo-show-loading"},c.default.createElement("p",null,"Loading..."));var t=this.props.currentUser.id===this.props.photo.user_id?c.default.createElement("div",null,c.default.createElement(f.Link,{className:"delete-link",onClick:function(){return e.props.deletePhoto(e.state.id)},to:"/feed"})):"",n=this.props.currentUser.id===this.props.photo.user_id?this.state.openEditableFields?c.default.createElement("form",{className:"update-form",onSubmit:this.handleSubmitUpdate},c.default.createElement("input",{className:"update-form-text",type:"text",value:this.state.title,onChange:this.update("title")}),c.default.createElement("textarea",{className:"update-form-textarea",value:this.state.description,onChange:this.update("description")}),c.default.createElement("input",{className:"update-button",type:"submit",value:"Done"})):c.default.createElement("div",{onClick:this.toggleEditableFields,className:"photo-show-editable-details"},c.default.createElement("p",{className:"photo-show-title"},this.state.title),c.default.createElement("p",{className:"photo-show-description"},this.state.description)):c.default.createElement("div",{className:"photo-show-static-details"},c.default.createElement("p",{className:"photo-show-title"},this.state.title),c.default.createElement("p",{className:"photo-show-description"},this.state.description)),r=Object.values(this.props.photo.comments).length,o=1===r?"comment":"comments",a={"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September",10:"October",11:"November",12:"December"},i=this.props.photo.created_at,u=a[i.slice(5,7)],l=i.slice(8,10),s=i.slice(0,4);return c.default.createElement("div",{className:"photo-show-background"},c.default.createElement("div",{className:"photo-show"},c.default.createElement("img",{src:this.props.photo.image_url}),t),c.default.createElement("div",{className:"photo-show-container"},c.default.createElement("div",{className:"photo-show-left-column"},c.default.createElement("div",{className:"photo-show-owner-specs"},c.default.createElement("img",{src:this.props.users[this.props.photo.user_id].profile_pic}),c.default.createElement("div",{className:"photo-show-owner-details"},c.default.createElement("div",{className:"photo-show-edit-errors"},this.renderErrors()),c.default.createElement(f.Link,{to:"/users/"+this.props.photo.user_id,className:"photo-show-author"},this.props.photo.userFname," ",this.props.photo.userLname),n)),c.default.createElement("div",{className:"photo-show-comments-container"},c.default.createElement(d.default,{photo:this.props.photo,users:this.props.users,currentUser:this.props.currentUser}),c.default.createElement(m.default,{photo:this.props.photo,currentUser:this.props.currentUser}))),c.default.createElement("div",{className:"photo-show-right-column"},c.default.createElement("div",{className:"photo-show-photo-summary"},c.default.createElement("div",{className:"photo-show-photo-details"},c.default.createElement("h1",null,r),c.default.createElement("p",null,o)),c.default.createElement("p",null,"Uploaded on ",u," ",l,", ",s)),c.default.createElement("div",{className:"photo-show-tags-container"},c.default.createElement(y.default,{photo:this.props.photo}),c.default.createElement(g.default,{photo:this.props.photo,currentUser:this.props.currentUser})))))}}]),t}(c.default.Component);t.default=E},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=(n(7),n(13)),a=n(266),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){return{comments:Object.values(e.comments)}},l=function(e){return{fetchAllComments:function(t){return e((0,o.fetchAllComments)(t))},updateComment:function(t,n){return e((0,o.updateComment)(t,n))},deleteComment:function(t){return e((0,o.deleteComment)(t))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(267),f=r(c),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={comments:n.props.comments,firstLoad:!0},n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAllComments(this.props.photo.id).then(function(){return e.setState({firstLoad:!1})})}},{key:"componentDidUpdate",value:function(e){e!==this.props&&(e.photo.id!==this.props.photo.id?this.props.fetchAllComments(this.props.photo.id):this.setState({comments:this.props.comments}))}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return s.default.createElement("div",{className:"comment-index-container"},s.default.createElement("p",null,"Loading..."));var t=this.props.comments.map(function(t){return s.default.createElement(f.default,{currentUser:e.props.currentUser,users:e.props.users,photo:e.props.photo,comment:t,updateComment:e.props.updateComment,deleteComment:e.props.deleteComment})});return s.default.createElement("div",{className:"comment-index-container"},s.default.createElement("ul",null,t))}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=n(1),f=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={description:n.props.comment.description,openEditComment:!1},n.toggleEditComment=n.toggleEditComment.bind(n),n.handleSubmitUpdate=n.handleSubmitUpdate.bind(n),n}return i(t,e),u(t,[{key:"toggleEditComment",value:function(){this.setState({openEditComment:!this.state.openEditComment})}},{key:"update",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"handleSubmitUpdate",value:function(e){e.preventDefault();var t={description:this.state.description,user_id:this.props.comment.user_id,photo_id:this.props.comment.photo_id};this.props.updateComment(t,this.props.comment.id),this.toggleEditComment()}},{key:"render",value:function(){var e=this,t=this.state.openEditComment?s.default.createElement("form",{className:"comment-index-item-update-form",onSubmit:this.handleSubmitUpdate},s.default.createElement("textarea",{className:"comment-index-item-update-form-textarea",value:this.state.description,onChange:this.update("description")}),s.default.createElement("input",{className:"comment-index-item-update-button",type:"submit",value:"Done"})):this.props.comment.description,n=this.props.currentUser.id===this.props.comment.user_id?s.default.createElement("p",{onClick:this.toggleEditComment},"edit"):"",r=this.props.currentUser.id===this.props.photo.user_id?s.default.createElement(c.Link,{onClick:function(){return e.props.deleteComment(e.props.comment.id)},to:"/photos/"+this.props.photo.id},"del"):"";return s.default.createElement("li",null,s.default.createElement("div",{className:"comment-index-item"},s.default.createElement("img",{src:this.props.users[this.props.comment.user_id].profile_pic}),s.default.createElement("div",{className:"comment-index-item-details"},s.default.createElement("div",{className:"comment-index-owner"},s.default.createElement(c.Link,{to:"/users/"+this.props.comment.user_id},this.props.comment.userFname," ",this.props.comment.userLname)),s.default.createElement("div",{className:"comment-index-description"},t),s.default.createElement("div",{className:"comment-index-item-functions"},n,r))))}}]),t}(s.default.Component);t.default=f},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(13),a=n(269),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{errors:e.errors.comment}},l=function(e){return{createComment:function(t){return e((0,o.createComment)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={user_id:n.props.currentUser.id,photo_id:n.props.photo.id,description:""},n.handleSubmit=n.handleSubmit.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.createComment(this.state),this.setState({description:""})}},{key:"renderErrors",value:function(){return s.default.createElement("ul",null,this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){return s.default.createElement("div",{className:"comment-create-container"},s.default.createElement("img",{src:this.props.currentUser.profile_pic}),s.default.createElement("form",{onSubmit:this.handleSubmit},s.default.createElement("textarea",{className:"comment-create-description",value:this.state.description,placeholder:"Add a comment",onChange:this.update("description")}),s.default.createElement("div",{className:"comment-create-errors"},this.renderErrors()),s.default.createElement("input",{className:"comment-create-button",type:"submit",value:"Comment"})))}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(19),a=n(271),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e){return{errors:e.errors.tag}},l=function(e){return{createTag:function(t){return e((0,o.createTag)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={photo_id:n.props.photo.id,word:"",openTagCreate:!1},n.handleSubmit=n.handleSubmit.bind(n),n.toggleTagCreateFields=n.toggleTagCreateFields.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"toggleTagCreateFields",value:function(){this.setState({openTagCreate:!this.state.openTagCreate})}},{key:"update",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.props.createTag(this.state),""!==this.state.word&&(this.setState({word:""}),this.toggleTagCreateFields())}},{key:"renderErrors",value:function(){return s.default.createElement("ul",null,this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=s.default.createElement("div",{className:"tags-header"},s.default.createElement("p",null,"Tags"),s.default.createElement("p",{onClick:this.toggleTagCreateFields,className:"tag-add"},"Add tags"));return this.state.openTagCreate?s.default.createElement("div",{className:"tag-create-container"},e,s.default.createElement("form",{onSubmit:this.handleSubmit,className:"tag-create-fields"},s.default.createElement("input",{type:"text",value:this.state.word,placeholder:"Add a tag",onChange:this.update("word"),className:"tag-input-field"}),s.default.createElement("input",{className:"tag-input-add",type:"submit",value:"Add"}),s.default.createElement("p",{className:"tag-input-cancel",onClick:this.toggleTagCreateFields},"cancel")),s.default.createElement("div",null,this.renderErrors())):s.default.createElement("div",{className:"tag-create-container"},e)}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(19),a=n(273),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){return{tags:Object.values(e.tags)}},l=function(e){return{fetchAllTags:function(t){return e((0,o.fetchAllTags)(t))},deleteTag:function(t,n){return e((0,o.deleteTag)(t,n))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(274),f=r(c),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={tags:n.props.tags},n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){this.props.fetchAllTags(this.props.photo.id)}},{key:"componentDidUpdate",value:function(e){e!==this.props&&(e.photo.id!==this.props.photo.id?this.props.fetchAllTags(this.props.photo.id):this.setState({tags:this.props.tags}))}},{key:"render",value:function(){var e=this,t=this.props.tags.map(function(t){return s.default.createElement(f.default,{key:t.id,tag:t,photo:e.props.photo,userId:e.props.currentUser.id,deleteTag:e.props.deleteTag})});return s.default.createElement("div",{className:"tags-index-container"},s.default.createElement("ul",{className:"tags-index-list"},t))}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r),a=n(1),i=function(e){return e.userId===e.photo.user_id?o.default.createElement("li",null,o.default.createElement("div",{className:"tag-index-item-photo-owner"},o.default.createElement(a.Link,{className:"tag-index-item-word",to:"/search/photos/"+e.tag.word},e.tag.word),o.default.createElement(a.Link,{className:"tag-index-item-delete",onClick:function(){return e.deleteTag(e.tag.id,e.photo.id)},to:"/photos/"+e.photo.id},"x"))):o.default.createElement("li",null,o.default.createElement("div",{className:"tag-index-item"},o.default.createElement(a.Link,{className:"tag-index-item-word",to:"/search/photos/"+e.tag.word},e.tag.word)))};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(276),a=function(e){return e&&e.__esModule?e:{default:e}}(o),i=function(e){return{currentUser:e.session.currentUser}},u=function(e){return{}};t.default=(0,r.connect)(i,u)(a.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(1),c=function(e){function t(e){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),i(t,[{key:"render",value:function(){return l.default.createElement("header",null,l.default.createElement("nav",{className:"album-create-navbar"},l.default.createElement(s.Link,{to:"/feed",className:"album-create-logo-link"},l.default.createElement("h1",null,"apertr")),l.default.createElement("div",{className:"album-create-nav-links"},l.default.createElement(s.Link,{className:"album-create-nav-photostream",to:"/users/"+this.props.currentUser.id},"Your Photostream"),l.default.createElement("p",{className:"album-create-new-album-tab"},"Album: new album"))))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(8),a=n(5),i=n(278),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=n(80),s=function(e){return{errors:e.errors.album,userId:e.session.currentUser.id,photos:(0,l.selectAllCurrentUserPhotos)(e),photoIds:e.session.currentUser.photo_ids}},c=function(e){return{createAlbum:function(t){return e((0,o.createAlbum)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))},fetchPhotos:function(t){return e((0,a.fetchPhotos)())},receiveCreatedAlbum:function(t){return e((0,o.receiveCreatedAlbum)(t))}}};t.default=(0,r.connect)(s,c)(u.default)},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=function(e){return e&&e.__esModule?e:{default:e}}(l),c=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={title:"",description:"",photos:[],firstLoad:!0},n.handleSubmit=n.handleSubmit.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchPhotos().then(function(){return e.setState({firstLoad:!1})})}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){t.setState(r({},e,n.target.value))}}},{key:"addPhoto",value:function(e){var t=this;return function(){var n=t.state.photos.slice();n.includes(e)||n.push(e),t.setState({photos:n})}}},{key:"removePhoto",value:function(e){var t=this;return function(){t.setState({photos:t.state.photos.filter(function(t){return t.id!==e.id})})}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=new FormData;n.append("album[title]",this.state.title),n.append("album[description]",this.state.description),n.append("photo_ids",JSON.stringify(this.state.photos.map(function(e){return e.id}))),this.props.createAlbum(n).then(function(e){t.props.receiveCreatedAlbum(e.album.id),t.props.history.push("/albums/"+e.album.id)})}},{key:"renderErrors",value:function(){return s.default.createElement("ul",null,this.props.errors.map(function(e,t){return s.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return s.default.createElement("div",{className:"album-create-loading"},s.default.createElement("p",null,"Loading..."));var t=0===this.state.photos.length?s.default.createElement("div",null):s.default.createElement("img",{src:this.state.photos[0].image_url}),n=0===this.state.photos.length?"0 items":1===this.state.photos.length?"1 item":this.state.photos.length+" items",r=this.props.photos.map(function(t,n){return s.default.createElement("li",{key:""+n,className:"album-create-user-photos-list-item",onClick:e.addPhoto(t)},s.default.createElement("div",{className:"album-create-list-image"},s.default.createElement("img",{src:t.image_url})))}),o=0===this.state.photos.length?s.default.createElement("li",{className:"album-create-no-photos"},s.default.createElement("p",null,"You haven't selected any photos yet. Select from your uploaded photos below to create your album!")):this.state.photos.map(function(t){return s.default.createElement("li",{className:"album-create-selected-photos-list-item",onClick:e.removePhoto(t)},s.default.createElement("img",{src:t.image_url}))});return s.default.createElement("div",{className:"album-create-background"},s.default.createElement("div",{className:"album-create-container"},s.default.createElement("form",{onSubmit:this.handleSubmit,className:"album-create-form"},s.default.createElement("div",{className:"album-create-form-header"},s.default.createElement("div",{className:"album-create-cover-image"},t),s.default.createElement("p",null,n," in the album")),s.default.createElement("div",null,this.renderErrors()),s.default.createElement("input",{className:"album-create-title",type:"text",value:this.state.title,placeholder:"new album",onChange:this.update("title")}),s.default.createElement("textarea",{className:"album-create-description",type:"textarea",value:this.state.description,onChange:this.update("description")}),s.default.createElement("input",{className:"album-create-button",type:"submit",value:"SAVE"})),s.default.createElement("div",{className:"album-create-selected-photos-container"},s.default.createElement("ul",{className:"album-create-selected-photos-list"},o))),s.default.createElement("div",{className:"album-create-user-photos-container"},s.default.createElement("ul",{className:"album-create-user-photos-list"},r)))}}]),t}(s.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(7),a=n(8),i=n(280),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(e,t){return{errors:e.errors.album,users:e.users,currentUser:e.session.currentUser,album:e.albums[t.match.params.albumId]}},s=function(e){return{fetchAllUsers:function(t){return e((0,o.fetchAllUsers)())},fetchAlbum:function(t){return e((0,a.fetchAlbum)(t))},updateAlbum:function(t){return e((0,a.updateAlbum)(t))},deleteAlbum:function(t){return e((0,a.deleteAlbum)(t))},clearErrors:function(){return e((0,a.receiveErrors)([]))}}};t.default=(0,r.connect)(l,s)(u.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=r(s),f=n(1),p=n(43),d=r(p),h=function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0,openEditableFields:!1},n.handleSubmit=n.handleSubmit.bind(n),n.toggleEditableFields=n.toggleEditableFields.bind(n),n}return u(t,e),l(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAlbum(this.props.match.params.albumId).then(this.props.fetchAllUsers().then(function(){return e.setState({firstLoad:!1})})),window.scrollTo(0,0)}},{key:"componentDidUpdate",value:function(e){e!==this.props&&(e.match.params.albumId!==this.props.match.params.albumId?this.props.fetchAlbum(this.props.match.params.albumId):this.setState({id:this.props.album.id,title:this.props.album.title,description:this.props.album.description,photos:this.props.album.photos}))}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"toggleEditableFields",value:function(){this.setState({openEditableFields:!this.state.openEditableFields})}},{key:"update",value:function(e){var t=this;return function(n){t.setState(o({},e,n.target.value))}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=new FormData;t.append("id",this.props.match.params.albumId),t.append("album[title]",this.state.title),t.append("album[description]",this.state.description),t.append("photo_ids",JSON.stringify(Object.values(this.props.album.photos).map(function(e){return e.id}))),this.props.updateAlbum(t),this.toggleEditableFields()}},{key:"renderErrors",value:function(){return c.default.createElement("ul",null,this.props.errors.map(function(e,t){return c.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return c.default.createElement("div",{className:"album-show-loading"},c.default.createElement("p",null,"Loading..."));var t=this.props.currentUser.id===this.props.album.owner_id?this.state.toggledEditableFields?c.default.createElement("form",{className:"album-show-update-form-editing",onSubmit:this.handleSubmit},c.default.createElement("input",{className:"album-show-update-title",type:"text",value:this.state.title,onChange:this.update("title")}),c.default.createElement("input",{className:"album-show-update-description",type:"textarea",value:this.state.description,onChange:this.update("description")}),c.default.createElement("input",{className:"album-show-update-button",type:"submit",value:"Done"})):c.default.createElement("div",{className:"album-show-update-form",onClick:this.openEditableFields},c.default.createElement("p",{className:"album-show-update-title"},this.state.title),c.default.createElement("p",{className:"album-show-update-description"},this.state.description)):c.default.createElement("div",{className:"album-show-details"},c.default.createElement("p",{className:"album-show-update-title"},this.state.title),c.default.createElement("p",{className:"album-show-update-description"},this.state.description)),n=Object.values(this.props.album.photos).length,r=n>1?"photos":"photo",o=this.state.toggledEditableFields?"":c.default.createElement("div",{className:"album-show-num-photos"},n," ",r),a=this.props.album.owner_id===this.props.currentUser.id?c.default.createElement(f.Link,{className:"album-show-edit",to:"/albums/"+this.props.album.id+"/edit"},"edit"):"",i=Object.values(this.props.album.photos).map(function(t){return c.default.createElement(d.default,{users:e.props.users,currentUser:e.props.currentUser,photo:t})});return c.default.createElement("div",{className:"album-show-container"},c.default.createElement("div",{className:"album-show-cover-image"},c.default.createElement("img",{src:Object.values(this.props.album.photos)[0].image_url}),c.default.createElement("div",{className:"album-show-details-container"},t,o,c.default.createElement(f.Link,{to:"/users/"+this.props.album.owner_id},"By: ",this.props.album.ownerFname," ",this.props.album.ownerLname)),a),c.default.createElement("ul",{className:"album-show-photos-list"},i))}}]),t}(c.default.Component);t.default=h},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(8),a=n(282),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){return{currentUser:e.session.currentUser,album:e.albums[t.match.params.albumId]}},l=function(e){return{fetchAlbum:function(t){return e((0,o.fetchAlbum)(t))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=n(1),c=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0},n}return a(t,e),i(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAlbum(this.props.match.params.albumId).then(function(){return e.setState({firstLoad:!1})})}},{key:"render",value:function(){var e=this.state.firstLoad?"Loading...":this.props.album.title;return l.default.createElement("header",null,l.default.createElement("nav",{className:"album-create-navbar"},l.default.createElement(s.Link,{to:"/feed",className:"album-create-logo-link"},l.default.createElement("h1",null,"apertr")),l.default.createElement("div",{className:"album-create-nav-links"},l.default.createElement(s.Link,{className:"album-create-nav-photostream",to:"/users/"+this.props.currentUser.id},"Your Photostream"),l.default.createElement("p",{className:"album-create-new-album-tab"},"Album: ",e))))}}]),t}(l.default.Component);t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(8),a=n(5),i=n(284),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=n(80),s=function(e,t){var n=e.albums[t.match.params.albumId];return{errors:e.errors.album,userId:e.session.currentUser.id,album:n,userPhotos:(0,l.selectAllCurrentUserPhotos)(e),photoIds:e.session.currentUser.photo_ids,albumPhotos:n?Object.values(n.photos):[]}},c=function(e){return{fetchAlbum:function(t){return e((0,o.fetchAlbum)(t))},updateAlbum:function(t){return e((0,o.updateAlbum)(t))},clearErrors:function(){return e((0,o.receiveErrors)([]))},fetchPhotos:function(){return e((0,a.fetchPhotos)())}}};t.default=(0,r.connect)(s,c)(u.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=r(s),f=n(9),p=(r(f),function(e){function t(e){a(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0},n.handleSubmit=n.handleSubmit.bind(n),n}return u(t,e),l(t,[{key:"componentDidMount",value:function(){var e=this;this.props.fetchAlbum(this.props.match.params.albumId).then(function(){return e.setState({title:e.props.album.title,description:e.props.album.description})}),this.props.fetchPhotos().then(function(){return e.setState({photos:e.props.albumPhotos,firstLoad:!1})})}},{key:"componentDidUpdate",value:function(e){e!==this.props&&e.album!==this.props.album&&this.setState({photo:Object.values(this.props.album.photos)})}},{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){var t=this;return function(n){t.setState(o({},e,n.target.value))}}},{key:"addPhoto",value:function(e){var t=this;return function(){var n=t.state.photos.slice(),r=!1;n.forEach(function(t){if(t.id===e.id)return void(r=!0)}),r||(n.push(e),t.setState({photos:n}))}}},{key:"removePhoto",value:function(e){var t=this;return function(){t.setState({photos:t.state.photos.filter(function(t){return t.id!==e.id})})}}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault();var n=new FormData;n.append("id",this.props.match.params.albumId),n.append("album[title]",this.state.title),n.append("album[description]",this.state.description),n.append("photo_ids",JSON.stringify(this.state.photos.map(function(e){return e.id}))),this.props.updateAlbum(n).then(function(e){return t.props.history.push("/albums/"+e.album.id)})}},{key:"renderErrors",value:function(){return c.default.createElement("ul",null,this.props.errors.map(function(e,t){return c.default.createElement("li",{key:"error-"+t},e)}))}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return c.default.createElement("div",{className:"album-create-loading"},c.default.createElement("p",null,"Loading..."));var t=0===this.state.photos.length?c.default.createElement("div",null):c.default.createElement("img",{src:this.state.photos[0].image_url}),n=0===this.state.photos.length?"0 items":1===this.state.photos.length?"1 item":this.state.photos.length+" items",r=this.props.userPhotos.map(function(t,n){return c.default.createElement("li",{key:""+n,className:"album-create-user-photos-list-item",onClick:e.addPhoto(t)},c.default.createElement("div",{className:"album-create-list-image"},c.default.createElement("img",{src:t.image_url})))}),o=0===this.state.photos.length?c.default.createElement("li",{className:"album-create-no-photos"},c.default.createElement("p",null,"You haven't selected any photos yet. Select from your uploaded photos below to create your album!")):this.state.photos.map(function(t){return c.default.createElement("li",{className:"album-create-selected-photos-list-item",onClick:e.removePhoto(t)},c.default.createElement("img",{src:t.image_url}))});return c.default.createElement("div",{className:"album-create-background"},c.default.createElement("div",{className:"album-create-container"},c.default.createElement("form",{onSubmit:this.handleSubmit,className:"album-create-form"},c.default.createElement("div",{className:"album-create-form-header"},c.default.createElement("div",{className:"album-create-cover-image"},t),c.default.createElement("p",null,n," in the album")),c.default.createElement("div",null,this.renderErrors()),c.default.createElement("input",{className:"album-create-title",type:"text",value:this.state.title,onChange:this.update("title")}),c.default.createElement("textarea",{className:"album-create-description",type:"textarea",value:this.state.description,onChange:this.update("description")}),c.default.createElement("input",{className:"album-create-button",type:"submit",value:"SAVE"})),c.default.createElement("div",{className:"album-create-selected-photos-container"},c.default.createElement("ul",{className:"album-create-selected-photos-list"},o))),c.default.createElement("div",{className:"album-create-user-photos-container"},c.default.createElement("ul",{className:"album-create-user-photos-list"},r)))}}]),t}(c.default.Component));t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(5),a=n(286),i=function(e){return e&&e.__esModule?e:{default:e}}(a),u=function(e,t){return{searchParams:t.match.params.searchParams,errors:e.errors.search}},l=function(e){return{clearErrors:function(){return e((0,o.receiveErrors)([]))}}};t.default=(0,r.connect)(u,l)(i.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(287),f=r(c),p=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={search:n.props.searchParams,searchParams:n.props.searchParams,inputErrorMessage:""},n.update=n.update.bind(n),n.handleSubmit=n.handleSubmit.bind(n),n}return i(t,e),u(t,[{key:"componentWillUnmount",value:function(){this.props.clearErrors()}},{key:"update",value:function(e){return this.setState({search:e.target.value})}},{key:"handleSubmit",value:function(e){var t=this.state.search;if(0===t.trim().length)return void this.setState({inputErrorMessage:"Search parameters cannot be blank!",search:""});this.setState({inputErrorMessage:"",searchParams:t}),this.props.history.push("/search/"+this.state.search)}},{key:"render",value:function(){return s.default.createElement("div",{className:"search-container"},s.default.createElement("div",{className:"navbar-logged-in-header"},s.default.createElement("p",null,"Photos")),s.default.createElement("div",{className:"search-results-container"},s.default.createElement(f.default,{searchParams:this.state.searchParams})))}}]),t}(s.default.Component);t.default=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2),o=n(7),a=n(5),i=n(288),u=function(e){return e&&e.__esModule?e:{default:e}}(i),l=function(e,t){return{users:e.users,currentUser:e.session.currentUser,searchParams:t.searchParams,photos:e.search.photos}},s=function(e){return{fetchAllUsers:function(t){return e((0,o.fetchAllUsers)())},searchTaggedPhotos:function(t){return e((0,a.searchTaggedPhotos)(t))}}};t.default=(0,r.connect)(l,s)(u.default)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=r(l),c=n(1),f=n(43),p=r(f),d=function(e){function t(e){o(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={firstLoad:!0,search:n.props.searchParams,searchErrorMessage:""},n.update=n.update.bind(n),n.handleSubmitSearch=n.handleSubmitSearch.bind(n),n}return i(t,e),u(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({search:""}),this.props.fetchAllUsers().then(this.props.searchTaggedPhotos(this.props.searchParams).then(function(){return e.setState({firstLoad:!1})})),window.scrollTo(0,0)}},{key:"componentDidUpdate",value:function(e){e.searchParams!==this.props.searchParams&&this.props.searchTaggedPhotos(this.props.searchParams)}},{key:"handleSubmitSearch",value:function(){var e=this.state.search;if(!e||0===e.trim().length)return void this.setState({searchErrorMessage:"Search field cannot be empty.",search:""});this.setState({searchErrorMessage:""}),this.setState({search:""}),this.props.searchTaggedPhotos(e).then(this.props.history.push("/search/photos/"+e))}},{key:"update",value:function(e){return this.setState({search:e.target.value})}},{key:"render",value:function(){var e=this;if(this.state.firstLoad)return s.default.createElement("div",{className:"photos-search-loading"},s.default.createElement("p",null,"Loading..."));var t=Object.values(this.props.photos).map(function(t){return s.default.createElement(p.default,{users:e.props.users,currentUser:e.props.currentUser,photo:t})}),n=0===Object.keys(this.props.photos).length?s.default.createElement("div",{className:"photos-search-no-results"},s.default.createElement("div",{className:"photos-search-no-results-body"},s.default.createElement("div",{className:"photos-search-no-results-text"},s.default.createElement("p",null,"Oops! There are no matches for your search. Please try again.")),s.default.createElement("form",{className:"photos-search-no-results-search-bar",onSubmit:this.handleSubmitSearch},s.default.createElement("span",{className:"fas fa-search"}),s.default.createElement("input",{className:"photos-search-no-results-input",type:"text",onChange:this.update,placeholder:"Search photos (try 'nature', 'canon', or 'tennis')",value:this.state.search}),s.default.createElement("input",{className:"photos-search-no-results-submit",type:"submit",value:"Search"})),s.default.createElement("p",{className:"photos-search-no-results-search-error"},this.state.searchErrorMessage))):s.default.createElement("div",{className:"photos-search-results"},s.default.createElement("h2",null,"Everyone's photos"),s.default.createElement("ul",{className:"photos-search-items-container"},t));return s.default.createElement("div",null,n)}}]),t}(s.default.Component);t.default=(0,c.withRouter)(d)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=function(e){return e&&e.__esModule?e:{default:e}}(u),s=function(e){function t(e){return r(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))}return a(t,e),i(t,[{key:"render",value:function(){return l.default.createElement("footer",{className:"footer"},l.default.createElement("ul",{className:"footer-items"},l.default.createElement("li",null,l.default.createElement("a",{href:"https://github.com/Eractus"},"GitHub")),l.default.createElement("li",null,l.default.createElement("a",{href:"https://www.linkedin.com/in/danny-peng/"},"LinkedIn"))))}}]),t}(l.default.Component);t.default=s}]);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
/*!
 * jQuery JavaScript Library v1.12.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:17Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var deletedIds = [];

var document = window.document;

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.12.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type( obj ) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {

			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {

			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( !support.ownFirst ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {

			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data ); // jscs:ignore requireDotNotation
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {

				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[ j ] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = deletedIds[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// init accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt( 0 ) === "<" &&
				selector.charAt( selector.length - 1 ) === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {

						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[ 2 ] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof root.ready !== "undefined" ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter( function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[ 0 ], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.uniqueSort( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = true;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {

	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener ||
		window.event.type === "load" ||
		document.readyState === "complete" ) {

		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE6-10
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );

		// If IE event model is used
		} else {

			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch ( e ) {}

			if ( top && top.doScroll ) {
				( function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {

							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll( "left" );
						} catch ( e ) {
							return window.setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				} )();
			}
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery( function() {

	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {

		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== "undefined" ) {

		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {

			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
} );


( function() {
	var div = document.createElement( "div" );

	// Support: IE<9
	support.deleteExpando = true;
	try {
		delete div.test;
	} catch ( e ) {
		support.deleteExpando = false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();
var acceptData = function( elem ) {
	var noData = jQuery.noData[ ( elem.nodeName + " " ).toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute( "classid" ) === noData;
};




var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[ name ] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( ( !id || !cache[ id ] || ( !pvt && !cache[ id ].data ) ) &&
		data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {

		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {

		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split( " " );
					}
				}
			} else {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[ i ] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject( thisCache ) : !jQuery.isEmptyObject( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, undefined
	} else {
		cache[ id ] = undefined;
	}
}

jQuery.extend( {
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,

		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[ jQuery.expando ] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				jQuery.data( this, key );
			} );
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each( function() {
				jQuery.data( this, key, value );
			} ) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each( function() {
			jQuery.removeData( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object,
	// or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );


( function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {

			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== "undefined" ) {

			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

} )();
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn(
					elems[ i ],
					key,
					raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[ 0 ], key ) : emptyGet;
};
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );

var rleadingWhitespace = ( /^\s+/ );

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|" +
		"details|dialog|figcaption|figure|footer|header|hgroup|main|" +
		"mark|meter|nav|output|picture|progress|section|summary|template|time|video";



function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}


( function() {
	var div = document.createElement( "div" ),
		fragment = document.createDocumentFragment(),
		input = document.createElement( "input" );

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );

	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input = document.createElement( "input" );
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloned elements keep attachEvent handlers, we use addEventListener on IE9+
	support.noCloneEvent = !!div.addEventListener;

	// Support: IE<9
	// Since attributes and properties are the same in IE,
	// cleanData must set properties to undefined rather than use removeAttribute
	div[ jQuery.expando ] = 1;
	support.attributes = !div.getAttribute( jQuery.expando );
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {
	option: [ 1, "<select multiple='multiple'>", "</select>" ],
	legend: [ 1, "<fieldset>", "</fieldset>" ],
	area: [ 1, "<map>", "</map>" ],

	// Support: IE8
	param: [ 1, "<object>", "</object>" ],
	thead: [ 1, "<table>", "</table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	// unless wrapped in a div with non-breaking characters in front of it.
	_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
};

// Support: IE8-IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
				undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context;
			( elem = elems[ i ] ) != null;
			i++
		) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; ( elem = elems[ i ] ) != null; i++ ) {
		jQuery._data(
			elem,
			"globalEval",
			!refElements || jQuery._data( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/,
	rtbody = /<tbody/i;

function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

function buildFragment( elems, context, scripts, selection, ignored ) {
	var j, elem, contains,
		tmp, tag, tbody, wrap,
		l = elems.length,

		// Ensure a safe fragment
		safe = createSafeFragment( context ),

		nodes = [],
		i = 0;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || safe.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;

				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Manually add leading whitespace removed by IE
				if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[ 0 ] ) );
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					elem = tag === "table" && !rtbody.test( elem ) ?
						tmp.firstChild :

						// String was a bare <thead> or <tfoot>
						wrap[ 1 ] === "<table>" && !rtbody.test( elem ) ?
							tmp :
							0;

					j = elem && elem.childNodes.length;
					while ( j-- ) {
						if ( jQuery.nodeName( ( tbody = elem.childNodes[ j ] ), "tbody" ) &&
							!tbody.childNodes.length ) {

							elem.removeChild( tbody );
						}
					}
				}

				jQuery.merge( nodes, tmp.childNodes );

				// Fix #12392 for WebKit and IE > 9
				tmp.textContent = "";

				// Fix #12392 for oldIE
				while ( tmp.firstChild ) {
					tmp.removeChild( tmp.firstChild );
				}

				// Remember the top-level container for proper cleanup
				tmp = safe.lastChild;
			}
		}
	}

	// Fix #11356: Clear elements from fragment
	if ( tmp ) {
		safe.removeChild( tmp );
	}

	// Reset defaultChecked for any radios and checkboxes
	// about to be appended to the DOM in IE 6/7 (#8060)
	if ( !support.appendChecked ) {
		jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	}

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}

			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( safe.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	tmp = null;

	return safe;
}


( function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox (lack focus(in | out) events)
	for ( i in { submit: true, change: true, focusin: true } ) {
		eventName = "on" + i;

		if ( !( support[ i ] = eventName in window ) ) {

			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
} )();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" &&
					( !e || jQuery.event.triggered !== e.type ) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};

			// Add elem as a property of the handle fn to prevent a memory leak
			// with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] &&
				jQuery._data( cur, "handle" );

			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if (
				( !special._default ||
				 special._default.apply( eventPath.pop(), data ) === false
				) && acceptData( elem )
			) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {

						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY fromElement offsetX offsetY " +
			"pageX pageY screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ?
					original.toElement :
					fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {

						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// Guard for simulated events was moved to jQuery.event.stopPropagation function
				// since `originalEvent` should point to the original event for the
				// constancy with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event,
			// to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( !e || this.isSimulated ) {
			return;
		}

		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

// IE submit delegation
if ( !support.submit ) {

	jQuery.event.special.submit = {
		setup: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {

				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ?

						// Support: IE <=8
						// We use jQuery.prop instead of elem.form
						// to allow fixing the IE8 delegated submit issue (gh-2332)
						// by 3rd party polyfills/workarounds.
						jQuery.prop( elem, "form" ) :
						undefined;

				if ( form && !jQuery._data( form, "submit" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submitBubble = true;
					} );
					jQuery._data( form, "submit", true );
				}
			} );

			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {

			// If form was submitted by the user, bubble the event up the tree
			if ( event._submitBubble ) {
				delete event._submitBubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event );
				}
			}
		},

		teardown: function() {

			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.change ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {

				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._justChanged = true;
						}
					} );
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._justChanged && !event.isTrigger ) {
							this._justChanged = false;
						}

						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event );
					} );
				}
				return false;
			}

			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "change" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event );
						}
					} );
					jQuery._data( elem, "change", true );
				}
			} );
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger ||
				( elem.type !== "radio" && elem.type !== "checkbox" ) ) {

				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	} );
}

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	},

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp( "<(?:" + nodeNames + ")[\\s/>]", "i" ),
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement( "div" ) );

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( jQuery.find.attr( elem, "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}
	return elem;
}

function cloneCopyEvent( src, dest ) {
	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim( dest.innerHTML ) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {

		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var first, node, hasScripts,
		scripts, doc, fragment,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!jQuery._data( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval(
								( node.text || node.textContent || node.innerHTML || "" )
									.replace( rcleanScript, "" )
							);
						}
					}
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		elems = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = elems[ i ] ) != null; i++ ) {

		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc( elem ) ||
			!rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {

			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( ( !support.noCloneEvent || !support.noCloneChecked ) &&
				( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; ( node = srcElements[ i ] ) != null; ++i ) {

				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[ i ] ) {
					fixCloneNodeIssues( node, destElements[ i ] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; ( node = srcElements[ i ] ) != null; i++ ) {
					cloneCopyEvent( node, destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems, /* internal */ forceAcceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			attributes = support.attributes,
			special = jQuery.event.special;

		for ( ; ( elem = elems[ i ] ) != null; i++ ) {
			if ( forceAcceptData || acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// Support: IE<9
						// IE does not allow us to delete expando properties from nodes
						// IE creates expando attributes along with the property
						// IE does not have a removeAttribute function on Document nodes
						if ( !attributes && typeof elem.removeAttribute !== "undefined" ) {
							elem.removeAttribute( internalKey );

						// Webkit & Blink performance suffers when deleting properties
						// from DOM nodes, so set to undefined instead
						// https://code.google.com/p/chromium/issues/detail?id=378607
						} else {
							elem[ internalKey ] = undefined;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append(
					( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value )
				);
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {

			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {

						// Remove element nodes and prevent memory leaks
						elem = this[ i ] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, pixelMarginRightVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	div.style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = div.style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!div.style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	div.innerHTML = "";
	container.appendChild( div );

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = div.style.boxSizing === "" || div.style.MozBoxSizing === "" ||
		div.style.WebkitBoxSizing === "";

	jQuery.extend( support, {
		reliableHiddenOffsets: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {

			// We're checking for pixelPositionVal here instead of boxSizingReliableVal
			// since that compresses better and they're computed together anyway.
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		},

		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );

	function computeStyleTests() {
		var contents, divStyle,
			documentElement = document.documentElement;

		// Setup
		documentElement.appendChild( container );

		div.style.cssText =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = reliableMarginLeftVal = false;
		pixelMarginRightVal = reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			divStyle = window.getComputedStyle( div );
			pixelPositionVal = ( divStyle || {} ).top !== "1%";
			reliableMarginLeftVal = ( divStyle || {} ).marginLeft === "2px";
			boxSizingReliableVal = ( divStyle || { width: "4px" } ).width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = ( divStyle || { marginRight: "4px" } ).marginRight === "4px";

			// Support: Android 2.3 only
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE6-8
		// First check that getClientRects works as expected
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.style.display = "none";
		reliableHiddenOffsetsVal = div.getClientRects().length === 0;
		if ( reliableHiddenOffsetsVal ) {
			div.style.display = "";
			div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
			div.childNodes[ 0 ].style.borderCollapse = "separate";
			contents = div.getElementsByTagName( "td" );
			contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			if ( reliableHiddenOffsetsVal ) {
				contents[ 0 ].style.display = "";
				contents[ 1 ].style.display = "none";
				reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
			}
		}

		// Teardown
		documentElement.removeChild( container );
	}

} )();


var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		if ( computed ) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value"
			// instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values,
			// but width seems to be reliably pixels
			// this is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are
		// proportional to the parent element instead
		// and we can't measure the parent instead because it
		// might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/i,

	// swappable if display is none or starts with table except
	// "table", "table-cell", or "table-caption"
	// see here for display values:
	// https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt( 0 ).toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] =
					jQuery._data( elem, "olddisplay", defaultDisplay( elem.nodeName ) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {

		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight
			// (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch ( e ) {}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing &&
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
} );

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {

			// IE uses filters for opacity
			return ropacity.test( ( computed && elem.currentStyle ?
				elem.currentStyle.filter :
				elem.style.filter ) || "" ) ?
					( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
					computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist -
			// attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule
				// or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return (
				parseFloat( curCSS( elem, "marginLeft" ) ) ||

				// Support: IE<=11+
				// Running getBoundingClientRect on a disconnected node in IE throws an error
				// Support: IE8 only
				// getClientRects() errors on disconnected elems
				( jQuery.contains( elem.ownerDocument, elem ) ?
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} ) :
					0
				)
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var a,
		input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Support: Windows Web Apps (WWA)
	// `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "checkbox" );
	div.appendChild( input );

	a = div.getElementsByTagName( "a" )[ 0 ];

	// First batch of tests.
	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class.
	// If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute( "style" ) );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute( "href" ) === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement( "form" ).enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
} )();


var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if (
					hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// handle most common string cases
					ret.replace( rreturn, "" ) :

					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled :
								option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {

					// Setting the type on a radio button after the value resets the value in IE8-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;

					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {

			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		} else {

			// Support: IE<9
			// Use defaultChecked and defaultSelected for oldIE
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} else {
		attrHandle[ name ] = function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
	}
} );

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {

				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {

				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {

			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					( ret = elem.ownerDocument.createAttribute( name ) )
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return ( ret = elem.getAttributeNode( name ) ) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each( [ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	} );
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {

			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case sensitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each( function() {

			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch ( e ) {}
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each( [ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	} );
}

// Support: Safari, IE9+
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return jQuery.attr( elem, "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						jQuery.attr( elem, "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// store className if set
					jQuery._data( this, "__className__", className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				jQuery.attr( this, "class",
					className || value === false ?
					"" :
					jQuery._data( this, "__className__" ) || ""
				);
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




// Return jQuery for attributes-only inclusion


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );


var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {

	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {

		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	} ) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new window.DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new window.ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch ( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,

	// IE leaves an \r character at EOL
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) { // jscs:ignore requireDotNotation
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var

			// Cross-domain detection vars
			parts,

			// Loop variable
			i,

			// URL without anti-cache param
			cacheURL,

			// Response headers as string
			responseHeadersString,

			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,

			// Response headers
			responseHeaders,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" )
			.replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			var wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


function getDisplay( elem ) {
	return elem.style && elem.style.display || jQuery.css( elem, "display" );
}

function filterHidden( elem ) {

	// Disconnected elements are considered hidden
	if ( !jQuery.contains( elem.ownerDocument || document, elem ) ) {
		return true;
	}
	while ( elem && elem.nodeType === 1 ) {
		if ( getDisplay( elem ) === "none" || elem.type === "hidden" ) {
			return true;
		}
		elem = elem.parentNode;
	}
	return false;
}

jQuery.expr.filters.hidden = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return support.reliableHiddenOffsets() ?
		( elem.offsetWidth <= 0 && elem.offsetHeight <= 0 &&
			!elem.getClientRects().length ) :
			filterHidden( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// Support: IE 9-11
		// IE seems to error on cross-domain PATCH requests when ActiveX XHR
		// is used. In IE 9+ always use the native XHR.
		// Note: this condition won't catch Edge as it doesn't define
		// document.documentMode but it also doesn't support ActiveX so it won't
		// reach this code.
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		// oldIE XHR does not support non-RFC2616 methods (#13240)
		// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
		// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
		// Although this check for six methods instead of eight
		// since IE also does not support "trace" and "connect"
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	} );
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport( function( options ) {

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {

						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch ( e ) {

									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;

								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					// Do send the request
					// `xhr.send` may raise an exception, but it will be
					// handled in jQuery.ajax (so no try/catch here)
					if ( !options.async ) {

						// If we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {

						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						window.setTimeout( callback );
					} else {

						// Register the callback, but delay it in case `xhr.send` throws
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	} );
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery( "head" )[ 0 ] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// data: string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};





/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray( "auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left
		// is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== "undefined" ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? ( prop in win ) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
	function( defaultExtra, funcName ) {

		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only,
					// but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]), textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[name][type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.data('ujs:submit-button-formmethod') || element.attr('method');
          url = element.data('ujs:submit-button-formaction') || element.attr('action');
          data = $(element[0]).serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
          element.data('ujs:submit-button-formmethod', null);
          element.data('ujs:submit-button-formaction', null);
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element[method]());
        element[method](replacement);
      }

      element.prop('disabled', true);
      element.data('ujs:disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (element.data('ujs:enable-with') !== undefined) {
        element[method](element.data('ujs:enable-with'));
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.prop('disabled', false);
      element.removeData('ujs:disabled');
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var foundInputs = $(),
        input,
        valueToCheck,
        radiosForNameWithNoneSelected,
        radioName,
        selector = specifiedSelector || 'input,textarea',
        requiredInputs = form.find(selector),
        checkedRadioButtonNames = {};

      requiredInputs.each(function() {
        input = $(this);
        if (input.is('input[type=radio]')) {

          // Don't count unchecked required radio as blank if other radio with same name is checked,
          // regardless of whether same-name radio input has required attribute or not. The spec
          // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
          radioName = input.attr('name');

          // Skip if we've already seen the radio with this name.
          if (!checkedRadioButtonNames[radioName]) {

            // If none checked
            if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
              radiosForNameWithNoneSelected = form.find(
                'input[type=radio][name="' + radioName + '"]');
              foundInputs = foundInputs.add(radiosForNameWithNoneSelected);
            }

            // We only need to check each name once.
            checkedRadioButtonNames[radioName] = radioName;
          }
        } else {
          valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
          if (valueToCheck === nonBlank) {
            foundInputs = foundInputs.add(input);
          }
        }
      });
      return foundInputs.length ? foundInputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  Replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      if (replacement !== undefined) {
        element.data('ujs:enable-with', element.html()); // store enabled state
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
      element.data('ujs:disabled', true);
    },

    // Restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
      element.removeData('ujs:disabled');
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:disabled')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.on('ajax:complete', rails.linkDisableSelector, function() {
        rails.enableElement($(this));
    });

    $document.on('ajax:complete', rails.buttonDisableSelector, function() {
        rails.enableFormElement($(this));
    });

    $document.on('click.rails', rails.linkClickSelector, function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // Response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.on('click.rails', rails.buttonClickSelector, function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // Response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.on('change.rails', rails.inputChangeSelector, function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.on('submit.rails', rails.formSubmitSelector, function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // Skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        if (form.data('ujs:formnovalidate-button') === undefined) {
          blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
          if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
            return rails.stopEverything(e);
          }
        } else {
          // Clear the formnovalidate in case the next button click is not on a formnovalidate button
          // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
          form.data('ujs:formnovalidate-button', undefined);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // Slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // Re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // Slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.on('click.rails', rails.formInputClickSelector, function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // Register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      var form = button.closest('form');
      if (form.length === 0) {
        form = $('#' + button.attr('form'));
      }
      form.data('ujs:submit-button', data);

      // Save attributes from button
      form.data('ujs:formnovalidate-button', button.attr('formnovalidate'));
      form.data('ujs:submit-button-formaction', button.attr('formaction'));
      form.data('ujs:submit-button-formmethod', button.attr('formmethod'));
    });

    $document.on('ajax:send.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.on('ajax:complete.rails', rails.formSubmitSelector, function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
