$(document).on('click', 'a.cube-loader,button.cube-loader', function (e) {
  let div = document.createElement('div');
  $(div).addClass('cube');
  $(div).addClass('show-cube');
  div.innerHTML = `
                <div class="tetrominos">
                  <div class='tetromino box1'></div>
                  <div class='tetromino box2'></div>
                  <div class='tetromino box3'></div>
                  <div class='tetromino box4'></div>
                </div>
                  `;
  if ($('#sidenav-left.sidenav').length > 0) {
    $('#sidenav-left.sidenav').attr('style', 'transform: translateX(-100%);');
  }
  document.body.appendChild(div);
});

$(document).on('submit', 'form.cube-loader', function (e) {
  let div = document.createElement('div');
  $(div).addClass('cube');
  $(div).addClass('show-cube');
  div.innerHTML = `
                <div class="tetrominos">
                  <div class='tetromino box1'></div>
                  <div class='tetromino box2'></div>
                  <div class='tetromino box3'></div>
                  <div class='tetromino box4'></div>
                </div>
                  `;
  if ($('#sidenav-left.sidenav').length > 0) {
    $('#sidenav-left.sidenav').attr('style', 'transform: translateX(-100%);');
  }
  document.body.appendChild(div);
});

$(document).ready(function() {
  $('#sign-out').on('click', function () {
    $('#form-sign-out').submit();
  });

  let check_for_products = $('#toast_no_products').length  && $('#toast_no_products').val();
  let error_toaster      = $('.user-message.user-message--error').length  && $('.user-message.user-message--error').text();
  let warning_toaster    = $('.user-message.user-message--warning').length  && $('.user-message.user-message--warning').text();
  let success_toaster    = $('.user-message.user-message--success').length  && $('.user-message.user-message--success').text();
  let validation_toaster = $('.err--on_validate').length  && $('.err--on_validate').text();
  console.log($('.user-message.user-message--error').val());
  console.log($('.user-message.user-message--warning').val());
  console.log($('.user-message.user-message--success').val());
  console.log($('.err--on_validate').val());

  if (warning_toaster) {
    M.toast({html: warning_toaster, classes: 'rounded _warning'});
  }
  if (success_toaster) {
    $('.toast.rounded').addClass('success');
    M.toast({html: success_toaster, classes: 'rounded _success'});
  }
  if (error_toaster) {
    $('.toast.rounded').addClass('error');
    M.toast({html: error_toaster, classes: 'rounded _error'});
  }
  if (validation_toaster) {
    $('.toast.rounded').addClass('warning');
    M.toast({html: validation_toaster, classes: 'rounded _warning'});
  }
  if (check_for_products) {
    $('.toast.rounded').addClass('information');
    M.toast({html: 'No Products Found!', classes: 'rounded _information'});
  }
});

$(document).on('mouseover', '#encrypt_effect', function () {
  function getMultipleRandom(arr, num) {
    const shuffled = [...arr].map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value).sort(() => 0.5 - Math.random());;
    return shuffled.slice(0, num).join().replaceAll(',', '');
  }
  // let effect      = ['!', '$', '%', '&', '/', '\\', '}', '{', '[', ']', ')', '=', '(', '?', '#', '<', '>', '^', '__', '*'];
  let effect      = ['!', '$', '%', '#', '<', '>', '^', '__', '_', '*'];
  var _data          = $('#encrypt_effect').data('effect');  
  var data          = $('#encrypt_effect').data('effect');  
  let data_length = data.length;
  for (let index = 0; index < data_length; index++) {
    effect.push(data[index]);
  }
  let _interval; 
  $(this).on('mouseout', () => {
    clearInterval(_interval);
    $('#encrypt_effect').text(_data).fadeIn();
  });
  _interval = setInterval(() => {
    let index        = Math.floor(Math.random() * data_length);
    
    let effect_index = Math.floor(Math.random() * effect.length);
    data = data.substring(0, _data.length)
    data = data.replace(data[index], getMultipleRandom(effect, index));
    $('#encrypt_effect').text(data).animate({
      marginLeft: index+'px'
   },'slow').fadeIn();
    data = _data;
  }, 400);
});