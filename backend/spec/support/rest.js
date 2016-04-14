var http = require("http")

var serialize = function(obj ){
  return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

var options = function(method, api) {
  return {
    method:   method,
    host:     "localhost",
    port:     3000,
    path:     "/api/1/"+api  }
}

var request = function(method, api, body) {
  var opts = options(method, api)
  if (body) {
    body = JSON.stringify(body)
    opts.headers = {
      'Content-Type':   'application/json',
      'Content-Length': body.length
    }
  }
  return new Promise(function(resolve, reject) {
    var data = []
    var getter = http.request(opts, function(response) {
      if (response.statusCode !== 200) {
        return reject(response.statusMessage)
      }
      response.on("data", function(chunk) {
        data.push(chunk)
      })
      response.on("end", function() {
        var response = JSON.parse(data.join(""))
        resolve(response.data ? response.data : response)
      })
    })
    getter.end(body)
    getter.on("error", function(err) { reject(err) })
  })
}

module.exports = {
  get: function(api) {
    return request("GET", api)
  },
  post: function(api, body) {
    return request("POST", api, body)
  },
  put: function(api, body) {
    return request("PUT", api, body)
  },
  delete: function(api) {
    return request("DELETE", api)
  },
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
}