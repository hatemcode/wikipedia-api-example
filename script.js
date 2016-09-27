function close(){
  $("#query-input").val("");
}

function search(){
  hideError();
  resetResults();
  
  var maxResults = 10;
  var query = getQueryInput();

  var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=" + query +"&srnamespace=0&srprop=snippet&srlimit=" + maxResults;
  
  $.ajax({
    method: "GET",
    url: url,
    dataType: "jsonp",
  })
  .done(function( result ) {
    if(result.query.searchinfo.totalhits == 0){
      showError("No results found for your search !");
    }else{
      showResults(result);
    }
  })
  .fail(function(){
    showError("There is problem connection to Wikipedia API !");
  });  
}

function randomArticle(){
  hideError();
  resetResults();

  var url = "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json";
  
  $.ajax({
    method: "GET",
    url: url,
    dataType: "jsonp",
  })
  .done(function( result ) {
     showRandomResult(result);
    
  })
  .fail(function(){
    showError("There is problem connection to Wikipedia API !");
  });  
}

function getQueryInput(){
  return $("#query-input").val();
}

function showError(msg){
  $("p.error").show();
  $("p.error").html(msg);
 
}

function hideError(){
  $(".error").hide();
}

function resetResults(){
  $("#result").html("");
  $("#result").hide();
}

function showResults(result){
  for(var i = 0; i < result.query.search.length; i++){
    var title = result.query.search[i].title;
    var slug = title.replace(" ","_");
    var url = "https://en.wikipedia.org/wiki/" + slug;
    var html = '<div class="record"><h4><a href="' + url + '" target="blank">' + title + '<a/></h4><p>' + result.query.search[i].snippet + '</p></div>';
    $("#result").append(html);
  }
  
   $("#result").show();
}

function showRandomResult(result){
    var title;
    var extract;
    var slug;
    var url;
    var html;
  
    $.each(result.query.pages,function(index,value){
      
      title =  result.query.pages[index].title;
      slug = title.replace(" ","_");
      url = "https://en.wikipedia.org/wiki/" + slug;
      extract = result.query.pages[index].extract;

      html = '<div class="record"><h4><a href="' + url + '" target="blank">' + title + '<a/></h4><p>' + extract + '</p></div>';
      $("#result").append(html);

    })
    
    $("#result").show();
}

function validateSearchInput(){
  
  if(getQueryInput() == ""){
    showError("Please fill the search box !");
    return false;
  }
  return true;
}

// when page is loaded
$(document).ready(function(){
  
  $("#search-button").click(function(e){
    e.preventDefault();
    if(validateSearchInput()){
      search();
    }
  });
  
  $("#random-button").click(function(e1){
    e1.preventDefault();
    randomArticle();
   
  });
  
  $("#close-button").click(function(){
    close();
  });
});
