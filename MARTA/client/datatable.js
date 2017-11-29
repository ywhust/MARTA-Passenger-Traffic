$.getJSON("http://localhost:615/dummy?action=dostuff&callback=?",
function(data){
  alert(data);
},
function(jqXHR, textStatus, errorThrown) {
    alert('error ' + textStatus + " " + errorThrown);
});