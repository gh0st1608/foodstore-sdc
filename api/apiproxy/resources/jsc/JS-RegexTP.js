var rh = context.getVariable('request.headers.names');
var s = String(rh);
// convierte la lista de headers en un array:
var list = s.substring(1, s.length - 1).split(new RegExp(', ', 'g'));
var hash = {};
list.forEach(function(headerName) {
  hash[headerName] = context.getVariable('request.header.' + headerName);
});
var aheaders = JSON.stringify(hash, null, 2);
context.setVariable("aheaders", aheaders);

print(aheaders);