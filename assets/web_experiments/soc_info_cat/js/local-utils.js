const build_img_html = (img_array, div_id, trial_type) => {
  const html = [];

  if (div_id == "toy_imgs_test") {
    img_array = img_array.concat(exp.selected_toys);
    exp.img_keys = img_array;
  }

  img_array.forEach((e) => {
    html.push(`<img src="media/${e}" height="110" width="110" hspace="5">`)
  });

  if (trial_type == "activation") {$("img#bob_activation").hide()};
  $(`#${div_id}`).html(html);
}

const build_radio_html = (img_name, div_id, trial_type) => {
  const html = [];
  const action_str = img_name.split("-")[1].replace(".png", "");

  exp.action_options.forEach((e) => {
    html.push(`<label class="radio-inline">
								<input type="radio" name="action_select_${trial_type}" value="${e}-${action_str}"> ${e} ${action_str}
    					</label>`)
  })

  $(`#${div_id}`).html(html)
}

const build_final_prompt = (goal_condition, social_condition) => {

  if (social_condition == "social") {
    $("#final_toy_prompt").html("Bob came back from the kitchen, <br> and you only have time to play with <b>ONE</b> more toy.");
    $("#bob_test").css('visibility', 'visible')
  } else {
    $("#final_toy_prompt").html("Bob is still in the kitchen making lunch, <br> and you only have time to play with <b>ONE</b> more toy.");
    $("#bob_test").css('visibility', 'hidden')
  }

  switch (goal_condition) {
    case "no_goal":
      $(".display_condition").html(`You will receive a ${exp.bonus_amt} cent bonus <br> if you pay attention.`)
      break;
    case "activation":
      $(".display_condition").html(`Imagine you want to hear a toy make music. <br> You will receive a ${exp.bonus_amt} cent bonus if you are able to play music.`)
      break;
    case "learning":
      $(".display_condition").html(`Imagine you want to learn how each toy works. <br> You will receive a ${exp.bonus_amt} cent bonus if you are able to learn about the toys.`)
      break;
    case "presentation":
      $(".display_condition").html(`Imagine you want to show Bob that you are competent. <br> You will receive a ${exp.bonus_amt} cent bonus if you are able to show Bob you are competent.`)
      break;
    default:
  }
}

const remove_unselected_toys = (unselect_imgs, fade_duration) => {
  unselect_imgs.forEach((e) => {
    $(`img[src$='${e}']`).fadeOut(fade_duration)
  })
}

const update_toy_set = (selected_img) => {
  const unselect_imgs = _.without(exp.img_keys, selected_img);
  remove_unselected_toys(unselect_imgs, fade_duration = 1000);
  exp.selected_toys.push(selected_img) // this keeps track of what toys the user selected
  exp.img_keys = unselect_imgs; // this removes toy from set for second training trial
}

const handle_img_click = (slide_name) => {
  $("img").one("click", function() {
    const selected_img = $(this).attr('src').replace("media/", "");
    if ( _.contains(exp.img_keys, selected_img )) {
      $(this).css('border', "solid 4px green");
      update_toy_set(selected_img);
      if (slide_name == "final_toy_choice") {
        exp.slides.final_toy_choice.toy_selection = selected_img; // stores toy selection with slide info
        $("#adv_qa").show();
        $("#why_prompt").show()
      } else {
        $(`#action_prompt_${slide_name}`).show()
        $(`#toy_select_prompt_${slide_name}`).css('visibility', 'hidden')
        _s.build_action_selection(selected_img)
      }
    }
  });
}

const clear_training_slide = (trial_type) => {
  $(`#toy_action_radios_${trial_type}`).css('visibility', 'hidden');
  $(`#action_prompt_${trial_type}`).hide()
  $(`#submit_action_${trial_type}`).hide()
  $(`#error_msg_${trial_type}`).hide()
  $(`#notes_gif_actions_${trial_type}`).css('visibility', 'hidden');
}

const show_select_prompt = (img_array, trial_type) => {
  switch (img_array.length) {
    case 3:
      $(`#toy_select_prompt_${trial_type}`).html("Which one of Bob's toys do you want to play with first?")
      break;
    case 2:
      $(`#toy_select_prompt_${trial_type}`).html("Which of Bob's toys do you want to play with next?")
      break;
    default:
  }
  $(`#toy_select_prompt_${trial_type}`).css('visibility', 'visible');
}

const show_action_prompts = (trial_type) => {
  $(`#toy_action_radios_${trial_type}`).css('visibility', 'visible');
  $(`#action_prompt_${trial_type}`).css('visibility', 'visible');
  $(`#submit_action_${trial_type}`).css('visibility', 'visible');
  $(`#submit_action_${trial_type}`).show();
}

const check_radio_buttons = (radio_name) => {
  if (!$(`input[name='${radio_name}']:checked`).val()) {
    return false
  } else {
    return true
  }
}

const get_toy_type = (action_str) => {
  return _.without(exp.action_options, action_str.split("-")[0]).toString() + "-" + action_str.split("-")[1];
}

const show_error_msg = (trial_type) => {
  $(`#error_msg_${trial_type}`).css('color', 'red');
  $(`#error_msg_${trial_type}`).html('Please select an action')
  $(`#error_msg_${trial_type}`).show()
}

const check_bob_present = (trial_type) => {
  if ($(`img#bob_${trial_type}`).css('opacity') == 0 || $(`img#bob_${trial_type}`).is(":hidden")) {
    return false
  } else {
    return true
  }
}

const disable_radios = (name) => {
  $(`input[name='${name}']`).attr('disabled', true);
}

const enable_radios = (name) => {
  $(`input[name='${name}']`).attr('disabled', false);
}

const disable_button = (button_id) => {
  $(`#${button_id}`).attr('disabled', true);
}

const enable_button = (button_id) => {
  $(`#${button_id}`).attr('disabled', false);
}

const hide_button = (button_id) => {
  $(`#${button_id}`).hide()
}

const show_button = (button_id) => {
  $(`#${button_id}`).show()
}



const show_failure_msg = (trial_type) => {
  $(`#error_msg_${trial_type}`).hide()
  $(`#submit_action_${trial_type}`).html("Try Again")
  $(`#action_prompt_${trial_type}`).css('visibility', 'hidden');
  $(`#error_msg_${trial_type}`).css('color', 'red');
  if ( check_bob_present(trial_type) ) {
    $(`#error_msg_${trial_type}`).html(`Bob says, "Hmm, that didn't work! You couldn't make this toy play music."`)
  } else {
    $(`#error_msg_${trial_type}`).html(`That didn't work! You couldn't make this toy play music.`)
  }
  $(`#error_msg_${trial_type}`).show()
}

const show_arrive_msg = (trial_type) => {
  $(`#error_msg_${trial_type}`).hide()
  $(`#error_msg_${trial_type}`).css('color', 'black');
  $(`#error_msg_${trial_type}`).html("Bob just came from making lunch in the kitchen.")
  $(`#error_msg_${trial_type}`).show()
}

const show_leave_msg = (trial_type) => {
  $(`#error_msg_${trial_type}`).hide()
  $(`#error_msg_${trial_type}`).css('color', 'black');
  $(`#error_msg_${trial_type}`).html("Bob left to continue making lunch in the kitchen and <br> won't be able to see or hear you.")
  $(`#error_msg_${trial_type}`).show()
}

const show_success_msg = (n_successes, trial_type) => {
  $(`#error_msg_${trial_type}`).hide()
  $(`#error_msg_${trial_type}`).css('color', 'green');
  if (n_successes == 1) {
    if ( check_bob_present(trial_type) ) {
      $(`#error_msg_${trial_type}`).html('Bob says, "Wow, that worked! You made the toy play music. Can you do it again?"');
    } else {
      $(`#error_msg_${trial_type}`).html("That worked! Can you make it play music again?");
    }
  } else {
    if (check_bob_present(trial_type) ) {
      $(`#error_msg_${trial_type}`).html('Bob says, "Nice, that worked again!"');
    } else {
      $(`#error_msg_${trial_type}`).html("Nice, that worked again!");
    }
  }
  $(`#error_msg_${trial_type}`).show()
}

const init_try_again = (curr_toy, trial_type) => {
  const fade_duration = 2000;
  const fade_opacity = 0;
  hide_button(`submit_action_${trial_type}`)

  if (trial_type == "activation") {
    $("#error_msg_activation").hide()
    // if bob is  present then he has seen the success and we advance to next slide
    // otherwise he needs  to show up and see the success
    if ( check_bob_present(trial_type) ) {
      _s.build_action_selection(curr_toy);
    } else {
      show_arrive_msg(trial_type);
      $("img#bob_activation").fadeIn(3000);
      setTimeout(function() {
        $("#error_msg_activation").hide()
        _s.build_action_selection(curr_toy);
      }, fade_duration + 1500);
    }
  } else if (trial_type == "presentation") {
    $("#error_msg_presentation").hide()
    if ( check_bob_present(trial_type) ) {
      show_leave_msg(trial_type);
      $("img#bob_presentation").fadeTo(fade_duration, fade_opacity)
      setTimeout(function() {
        $("#error_msg_presentation").hide()
        _s.build_action_selection(curr_toy);
      }, fade_duration + 1500);
    } else {
      _s.build_action_selection(curr_toy);
    }
  }
}

const get_music = (music_path, trial_type) => {
  $(`#sound_player_${trial_type}`).attr("src", `media/${music_path}`);
}


const handle_failure = (trial_type) => {
  disable_radios(`action_select_${trial_type}`);
  show_failure_msg(trial_type);
}

const handle_success = (n_successes, curr_toy, trial_type) => {
  show_success_msg(n_successes, trial_type);

  if (trial_type == "activation") {
    disable_radios("action_select_activation");
    hide_button("submit_action_activation");
    $("#notes_gif_actions_activation").css('visibility', 'visible');
    const myAudio = $('#sound_player_activation')[0];
    myAudio.play();
    $('#sound_player_activation').on('ended', function() {
      if (n_successes == 2) {
        $('#sound_player_presentation').off('ended') // remove event listener
        exp.go()
      } else {
        _s.build_action_selection(curr_toy);
      }
    });
  } else if (trial_type == "presentation") {
    disable_radios("action_select_presentation");
    hide_button("submit_action_presentation");
    $("#notes_gif_actions_presentation").css('visibility', 'visible');
    const myAudio = $('#sound_player_presentation')[0];
    myAudio.play();
    $('#sound_player_presentation').on('ended', function() {
      if (n_successes == 2) {
        $('#sound_player_presentation').off('ended') // remove event listener
        exp.go()
      } else {
        _s.build_action_selection(curr_toy);
      }
    });
  }
}

const extract_goal_condition = (cond) => {
  return cond.split("-")[0]
}

const extract_soc_condition = (cond) => {
  return cond.split("-")[1]
}

const get_ip = () => {
  $.getJSON('https://ipapi.co/json/', function(data) {
    const ip_data = JSON.stringify(data, null, 2);
    return ip_data
  });
}
