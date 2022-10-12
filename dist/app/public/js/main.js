$(document).ready(function() {
  const _core_functions = {
    /**
     * @namespace _core_functions
     * @function showLoaderOnClick
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Renders a loader on click
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    showLoaderOnClick: (() => {
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
    })(),
  
    /**
     * @namespace _core_functions
     * @function showLoaderOnSubmit
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Renders a loader on form submit
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    showLoaderOnSubmit: (() => {
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
    })(),
    
    /**
     * @namespace _core_functions
     * @function onClickEvents
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description On click events
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    onClickEvents: (() => {
      $('#sign-out').on('click', function () {
        $('#form-sign-out').submit();
      });
    })(),
  
    /**
     * @namespace _core_functions
     * @function autoGetFormPostedData
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Gets posted data automatically to the form
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    autoGetFormPostedData: (() => {
      let posted_data = $('.posted_data').length  && $('.posted_data').val();
      if (posted_data) {
        posted_data = JSON.parse(posted_data);
        if (Object.keys(posted_data).length > 0) {
          for (const key in posted_data) {
            $(`[name='${key.toString()}']`).val(posted_data[key]);
          }
        }
      }
    })(),
    
    /**
     * @namespace _core_functions
     * @function checkStatus
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Checks if there are any rendered items on home page
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    checkStatus: (() => {
      let check_for_products = $('#toast_no_products').length  && $('#toast_no_products').val();
      if (check_for_products) {
        $('.toast.rounded').addClass('information');
        M.toast({html: 'No Products Found!', classes: 'rounded _information'});
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function highlightInvalidUserInput
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Automatically adds invalid class to an input
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    highlightInvalidUserInput: (() => {
      let errored_inputs = $('.errored_inputs').length  && $('.errored_inputs').val();
      if (errored_inputs) {
        errored_inputs = JSON.parse(errored_inputs);
        if (Object.keys(errored_inputs).length > 0) {
          for (const key in errored_inputs) {
            $(`[name="${errored_inputs[key].toString()}"]`).addClass('invalid');
          }
        }
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function warningToaster
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Automatically renders a toaster on warning event
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    warningToaster: (() => {
      let warning_toaster    = $('.user-message.user-message--warning').length  && $('.user-message.user-message--warning').text();
      if (warning_toaster) {
        M.toast({html: warning_toaster, classes: 'rounded _warning'});
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function successToaster
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Automatically renders a toaster on success event
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    successToaster: (() => {
      let success_toaster    = $('.user-message.user-message--success').length  && $('.user-message.user-message--success').text();
      if (success_toaster) {
        $('.toast.rounded').addClass('success');
        M.toast({html: success_toaster, classes: 'rounded _success'});
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function validationToaster
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Automatically renders a toaster on erroed validated data
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    validationToaster: (() => {
      let validation_toaster = $('.err--on_validate').length  && $('.err--on_validate').text();
      if (validation_toaster) {
        $('.toast.rounded').addClass('warning');
        validation_toaster = validation_toaster.replaceAll('-', '<br>').replace('<br>', '');
        M.toast({html: validation_toaster, classes: 'rounded _warning'});
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function errorToaster
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Automatically renders a toaster on error event
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    errorToaster: (() => {
      let error_toaster      = $('.user-message.user-message--error').length  && $('.user-message.user-message--error').text();
      if (error_toaster) {
        $('.toast.rounded').addClass('error');
        M.toast({html: error_toaster, classes: 'rounded _error'});
      }
    })(),
  
    /**
     * @namespace _core_functions
     * @function encryptEffect
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Animation
     * @todo Still in progress
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    encryptEffect: (() => {
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
    })(),

    /**
     * @namespace _core_functions
     * @function completeUploaderForm
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @description Adds the csrf token to all uploader forms
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    completeUploaderForm: (() => {
      const is_upload_process   = $('div#_uploader').length
      const uploader            = $('form');
      const token               = $('input#_csrf').val();
      const TEN_MB              = 10000000;
      const FIVE_MB             = 5000000;
      const ONE_BYTE            = 1;
      var   _start_upload_file  = 'Upload file';
      var   _start_upload_files = 'Upload files';
      let   url                 = ''
      $.each(uploader, function (index, form) {
        if($(form).attr('method') === 'POST' 
           || $(form).attr('method') === 'post'
          || $(form).attr('method') === 'Post') {
            url = $(form).attr('action');
            if (typeof url === 'string' && url) {
              if (url.endsWith('/')) {
                url = url + `?_csrf=${token}`;
              } else {
                url = url + `/?_csrf=${token}`;
              }
              $(form).attr('action', url);
            }
          }
      });
      if (is_upload_process !== 0) {
        var max_upload_files = +$('.max-file-size').val();
        $('#fileupload').fileupload({
            dataType: 'json',
            limitMultiFileUploads: 1,
            limitConcurrentUploads: max_upload_files,
            maxFileSize: TEN_MB,
            minFileSize: ONE_BYTE,
            maxChunkSize: FIVE_MB,
            maxNumberOfFiles: max_upload_files,
            disableValidation: false,
            limitMultiFileUploadSize: TEN_MB,
            cache: false,
            singleFileUploads: true,
            sequentialUploads: true,
            forceIframeTransport: true,
            autoUpload: false,
            add: function (e, data) {
              data.context = $('#uploader_status_icon').click((e) => {
                if ($('#start_upload_process span').text() === 'Upload files'
                ||  $('#start_upload_process span').text() === 'Upload file') {
                  if (data != null) {
                    if (+data.files.length <= +max_upload_files) {
                      e.preventDefault();
                      data.submit()
                      .complete(result => {
                        let upload_object = {};
                        if (result) {
                          if (result.responseJSON) {
                            if (result.responseJSON.data) {
                              if (result.responseJSON.data.upload_object) {
                                upload_object              = JSON.parse(result.responseJSON.data.upload_object);
                                var sanitize_upload_object = JSON.stringify(upload_object).replaceAll('"', "'"); 
                                var form_id                = $('.uploader-form-id').val().trim();
                                var upload_input_name      = $('#fileupload').attr('name');
                                if (form_id && upload_input_name) {
                                  $(`#${form_id}`).append($(`<input type='hidden' class="uploader upload_object" name='upload_object' value="${sanitize_upload_object}">`));
                                  $(`#${form_id}`).append($(`<input type='hidden' class="upload-input-name" name='upload-input-name' value="${upload_input_name}">`));
                                }
                              }
                            }
                          }
                        }
                      });
                    } else {
                      console.log('max reached')
                      console.log(data.files)
                      // data.files = [];
                      var file_input = $("#fileupload");
                      file_input.wrap('<form>').closest('form').get(0).reset();
                      file_input.unwrap();
                      file_input.val(null);
                      M.toast({html: 'Max limit of uploaded files exceeded, please upload the allowed limit of 5 files!', classes: 'rounded _warning'});
                      $('#start_upload_process span').text('Upload again');
                      $('#uploader_status_icon').fadeOut('fast');
                      $('#uploader_status_icon_reset').fadeOut('fast');
                      $('#uploader_status_icon_complete_error').fadeIn('fast');
                      $('.file-path').val('');
                      return;
                    }
                  }
                }
              });
            },
            change: function (e, data) {
              var total_uploaded_files   = +data.files.length;
              $(document).on('click', $('#uploader_status_icon_reset'), (event) => {
                console.log('reset')
                console.log(data.files)
                // data.files = [];
                var file_input = $("#fileupload");
                file_input.wrap('<form>').closest('form').get(0).reset();
                file_input.unwrap();
                file_input.val(null);
                $('#start_upload_process span').text('Upload again');
                $('#uploader_status_icon').fadeOut('fast');
                $('#uploader_status_icon_reset').fadeOut('fast');
                $('#uploader_status_icon_complete_error').fadeIn('fast');
                $('.file-path').val('');
                return;
              });
              if (max_upload_files && total_uploaded_files) {
                if (total_uploaded_files > max_upload_files) {
                  data.files = [];
                  var file_input = $("#fileupload");
                  file_input.wrap('<form>').closest('form').get(0).reset();
                  file_input.unwrap();
                  file_input.val(null);
                  M.toast({html: 'Max limit of uploaded files exceeded, please upload the allowed limit of 5 files!', classes: 'rounded _warning'});
                  $('#start_upload_process span').text('Upload again');
                  $('#uploader_status_icon').fadeOut('fast');
                  $('#uploader_status_icon_reset').fadeOut('fast');
                  $('#uploader_status_icon_complete_error').fadeIn('fast');
                  $('.file-path').val('');
                  return;
                } else {
                  $('#uploader_status_icon_complete_error').fadeOut('fast');
                  if ($('.file-path').val() === '') {
                    $('#uploader_status_icon').fadeOut('fast');
                    $('#uploader_status_icon_reset').fadeOut('fast');
                  } else {
                    $('#uploader_status_icon').fadeIn('fast');
                    $('#uploader_status_icon_reset').fadeIn('fast');
                  }
                  if (total_uploaded_files > 1) {
                    $('#start_upload_process span').text('Upload files');
                    _start_upload_file = null;
                  } else {
                    $('#start_upload_process span').text('Upload file');
                    _start_upload_files = null;
                  }
                  $.each(data.files, function (index, file) {
                    $('.file-path').val(file.name);
                  });
                }
              }
            },
            progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              if (progress === 100) {
                $('#progress').addClass('progress_bar_fixed');
              }
              $('#progress').attr('value', progress.toString());
            },
            done: (data) => {
              $('#start_upload_process span').text('Upload completed');
              $('#start_upload_process').attr('disabled', true);
              $('.toast.rounded').addClass('success');
              $('#uploader_status_icon').click(function (e) {
                  e.preventDefault();
                  $('.toast.rounded').addClass('success');
                  M.toast({html: 'File has been uploaded', classes: 'rounded _success'});
              });
              if (_start_upload_files == null) {
                $('#uploader_status_icon').fadeOut('slow');
                $('#uploader_status_icon_reset').fadeOut('slow');
                $('#uploader_status_icon_complete_one').fadeIn('slow');
              } else if (_start_upload_file == null) {
                $('#uploader_status_icon').fadeOut('slow');
                $('#uploader_status_icon_reset').fadeOut('slow');
                $('#uploader_status_icon_complete_all').fadeIn('slow');
              }
            },
        });
      }
    })(),
    
  };
});
