var http = require("http")

var serialize = function(obj ){
  return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

var options = function(method, api, params) {
  return {
    method:   method,
    host:     "localhost",
    port:     3000,
    path:     "/api/"+api+serialize(params)  }
}

var request = function(method, api, params, body) {
  var opts = options(method, api, params)
  if (body) {
    body = JSON.stringify(body)
    opts.headers = {
      'Content-Type':   'application/json',
      'Content-Length': body.length
    }
  }
  return new Promise(function(resolve, reject) {
    var getter = http.request(opts, function(response) {
      if (response.statusCode !== 200) {
        return reject(response.statusMessage)
      }
      response.on("data", function(data) {
        resolve(JSON.parse(data))
      })
    })
    getter.end(body)
    getter.on("error", function(err) { reject(err) })
  })
}

module.exports = {
  get: function(api, params) {
    return request("GET", api, params)
  },
  post: function(api, params, body) {
    return request("POST", api, params, body)
  },
  put: function(api, params, body) {
    return request("PUT", api, params, body)
  },
  delete: function(api, params) {
    return request("DELETE", api, params)
  },
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}