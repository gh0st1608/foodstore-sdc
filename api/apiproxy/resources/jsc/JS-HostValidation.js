var host = context.getVariable("request.header.host");
var isValidHost = host.endsWith(".cuidaco.internal")|| host.endsWith(".cuidaco.pe");
var route = "prod";

if (host.includes("-dev.") || host.includes("-dev-")){
  route = "dev";
}
  else if (host.includes("-test.") || host.includes("-test-"))
{
  route = "test";
}
  
context.setVariable("isValidHost", isValidHost);

context.setVariable("route", route);