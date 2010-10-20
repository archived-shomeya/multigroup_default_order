// $Id$

/**
 * Private namespace for local methods.
 */
Drupal.multigroupDefaultOrder = Drupal.multigroupDefaultOrder || {};

Drupal.behaviors.multigroupDefaultOrder = function (context) {
  $('.multigroup-default-order table.tabledrag-processed', context).each(function() {
    var table = this, tableDrag = Drupal.tableDrag[$(table).attr('id')];

    // Add a handler for when a row is dropped, update default order button.
    tableDrag.onDrop = function() {
      $('.draggable', this.table).each(function(i) {
        Drupal.multigroupDefaultOrder.buildButton(tableDrag, $(this), i);
      });
    }

    // Add default button to each row.
    $('.draggable', table).each(function(i) {
      var td = $(this).append('<td class="content-multigroup-default-order-cell"></td>');
      Drupal.multigroupDefaultOrder.buildButton(tableDrag, $(this), i);
    });
  });
}


/**
 * Builds a Set Default button or label for a draggable row.
 */
Drupal.multigroupDefaultOrder.buildButton = function(tableDrag, row, i) {
  var td = row.find('.content-multigroup-default-order-cell');
  td.empty();
  if (i == 0) {
    var label = $(Drupal.theme('multigroupDefaultOrderLabel'));
    td.append(label);
  }
  else {
    var button = $(Drupal.theme('multigroupDefaultOrderButton'));
    button.bind('click', function(event) {
      Drupal.multigroupDefaultOrder.onClick(tableDrag, row);
      return false;
    });
    td.append(button);
  }
}

/**
 * onClick handler for default order buttons.
 */
Drupal.multigroupDefaultOrder.onClick = function(tableDrag, row) {
  // Find the first row of the table
  tableDrag.rowObject = new tableDrag.row(row[0], 'keyboard', tableDrag.intentEnabled, tableDrag.maxDepth, true);
  var firstRow = $(tableDrag.rowObject.element).siblings('tr:first').get(0);

  if (firstRow) {
    tableDrag.safeBlur = false; // Do not allow the onBlur cleanup.
    tableDrag.rowObject.direction = 'up';
    keyChange = true;

    var groupHeight = 0;
    while (firstRow && $('.indentation', firstRow).size()) {
      firstRow = $(firstRow).prev('tr').get(0);
      groupHeight += $(firstRow).is(':hidden') ? 0 : firstRow.offsetHeight;
    }
    if (firstRow) {
      $(firstRow).before(tableDrag.rowObject.element);
      tableDrag.rowObject.changed = true;
      tableDrag.rowObject.onSwap(firstRow);
      // No need to check for indentation, 0 is the only valid one.
      window.scrollBy(0, -groupHeight);
    }
  }

  if (tableDrag.rowObject && tableDrag.rowObject.changed == true) {
    $(tableDrag.rowObject.element).addClass('drag');
    if (tableDrag.oldRowElement) {
      $(tableDrag.oldRowElement).removeClass('drag-previous');
    }
    tableDrag.oldRowElement = tableDrag.rowObject.element;
    tableDrag.restripeTable();
    tableDrag.onDrag();
    tableDrag.dropRow(null, tableDrag);
  }
}

/**
 *
 * Theme the multigroup default order button.
 */
Drupal.theme.prototype.multigroupDefaultOrderButton = function() {
  return '<a href="javascript:void(0)" class="content-multiplegroup-default-order-button" title="Set Default">Set Default</a>';
}

/**
 * Theme the multigroup default order label.
 */
Drupal.theme.prototype.multigroupDefaultOrderLabel = function() {
  return '<div class="content-multiroup-default-order-label">' + Drupal.t('Default') + '</div>';
}
