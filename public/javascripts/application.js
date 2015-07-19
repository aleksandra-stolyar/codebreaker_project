$(document).ready(function() {
  $('input[name=user-code]').focus();
  $("form").submit(function(e) {
    e.preventDefault()
    if($.trim($('#user-code').val()) == ''){
      alert('Input can not be left blank');
    }
    $.ajax ({
      url: '/check',
      type: 'POST',
      data: $(this).serialize(),
      dataType: 'json',
      success: function(response){
        var result = $('<tr><th scope="row"><span class="user-input">'+response.attempts+'</span></th><td><span class="user-input">'+response.input+'</span></td><td><span class="step-result">'+response.step_result+'</span></td></tr>');

        if(response.status == 'win') {
          alert("You won!");
          $("#dialog-confirm").dialog({
            resizable: false,
            height: 200,
            modal: true,
            buttons: {
              "Yes": function() {
                $(this).dialog("close");
                window.location.replace("/saved_results");
              },
              "No": function() {
                $(this).dialog("close");
              }
            }
          });
        }
        else if(response.status == 'loose') {
          alert("You lost!");
        }
        else {
          $("#results").append(result);
          $("#user-code").val("");
        }
      }
    });
  });

  $("#hint").click(function(e){
    e.preventDefault()
    $.ajax ({
      url: '/hint',
      type: 'POST',
      dataType: 'json',
      success: function(response){
        var visible_hint = $('<div class="hint"><span class="hint">'+response.hint+'</span></div>');
        console.log(response);
        $('#hint').replaceWith(visible_hint);
        $('input[name=user-code]').focus();
      }
    });
  });

  $("#new-game").click(function(e){
    e.preventDefault()
    location.reload();
  });
});  
