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
            $(`[name='${key.toString()}']`).not(':input[type=file]').val(posted_data[key]);
            // $(`[name='${key.toString()}']`).val(posted_data[key]);
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
     * @description Adds the csrf token to all post forms automatically
     * @version 1.0.0
     * @since 22.09.2022
     * @returns void
    */
    completeUploaderForm: (() => {
      const forms            = $('form');
      const token               = $('input#_csrf').val();
      let   url                 = ''
      
      $.each(forms, function (index, form) {
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
    })(),

    asyncUpload: (function() {
      const is_upload_process = $('div#_uploader').length
      const token             = $('input#_csrf').val();
      if (is_upload_process !== 0 && token) {
        //* Defining all process needed variables *\\
        var input = document.querySelector('#fileupload'); //? To control the value, on reselection or reseting *\\
        var max_upload_files = +$('.max-file-size').val(); //? To retrieve the max file size hidden inputs's value *\\
        var _url             = $('#upload-action-url').val(); //? To retrieve the upload (action) url*\\
        
        //* Check if the url is not empty *\\
        if (!_url) {
          throw new Error('Upload url must not be empty!');
        } else {
          //* Adding CSRF token *\\
          _url = `${_url}?_csrf=${token}&nocache`
        }

        //* On click event to reset the input file value *\\
        input.onclick = function () {
          this.value = null;
        };
        
        //* On change event to manipulate the ui and validate the selected files's numbers *\\
        input.onchange = function (evt) {
          var total_uploaded_files = +evt.target.files.length;
          $('#uploader_status_icon_reset').on('click', (event) => {
            var file_input = $("#fileupload");
            file_input.wrap('<form>').closest('form').get(0).reset();
            file_input.unwrap();
            file_input.val(null);
            $('#start_upload_process span').text('Upload again');
            $('#uploader_status_icon').fadeOut('fast');
            $('#uploader_status_icon_reset').fadeOut('fast');
            $('#uploader_status_icon_complete_error').fadeOut('fast');
            $('.file-path').val('');
            return;
          });

          $('#uploader_status_icon_complete_error').fadeOut('fast');
          if (max_upload_files && total_uploaded_files) {
            if (total_uploaded_files > max_upload_files) {
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
            
            if (!total_uploaded_files) {
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
            // $.each(data.files, function (index, file) {
            //   $('.file-path').val(file.name);
            // });
          }
        };
        
        //* Form submition triggerer *\\
        $('#uploader_status_icon').on('click', (e) => {
          if ($('#start_upload_process span').text() === 'Upload files'
          ||  $('#start_upload_process span').text() === 'Upload file') {
            $('#pre-populated-upload-form').submit();
          }
        });

        //* On form submit event to send ajax post request with the selected files *\\
        $("#pre-populated-upload-form").submit(function(evt){   
          evt.preventDefault();
          $.ajax({
              dataType: 'json',
              url: _url,
              type: 'POST',
              data: new FormData($(this)[0]),
              async: true,
              cache: false,
              contentType: false,
              timeout: 18000,
              enctype: 'multipart/form-data',
              processData: false,
              success: function (response) {
                var progress = parseInt(response.data.upload_object.length / 100, 10);
                if (progress === 100) {
                  $('#progress').addClass('progress_bar_fixed');
                }
                $('#progress').attr('value', progress.toString());
                if (response.data.upload_object) {
                    let upload_object = {};
                    upload_object              = JSON.parse(response.data.upload_object);
                    var sanitize_upload_object = JSON.stringify(upload_object).replaceAll('"', "'"); 
                    var form_id                = $('.uploader-form-id').val().trim();
                    var upload_input_name      = $('#fileupload').attr('name');
                    if (form_id && upload_input_name) {
                      $(`#${form_id}`).append($(`<input type='hidden' class="uploader upload_object" name='upload_object' value="${sanitize_upload_object}">`));
                      $(`#${form_id}`).append($(`<input type='hidden' class="upload-input-name" name='upload-input-name' value="${upload_input_name}">`));
                    }
                }
              },
              error: function(err) {
                M.toast({html: 'Unexpected error occoured, please contact the support team!', classes: 'rounded'});
                $('#progress').attr('value', '100');
                $('#progress').addClass('progress_bar_negative progress_bar_fixed');
              },
              complete: function(result) {
                var upload_object = {};
                if (result.responseJSON.data.upload_object) {
                  upload_object = JSON.parse(result.responseJSON.data.upload_object)
                }
                
                $('#progress').attr('value', '100');
                $('#progress').addClass('progress_bar_fixed');
                $('#start_upload_process span').text('Upload completed');
                
                M.toast({html: 'File has been uploaded', classes: 'rounded _success'});
                
                $('#start_upload_process').attr('disabled', true);
                $('#uploader_status_icon').click(function (e) {
                    e.preventDefault();
                    M.toast({html: 'File has been uploaded', classes: 'rounded _success'});
                });

                if (upload_object.length === 1) {
                  $('#uploader_status_icon').fadeOut('slow');
                  $('#uploader_status_icon_reset').fadeOut('slow');
                  $('#uploader_status_icon_complete_one').fadeIn('slow');
                } else if (upload_object.length > 1) {
                  $('#uploader_status_icon').fadeOut('slow');
                  $('#uploader_status_icon_reset').fadeOut('slow');
                  $('#uploader_status_icon_complete_all').fadeIn('slow');
                }
              }
           });
           return false;
        });
      }
    })(),
    
  };
});
