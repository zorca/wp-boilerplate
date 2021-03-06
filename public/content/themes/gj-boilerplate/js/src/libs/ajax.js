/**
 * Class for forms that requires ajax.
 */
function Ajax(el) {
  this.el      = $(el);
  this.error   = $('#error');
  this.options = formOptions;
  this.output  = { status: 'success', message: 'All fields complete.', element: null };
}

Ajax.prototype.run = function() {
  var self = this;

  this.el.on('submit',function(e) {
    e.preventDefault();
    var data  = $(this).serialize();

    self.checkFields();

    if(self.output.status !== 'error') {
      $('button[type="submit"]').toggle();
      self.error.empty();
      self.error.append('<p class="message"><i class="fa fa-spin fa-spinner"></i> Sending...</p>');

      $.post(self.options.ajaxurl, {
        action : 'register',
        nonce  : self.options.nonce,
        post   : data
      },
      function(response) {
        self.successMessage(response);
        // google tag manager custom event
        if(typeof dataLayer !== 'undefined') {
          dataLayer.push({'event': 'formSubmitted'});
        }
      });
    } else {
      self.errorOutput();
    }
  });
}

Ajax.prototype.checkFields = function() {
  var self = this;
  this.clearErrors();

  this.el.find(':input').each(function() {
    var el, attr, type, value, input_name, field_name, group_checked;
    el    = $(this);
    attr  = el.attr('required');
    type  = el.attr('type');
    value = el.val();
    input_name = el.attr('name');

    if(typeof attr !== typeof undefined && attr !== false) {
      field_name = el.prev('label').text();
      field_name = field_name.replace('*', '');

      if(value === "" || value === null) {
        self.setOutput('error','<i class="fa fa-close"></i> "' + field_name + '" is required.', el);
        return false;
      }

      if(('radio' === type || 'checkbox' === type) && !el.is(':checked')) {
        group_checked = false;
        $('[name="'+input_name+'"]').each(function(){
          if ($(this).is(':checked')) {
            group_checked = true;
            return false;
          }
        });
        if (!group_checked) {
          self.setOutput('error', '<i class="fa fa-close"></i> "' + field_name + '" is required.', el);
          return false;
        }
      }

      if('email' === type && false === self.looseEmailValidate(value)) {
        self.setOutput('error', '<i class="fa fa-close"></i> Your email is not valid.', el);
        return false;
      }

      if(input_name === "zip" && value.length < 5 || input_name === "zip" && isNaN(value)) {
        self.setOutput('error', '<i class="fa fa-close"></i> Please enter a valid zip code.', el);
        return false;
      }

    } else {
      self.setOutput('success', 'All fields complete.', null);
    }
  });
};

Ajax.prototype.setOutput = function(status, message, el) {
  this.output.status  = status;
  this.output.message = message;
  this.output.element = el;
};

Ajax.prototype.looseEmailValidate = function(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

Ajax.prototype.clearErrors = function() {
  $('.has-error').removeClass('has-error');
  this.error.empty();
};

Ajax.prototype.errorOutput = function() {
  this.error.append(this.output.message);
  $('input, select, .form-group').removeClass('has-error');
  if(this.output.element !== null) {
    this.output.element.closest('div.form-group').addClass('has-error');
  }
};

Ajax.prototype.successMessage = function(data) {
  var response = JSON.parse(data);

  if (response.status === 'success' && this.options.thanks) {
    $('form#register *').fadeOut(300);
    this.el.html('<p class="message"><i class="fa fa-check"></i> ' + this.options.thanks + '</p>');
  } else if (response.status === 'success') {
    $('form#register *').fadeOut(300);
    this.el.html('<p class="message"><i class="fa fa-check"></i>Your information has been received successfully.</p>');
  } else {
    this.error.empty();
    this.error.append('<i class="fa fa-close"></i>  ' + response.message);
    $('button[type="submit"]').toggle();
  }
};

export default Ajax;
