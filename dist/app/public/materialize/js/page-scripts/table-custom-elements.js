(function ($) {
  $(document).ready(function(){

    var data =
      [["1","Tiger Nixon","System Architect",'<span class="new badge" data-badge-caption="">Edinburgh</span>',"5421","2011/04/25","$320,800"],
       ["2","Garrett Winters","Accountant",'<span class="new badge green" data-badge-caption="">Tokyo</span>',"8422","2011/07/25","$170,750"],
       ["3","Ashton Cox","Junior Technical Author",'<span class="new badge blue" data-badge-caption="">San Francisco</span>',"1562","2009/01/12","$86,000"],
       ["4","Cedric Kelly","Senior Javascript Developer",'<span class="new badge" data-badge-caption="">Edinburgh</span>',"6224","2012/03/29","$433,060"],
       ["5","Airi Satou","Accountant",'<span class="new badge green" data-badge-caption="">Tokyo</span>',"5407","2008/11/28","$162,700"],
       ["6","Brielle Williamson","Integration Specialist",'<span class="new badge orange" data-badge-caption="">New York</span>',"4804","2012/12/02","$372,000"],
       ["7","Herrod Chandler","Sales Assistant",'<span class="new badge blue" data-badge-caption="">San Francisco</span>',"9608","2012/08/06","$137,500"],
       ["8","Rhona Davidson","Integration Specialist",'<span class="new badge green" data-badge-caption="">Tokyo</span>',"6200","2010/10/14","$327,900"],
       ["9","Colleen Hurst","Javascript Developer",'<span class="new badge blue" data-badge-caption="">San Francisco</span>',"2360","2009/09/15","$205,500"],
       ["10","Sonya Frost","Software Engineer",'<span class="new badge" data-badge-caption="">Edinburgh</span>',"1667","2008/12/13","$103,600"],
       ["11","Jena Gaines","Office Manager",'<span class="new badge red" data-badge-caption="">London</span>',"3814","2008/12/19","$90,560"],
       ["12","Quinn Flynn","Support Lead",'<span class="new badge" data-badge-caption="">Edinburgh</span>',"9497","2013/03/03","$342,000"],
       ["13","Charde Marshall","Regional Director",'<span class="new badge blue" data-badge-caption="">San Francisco</span>',"6741","2008/10/16","$470,600"],
       ["14","Haley Kennedy","Senior Marketing Designer",'<span class="new badge red" data-badge-caption="">London</span>',"3597","2012/12/18","$313,500"]];

    var tableCustomElements = $('#table-custom-elements');
    if (tableCustomElements.length) {
      var table = tableCustomElements.DataTable({
        'data': data,
        'columnDefs': [{
           'targets': 0,
           'searchable':false,
           'orderable':false,
           'className': 'dataTables-checkbox-column',
           'render': function (data, type, full, meta){
               return '<label><input class="filled-in" type="checkbox" name="id[]" value="'
                  + $('<div/>').text(data).html() + '"><span></span></label>';
           }
        }],
        'language': {
          'search': '',
          'searchPlaceholder': 'Enter search term'
        },
        'order': [3, 'asc'],
        'dom': 'ft<"footer-wrapper"l<"paging-info"ip>>',
        'scrollY': '400px',
        'scrollCollapse': true,
        'pagingType': 'full',
        'drawCallback': function( settings ) {
          var api = this.api();

          // Add waves to pagination buttons
          $(api.table().container()).find('.paginate_button').addClass('waves-effect');

          api.table().columns.adjust();
        }
      });

      $('#table-custom-elements_wrapper').on('change', 'input[type=checkbox]', function(e) {
        var parentTR = $(this).parentsUntil('table').closest('tr');
        parentTR.toggleClass('selected', this.checked);
      });

      // Handle click on "Select all" control
      $('#table-custom-elements_wrapper').find('.select-all').on('click', function(){
        // Check/uncheck all checkboxes in the table
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows)
          .prop('checked', this.checked)
        $(rows).toggleClass('selected', this.checked);
      });
    }


  });
}( jQuery ));
