/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import Tools from 'tinymce/core/api/util/Tools';
import { getToolbar } from '../api/Settings';
import { Editor } from 'tinymce/core/api/Editor';
import { Node } from '@ephox/dom-globals';

const each = Tools.each;

const addButtons = (editor: Editor) => {
  const menuItems = [];
  each('inserttable tableprops deletetable | cell row column'.split(' '), (name) => {
    if (name === '|') {
      menuItems.push({ text: '-' });
    } else {
      menuItems.push(editor.menuItems[name]);
    }
  });

  // TODO: tricky menubutton type of buttons
  // editor.ui.registry.addButton('table', {
  //   text: 'Table',
  //   icon: 'table',
  //   onAction: () => {
  //   // open the menu thingy
  //   }
  // });

  const cmd = (command) => () => editor.execCommand(command);

  editor.ui.registry.addButton('tableprops', {
    tooltip: 'Table properties',
    onAction: cmd('mceTableProps'),
    icon: 'table'
  });

  editor.ui.registry.addButton('tabledelete', {
    tooltip: 'Delete table',
    onAction: cmd('mceTableDelete'),
    icon: 'table-delete-table'
  });

  editor.ui.registry.addButton('tablecellprops', {
    tooltip: 'Cell properties',
    onAction: cmd('mceTableCellProps'),
    icon: 'table-cell-properties'
  });

  editor.ui.registry.addButton('tablemergecells', {
    tooltip: 'Merge cells',
    onAction: cmd('mceTableMergeCells'),
    icon: 'table-merge-cells'
  });

  editor.ui.registry.addButton('tablesplitcells', {
    tooltip: 'Split cell',
    onAction: cmd('mceTableSplitCells'),
    icon: 'table-split-cells'
  });

  editor.ui.registry.addButton('tableinsertrowbefore', {
    tooltip: 'Insert row before',
    onAction: cmd('mceTableInsertRowBefore'),
    icon: 'table-insert-row-above'
  });

  editor.ui.registry.addButton('tableinsertrowafter', {
    tooltip: 'Insert row after',
    onAction: cmd('mceTableInsertRowAfter'),
    icon: 'table-insert-row-after'
  });

  editor.ui.registry.addButton('tabledeleterow', {
    tooltip: 'Delete row',
    onAction: cmd('mceTableDeleteRow'),
    icon: 'table-delete-row'
  });

  editor.ui.registry.addButton('tablerowprops', {
    tooltip: 'Row properties',
    onAction: cmd('mceTableRowProps'),
    icon: 'table-row-properties'
  });

  editor.ui.registry.addButton('tableinsertcolbefore', {
    tooltip: 'Insert column before',
    onAction: cmd('mceTableInsertColBefore'),
    icon: 'table-insert-column-before'
  });

  editor.ui.registry.addButton('tableinsertcolafter', {
    tooltip: 'Insert column after',
    onAction: cmd('mceTableInsertColAfter'),
    icon: 'table-insert-column-after'
  });

  editor.ui.registry.addButton('tabledeletecol', {
    tooltip: 'Delete column',
    onAction: cmd('mceTableDeleteCol'),
    icon: 'table-delete-column'
  });

  // TODO: THESE CAN BE DEPRECATED?? Not documented, don't have icons.
  editor.ui.registry.addButton('tablecutrow', {
    tooltip: 'Cut row',
    onAction: cmd('mceTableCutRow'),
    icon: 'temporary-placeholder'
  });

  editor.ui.registry.addButton('tablecopyrow', {
    tooltip: 'Copy row',
    onAction: cmd('mceTableCopyRow'),
    icon: 'temporary-placeholder'
  });

  editor.ui.registry.addButton('tablepasterowbefore', {
    tooltip: 'Paste row before',
    onAction: cmd('mceTablePasteRowBefore'),
    icon: 'temporary-placeholder'
  });

  editor.ui.registry.addButton('tablepasterowafter', {
    tooltip: 'Paste row after',
    onAction: cmd('mceTablePasteRowAfter'),
    icon: 'temporary-placeholder'
  });
};

const addToolbars = (editor: Editor) => {
  const isTable = (table: Node) => {
    const selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);

    return selectorMatched;
  };

  const toolbar = getToolbar(editor);
  if (toolbar.length > 0) {
    editor.ui.registry.addContextToolbar('table', {
      predicate: isTable,
      items: toolbar,
      scope: 'node',
      position: 'node'
    });
  }
};

export default {
  addButtons,
  addToolbars
};