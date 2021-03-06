var questions = [
      {q: "What is the capital of Japan?",     choices: ["Osaka", "Tokyo", "Kyoto"],         answer: 1},
      {q: "What is the capital of Australia?", choices: ["Sydney", "Melbourne", "Canberra"], answer: 2},
      {q: "What is the capital of Slovakia?",  choices: ["Bratislava", "Kosice", "Nitra"],   answer: 0},
      {q: "What is the capital of Belarus?",   choices: ["Homyel", "Minsk", "Mogilev"],      answer: 1},
      {q: "What is the capital of Zambia?",    choices: ["Ndola", "Kitwe", "Lusaka"],        answer: 2},
      {q: "What is the capital of Eritrea?",   choices: ["Asmara", "Keren", "Teseney"],            answer: 0},
      {q: "What is the capital of Namibia?",   choices: ["Tsumeb", "Swakopmund", "Windhoek"],      answer: 2},
      {q: "What is the capital of Guyana?",    choices: ["Linden", "Georgetown", "New Amsterdam"], answer: 1},
      {q: "What is the capital of Azerbaijan?", choices: ["Ganja", "Sumgait", "Baku"],              answer: 2},
      {q: "What is the capital of Slovenia?",  choices: ["Ljubljana", "Maribor", "Celje"],         answer: 0}
    ];

$(document).ready(function(){ 
  var count         = 0,
      answer        = new Array(10),
      totalMissed   = 0,
      totalCorrect  = 0,
      username_div = document.getElementById('username_div'),
      question     = document.getElementById('question'),
      back         = document.getElementById('back'),
      next         = document.getElementById('next'),
      progress     = $('.progress'),
      notification = document.getElementById('notification'),
      counter      = document.getElementById('counter'),
      reset        = document.getElementById('reset');

  // Hide questions and related stuff initially
  question.style.display = 'none';
  back.style.display = 'none';
  next.style.display = 'none';
  reset.style.display = 'none';
  progress.hide();
  counter.style.display = 'none';

  // Start quiz once start button is clicked
  function beginning() {
    var start_button = document.getElementById('start');
    start_button.onclick = function(e){
      e.preventDefault;
      click_start_button();
    };
  }

  // Check if the username is empty
  function check_the_input(str) {
    return str.replace(/^\s+|\s+$/g,'');
  } 

  function click_start_button(){
    // Display username
    sessionStorage.name = document.getElementById('username').value;
    if (check_the_input(sessionStorage.name) !== '') {
      var username = sessionStorage.name;
      var username_area = document.createElement('p');
      var question_choices = document.createTextNode('Welcome, ' + username);
      username_div.appendChild(username_area);
      username_area.appendChild(question_choices);

      // Display questions
      var start_page = document.getElementById('start_page');
      start_page.style.display = 'none';
      question.style.display = 'block';
      back.style.display = 'block';
      next.style.display = 'block';
      progress.show();
      counter.style.display = 'block';
    } else {
      alert('Enter your name');
    }
  }

  // remove all child nodes
  function remove_all_childnodes(selected_id){
    var myNode = selected_id;
    var targetChild = myNode.firstChild;

    while(targetChild) {
      myNode.removeChild(targetChild);
      targetChild = myNode.firstChild;
    }    
  }

  // update and save the user's answer
  function storeAnswer(){
    for(var i = 0; i < 3; i++) {
      if (document.getElementsByName('choice')[i].checked) {
        // if already answered, update the answer (when go back)
        if (answer[count] !== undefined) {
          answer.splice(count, 1, document.getElementsByName('choice')[i].value);
        } else {
          answer.splice(count, 0, document.getElementsByName('choice')[i].value);
        }
      }
    }
  }

  // Generate question & score
  function generate_question(){
    if (count < questions.length) {
      var generated_q = document.createElement('h3');
      var text_q = document.createTextNode(questions[count].q);
      generated_q.appendChild(text_q);
      question.appendChild(generated_q);

      for(var i =0; i < 3; i++) { 
        var generated_label = document.createElement('label');
        var generated_input = document.createElement('input');
        question.appendChild(generated_label);
        generated_label.appendChild(generated_input);
        generated_input.setAttribute("type", "radio");
        generated_input.setAttribute("name", "choice");
        generated_input.setAttribute("value", i);
        
        var question_choices = document.createTextNode(questions[count].choices[i]);
        generated_label.appendChild(question_choices);
      }

      var score_tag = document.createElement('p');
      var score_text = document.createTextNode('Progress: '+count+' / '+questions.length);
      score_tag.appendChild(score_text);
      counter.appendChild(score_tag);

      // When go back a question, also adjust progress bar and total score
      if (answer[count]) {
        var num = parseInt(answer[count]);
        var answerChoice = document.getElementsByName('choice')[num];
        answerChoice.checked = "checked";
        if (parseInt(answer[count]) === questions[count].answer) {
          totalCorrect--;
          update_progress_bar();
        } else {
          totalMissed--;
          update_progress_bar();
        }
      }

    } else {
      remove_all_childnodes(question);
      next.style.display='none';
      back.style.display='none';
      reset.style.display = 'block';
      remove_all_childnodes(notification);
      remove_all_childnodes(counter);
      var final_score_tag = document.createElement('h2');
      var final_score = document.createTextNode('Final score: ' + totalCorrect + ' / '+ questions.length);
      final_score_tag.appendChild(final_score);
      question.appendChild(final_score_tag);
      progress.hide();
      restart_quiz();
    }
  }

  // Update progress bar
  function update_progress_bar(){
    var percentage = (count / questions.length)*100;
    $('.progress-bar-info').attr('style', 'width: '+percentage+'%');
  }

  // Evaluate answer and scores once NEXT button is clicked
  function answer_and_score(){
    storeAnswer();
    remove_all_childnodes(notification);
    // When user did not choose any answer
    if (answer[count] === undefined){
      var notification_tag = document.createElement('p');
      var notification_text = document.createTextNode('Choose one');
      notification_tag.appendChild(notification_text);
      notification.appendChild(notification_tag);
      $('#notification').children().fadeOut(1500);
    } // When the answer is correct
    else if (parseInt(answer[count]) === questions[count].answer) {
      remove_all_childnodes(question);
      remove_all_childnodes(counter);
      
      count++;
      totalCorrect++;
      update_progress_bar();
      generate_question();
    } // When missed the answer
    else {
      remove_all_childnodes(question);
      remove_all_childnodes(counter);

      count++;
      totalMissed++;
      update_progress_bar();
      generate_question();
    }
  };

  //Click NEXT or Hit Enter key to proceed
  function evaluate_answer(){
    next.onclick = function(){
      answer_and_score();
    };

    window.onkeyup = function(e){
      if ((e.keyCode == 13) && (start_page.style.display == 'none')){
        answer_and_score();
      } else if ((e.keyCode == 13) && (start_page.style.display != 'none')) {
        click_start_button();
      }
    }      
  }

  // Go back to previous question
  function previous_question(){
    back.onclick = function(){
      if (count >= 1) {
        count--;
        remove_all_childnodes(question);
        remove_all_childnodes(counter);
        generate_question();
      }
    }
  }

  // Restart the quiz
  function restart_quiz(){
    reset.onclick = function(){
      location.reload(true);
      sessionStorage.removeItem('name');
    };
  }

  // Quiz initiation
  beginning();
  generate_question();
  evaluate_answer();
  previous_question();

});