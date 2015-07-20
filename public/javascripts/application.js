$(document).ready(function() {
  $("#user-code").keyup(function() {
    $("#user-code").val(this.value.match(/[1-6]*/));
  });

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
          $("#dialog-confirm").modal("show");
          $("#yes").click(function() {
            $("#dialog-confirm").modal("hide");
            window.location.replace("/saved_results");
          });
          $("#no").click(function() {
            $("#dialog-confirm").modal("hide");
          });
        }
        else if(response.status == 'loose') {
          alert("You lost!");
          window.location.replace("/")
        }
        else {
          $("#results").append(result);
          $("#user-code").val("");
          $('input[name=user-code]').focus();
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
        var visible_hint = $('<div class="hint"><span class="hint text-muted text-uppercase"><font size="5">Hint: <span class="text-primary">'+response.hint+'</span></font></span></div>');
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
