
var jPresenters;
var PresentersModel;

function onPresentersPage(){
    app.showLoading();
    LoadPresenters(EventId);
}
function LoadPresenters(Id){
        var today=new Date();
        var one_hour=1000*60*60;
        var PresentersLastPulled = storage["PresentersLast"];
        var PresentersLast = PresentersLastPulled==null? today.getTime(): parseInt(PresentersLastPulled);
        var now = today.getTime();
        var hoursPassed = (now-PresentersLast) / one_hour;
        if ((hoursPassed >= 24) || (hoursPassed ==0)) { 
            xmlhttp.onreadystatechange = PresentersLoaded;
            xmlhttp.open("GET","http://www.chicagocodecamp.com/api/Presenters/" + Id.toString()+"?json=true",true);
            xmlhttp.send();
        }
        if(jPresenters==null)
        {
            LoadPresentersFromStorage();
        }
        else
        {
            window.location.href="#PresentersPage";
            app.hideLoading();
        }
}
function PresentersLoaded(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        jPresenters = jQuery.parseJSON(xmlhttp.responseText);
        BindPresenters();
		var today=new Date();
        var PresentersList = xmlhttp.responseText;
        storage["PresentersList"] =PresentersList;
        storage["PresentersLast"]= today.getTime().toString();
    }
    app.hideLoading();
}
function LoadPresentersFromStorage()
{
       var PresentersList = storage["PresentersList"];
       jPresenters = jQuery.parseJSON(PresentersList);
       BindPresenters();
       app.hideLoading();
}
function BindPresenters()
{
    PresentersModel = {
				Presenters: ko.observableArray(jPresenters),
                PresenterSelected : PresenterSelect
            };
		
	ko.applyBindings(PresentersModel, document.getElementById('PresentersList'));
    window.location.href="#PresentersPage";
}
function PresenterSelect(e) {    
    window.location.href="#PresenterPage?"+e.Id;
}