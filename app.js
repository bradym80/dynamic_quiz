// Bunch of questions, choices, answers
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
      question     = document.getElementById('question'),
      back         = document.getElementById('back'),
      next         = document.getElementById('next'),
      score        = document.getElementById('score'),
      progress     = $('.progress'),
      notification = document.getElementById('notification'),
      reset        = document.getElementById('reset');

  // Click Start to start quiz
  function beginning() {
    question.style.display = 'none';
    back.style.display = 'none';
    next.style.display = 'none';
    reset.style.display = 'none';
    score.style.display = 'none';
    progress.hide();
    var start_button = document.getElementById('start');

    start_button.onclick = function(e){
      e.preventDefault;
      var start_page = document.getElementById('start_page');
      start_page.style.display = 'none';
      question.style.display = 'block';
      back.style.display = 'block';
      next.style.display = 'block';
      score.style.display = 'block';
      progress.show();
    };
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

  function storeAnswer(){
    for(var i = 0; i < 3; i++) {
      if (document.getElementsByName('choice')[i].checked) {
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
      if (answer[count]) {
        var num = parseInt(answer[count]);
        var answerChoice = document.getElementsByTagName('input')[num];
        answerChoice.checked = "checked";
        if (parseInt(answer[count]) === questions[count].answer) {
          totalCorrect--;
          update_correct_progress_bar();
        } else {
          totalMissed--;
          update_missed_progress_bar();
        }
      }
    } else {
      remove_all_childnodes(question);
      remove_all_childnodes(score);
      next.style.display='none';
      back.style.display='none';
      reset.style.display = 'block';
      remove_all_childnodes(notification);
      var final_score_tag = document.createElement('p');
      var final_score = document.createTextNode('Final score: ' + totalCorrect + ' / '+ questions.length);
      final_score_tag.appendChild(final_score);
      question.appendChild(final_score_tag);
      restart_quiz();
    }
  }

  function update_correct_progress_bar(){
    var percentage = (totalCorrect / questions.length)*100;
    $('.progress-bar-success').attr('style', 'width: '+percentage+'%');
  }

  function update_missed_progress_bar(){
    var percentageMissed = (totalMissed / questions.length)*100;
    $('.progress-bar-danger').attr('style', 'width: '+percentageMissed+'%');
  }

  // Evaluate answer and scores once NEXT button is clicked
  // Update progress bar and score
  function answer_and_score(){
    storeAnswer();
    remove_all_childnodes(notification);
    
    if (answer[count] === undefined){
      var notification_tag = document.createElement('p');
      var notification_text = document.createTextNode('Choose one');
      notification_tag.appendChild(notification_text);
      notification.appendChild(notification_tag);

    } else if (parseInt(answer[count]) === questions[count].answer) {
      var notification_tag = document.createElement('p');
      var notification_text = document.createTextNode('Correct!');
      notification_tag.appendChild(notification_text);
      notification.appendChild(notification_tag);

      remove_all_childnodes(question);
      remove_all_childnodes(score);
      totalCorrect++;
      var score_tag = document.createElement('p');
      var score_text = document.createTextNode('Score: '+totalCorrect+' / '+questions.length);
      score_tag.appendChild(score_text);
      score.appendChild(score_tag);

      count++;
      update_correct_progress_bar();
      generate_question();

    } else {
      var notification_tag = document.createElement('p');
      var notification_text = document.createTextNode('Wrong!');
      notification_tag.appendChild(notification_text);
      notification.appendChild(notification_tag);

      remove_all_childnodes(question);
      remove_all_childnodes(score);
      var score_tag = document.createElement('p');
      var score_text = document.createTextNode('Score: '+totalCorrect+' / '+questions.length);
      score_tag.appendChild(score_text);
      score.appendChild(score_tag);

      count++;
      totalMissed++;
      update_missed_progress_bar();
      generate_question();
    }
  };

  //Click NEXT or Hit Enter key to proceed
  function evaluate_answer(){
    next.onclick = function(){
      answer_and_score();
    };

    window.onkeyup = function(e){
      if (e.keyCode == 13) {
        answer_and_score();
      }
    }      
  }

  // Go back to previous question
  function previous_question(){
    back.onclick = function(){
      if (count >= 1) {
        count--;
        remove_all_childnodes(question);
        remove_all_childnodes(score);
        generate_question();
      }
    }
  }

  // Restart the quiz
  function restart_quiz(){
    reset.onclick = function(){
      location.reload(true);
    };
  }

  // Quiz initiation
  beginning();
  generate_question();
  evaluate_answer();
  previous_question();

});