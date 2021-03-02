/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import AddOnManager from './AddOnManager';

export enum NodeType {
  Block,
  Inline,
  Text
}

export type ModelPath = Array<number>;
export interface ModelPoint {
  path: ModelPath;
  offset: number;
}
export interface ModelRange {
  anchor: ModelPoint;
  focus: ModelPoint;
}

export type Location = 'selection' | ModelPath | ModelPoint | ModelRange;

export interface ModelNode {
  readonly type: NodeType;
}

export interface ModelElement extends ModelNode {
  readonly name: string;
  readonly attributes: Record<string, string>;
  readonly children: Array<ModelNode>;
}

export interface ModelBlock extends ModelElement {
  readonly type: NodeType.Block;
}

export interface ModelInline extends ModelElement {
  readonly type: NodeType.Inline;
}

export interface ModelText extends ModelNode {
  readonly type: NodeType.Text;
  readonly value: string;
}

export interface SetNodeOptions {
  at?: Location;
  match: (node: ModelNode) => boolean;
}

export interface RemoveNodeOptions {
  at?: Location;
  match: (node: ModelNode) => boolean;
}

export interface Model {
  getNodes: (at?: Location) => Array<ModelNode>;
  setNodes: (options: SetNodeOptions, attributes: Record<string, string>, at?: Location) => void;
  removeNodes: (options: RemoveNodeOptions, at?: Location) => void;
}

type ModelManager = AddOnManager<Model>;
const ModelManager: ModelManager = AddOnManager.ModelManager;

export default ModelManager;

// helper methods that should go in a central helper module
export const isElement = (node: ModelNode): node is ModelElement => {
  return node.type === NodeType.Block || node.type === NodeType.Inline;
};

export const isImage = (node: ModelNode): node is ModelInline => {
  return isElement(node) && node.name === 'img';
};