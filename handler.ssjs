<script runat="server">
/*Added CORS*/
/* HDR - Donation Thanks Handler*/
Platform.Load("Core", "1.1.1");
// Check request originates from a *.act.greenpeace.org.nz domain
try {
    
    var referer = Platform.Request.ReferrerURL;
    var regex = /^(https:\/\/(.*\.)?((act.greenpeace)\.org.nz))($|\/)/g;
    var match = referer.match(regex);
    var origin = (match.length > 0) ? match[1] : null;

    if (origin != null) {

        HTTPHeader.SetValue('Access-Control-Allow-Methods', 'POST');
        HTTPHeader.SetValue('Access-Control-Allow-Origin', origin);
        Platform.Response.SetResponseHeader('Strict-Transport-Security', 'max-age=200');
        Platform.Response.SetResponseHeader('X-XSS-Protection', '1; mode=block');
        Platform.Response.SetResponseHeader('X-Frame-Options', 'Deny');
        Platform.Response.SetResponseHeader('X-Content-Type-Options', 'nosniff');
        Platform.Response.SetResponseHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        Platform.Response.SetResponseHeader('Content-Security-Policy', "default-src 'self'");
        Platform.Response.SetResponseHeader('Vary','Origin');

    } else {
        // throw "Wrong origin";
        Redirect("https://www.greenpeace.org/aotearoa/",true);
    }

 /// All the Handler Code goes here aka - Action Goes Here
    var requestMethod = Request.Method();

    if (requestMethod=='POST' && Request.GetFormField("email")){
       var data = {
            attributes : {
              FirstName: Request.GetFormField("firstname"),
              LastName: Request.GetFormField("lastname"),
              Amount: Request.GetFormField("amount"),
              Email: Request.GetFormField("email"),
              Frequency: Request.GetFormField("frequency"),
              LocalDateTime: Request.GetFormField("localDateTime"),
              Campaign: Request.GetFormField("campaign"),
              PageCode: Request.GetFormField("pc"),
              ContentCode: Request.GetFormField("contentcode")
           },
           subscriber : {
             EmailAddress: Request.GetFormField("email"),
             SubscriberKey: Request.GetFormField("email")
           }
        }

      var TSDthanks = TriggeredSend.Init(2254);
      var StatusThanks = TSDthanks.Send(data.subscriber,data.attributes);

      if(Request.GetFormField("frequency")=="single"){
         var TSDreceipt = TriggeredSend.Init(2196);
         var StatusReceipt = TSDreceipt.Send(data.subscriber,data.attributes);
      }
    }else{
      Write('thanks 2 all >first< then if single receipt');
    }
} catch(error) {
  // Do This if Origin does not match Regex
  // Write(Stringify({ status: "Error", message: error }));
  Redirect("https://www.greenpeace.org/aotearoa/",true);
}   
</script>