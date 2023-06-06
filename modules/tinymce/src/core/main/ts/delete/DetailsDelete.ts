import { Arr, Fun, Optional, Type } from '@ephox/katamari';
import { Compare, SugarElement, SugarNode, Traverse } from '@ephox/sugar';

import Editor from '../api/Editor';
import * as BlockBoundary from '../caret/BlockBoundary';
import CaretPosition from '../caret/CaretPosition';

const isDetailsNode = (node: Node | null): boolean =>
  node?.nodeName === 'DETAILS';

const isSummaryNode = (node: Node | null): boolean =>
  node?.nodeName === 'SUMMARY';

const handleSummary = (editor: Editor, summaryNode: SugarElement<Node>, isDelete: boolean): Optional<() => void> => {
  // TODO: Pass in pos variable or maybe a cursor details object with isAtStart and isAtEnd properties/
  const rng = editor.selection.getRng();
  const pos = CaretPosition.fromRangeStart(rng);

  const isAtStart = BlockBoundary.isAtStartOfBlock(summaryNode, pos);
  const isAtEnd = BlockBoundary.isAtEndOfBlock(summaryNode, pos);

  if ((isAtStart && !isDelete) || (isAtEnd && isDelete)) {
    return Optional.some(Fun.noop);
  } else {
    return Optional.none();
  }
};

const handleDetails = (editor: Editor, detailsNode: SugarElement<Node>, isDelete: boolean): Optional<() => void> => {
  const selectionNode = editor.selection.getNode();
  const farthestBlock = editor.dom.getParent(selectionNode, (node) => isDetailsNode(node.parentNode));

  if (Type.isNonNullable(farthestBlock)) {
  // TODO: Pass in pos variable or maybe a cursor details object with isAtStart and isAtEnd properties/
    const rng = editor.selection.getRng();
    const pos = CaretPosition.fromRangeStart(rng);
    const farthestBlockElm = SugarElement.fromDom(farthestBlock);

    const cursorIsAtStart = BlockBoundary.isAtStartOfBlock(farthestBlockElm, pos);
    const cursorIsAtEnd = BlockBoundary.isAtEndOfBlock(farthestBlockElm, pos);
    const blockIsAtEnd = Traverse.lastChild(detailsNode).exists((child) => Compare.eq(child, farthestBlockElm));
    // Skip the summary node which will always be the first node
    const blockIsAtStart = Traverse.child(detailsNode, 1).exists((child) => Compare.eq(child, farthestBlockElm));

    if (isDelete && cursorIsAtEnd && blockIsAtEnd) {
      return Optional.some(Fun.noop);
    } else if (!isDelete && cursorIsAtStart && blockIsAtStart) {
      return Optional.some(Fun.noop);
    } else {
      return Optional.none();
    }
  } else {
    return Optional.none();
  }
};

const handleDirectlyOutsideDetails = (editor: Editor, rootBlock: SugarElement<Node>, isBefore: boolean, isDelete: boolean): Optional<() => void> => {
  // TODO: Pass in pos variable or maybe a cursor details object with isAtStart and isAtEnd properties/
  const rng = editor.selection.getRng();
  const pos = CaretPosition.fromRangeStart(rng);

  const isAtStart = BlockBoundary.isAtStartOfBlock(rootBlock, pos);
  const isAtEnd = BlockBoundary.isAtEndOfBlock(rootBlock, pos);
  const isEmpty = editor.dom.isEmpty(rootBlock.dom);

  // TODO: Check if accordion body is empty and override native behaviour
  // by deleting the empty root block and move the cursor into the accordion body

  if (isBefore && !isEmpty && isAtEnd && isDelete) {
    return Optional.some(Fun.noop);
  } else if (!isBefore && !isEmpty && isAtStart && !isDelete) {
    return Optional.some(Fun.noop);
  } else {
    return Optional.none();
  }
};

const backspaceDelete = (editor: Editor, forward: boolean): Optional<() => void> => {
  const selection = editor.selection;
  const start = selection.getStart();

  const parentBlocks = editor.dom.getParents<HTMLElement>(start, editor.dom.isBlock);
  const detailsBlockOpt = Arr.find(parentBlocks, isDetailsNode).map(SugarElement.fromDom);
  const selectionIsInDetailsBlock = detailsBlockOpt.isSome();

  if (editor.selection.isCollapsed()) {
    if (selectionIsInDetailsBlock) {
      const summaryBlockOpt = Arr.find(parentBlocks, isSummaryNode).map(SugarElement.fromDom);
      return summaryBlockOpt.fold(
        () => detailsBlockOpt.bind((detailsNode) => handleDetails(editor, detailsNode, forward)),
        (summaryNode) => handleSummary(editor, summaryNode, forward)
      );
    } else {
      const rootBlock = Arr.last(parentBlocks).map(SugarElement.fromDom);
      const isDetails = SugarNode.isTag('details');
      const prevRootBlockIsDetails = rootBlock.bind(Traverse.prevSibling).exists(isDetails);
      const nextRootBlockIsDetails = rootBlock.bind(Traverse.nextSibling).exists(isDetails);
      const prevOrNextIsDetails = prevRootBlockIsDetails || nextRootBlockIsDetails;

      if (prevOrNextIsDetails) {
        return rootBlock.bind((block) => handleDirectlyOutsideDetails(editor, block, nextRootBlockIsDetails, forward));
      } else {
        return Optional.none();
      }
    }
  } else {
    return Optional.none();
  }
};

export {
  backspaceDelete
};
