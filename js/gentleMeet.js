"use strict";
var $scope = (function(){
  var $self = {};

  $self.events = [];
  $self.currentEvent = null;
  $self.intervalId = null;

  /**
  * Inicializacion de la clase
  * se deberian traer las fechas del servidor
  **/
  $self.init = function(){
    //Configurar el dia actual
    var currentDate = new Date();
    //Configurar los proximos 4 eventos basados en la fecha actual
    for(var i=1;i < 5; i++){
      var m = moment(currentDate);
      var endDate = m.add(30, 'm').toDate();
      var event = {
        "start":currentDate,
        "end":endDate,
        "title":"Evento " + i,
        "assistans": ["asdf@asdf.com","qwe@asdf.com","dxc@asdf.com","tyui@asdf.com"]
      }
      $self.events.push(event);
      currentDate = endDate;
    }
    console.log($self.events);
  }

  $self.validateCurrent = function(){
    $("#page").show();
    $("#loading").hide();

    var currentDate = new Date();
    var eventsToDelete = [];

    $self.cleanEventList();

    if($self.events.length === 0){
      $self.setCurrentEventInfo(null);
    }

    for(var i in $self.events){
        var event = $self.events[i];
        if(currentDate >= event.start && currentDate < event.end){
          $self.setCurrentEventInfo(event);
        }else if(currentDate > event.start && currentDate > event.end){
          eventsToDelete.push(event);
        }else if(currentDate < event.start && currentDate < event.end){
          $self.addEventToList(event);
        }
    }

    $self.events = $self.events.filter(function(x) {
      return eventsToDelete.indexOf(x) < 0
    });
  }

  $self.setCurrentEventInfo = function(event){
    if(event != null){
      $("#noEvent").hide();
      $("#eventOk").show();
      $("#eventTitle").text(event.title);
      $("#starDate").text(moment(event.start).format('MMM D YYYY, h:mm:ss a'));
      $("#endDate").text(moment(event.end).format('MMM D YYYY, h:mm:ss a'));
      $("#assistants").empty();
      event.assistans.forEach(function(item, index){
          $("#assistants").append('<li class="assistants">'+item+'</li>');
      })

      var currentDate = new Date();
      var remainingSeconds = (event.end - currentDate)/1000;
      var remainingAux = moment().startOf('day').add('s', remainingSeconds);
      $("#timeToFinish").text(remainingAux.format('[horas: ]H [minutos: ]mm [segundos: ]ss'));
    }else{
      $("#noEvent").show();
      $("#eventOk").hide();
    }

  }

  $self.addEventToList = function(event){
    $( "#eventList" ).append('<li class="event"><span>'+ event.title+'</span>&nbsp;<span>'+moment(event.start).format('MMM D YYYY, h:mm:ss a')+'</span></li>');
  }

  $self.cleanEventList = function(){
    $( "#eventList" ).empty();
  }

  $self.startInterval = function(){
    $scope.intervalId = setInterval($self.validateCurrent, 1000);
  }

  return $self;
})();



$(document).ready(function(){
       $scope.init();
       $scope.startInterval();
});
