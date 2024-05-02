import { withProps } from '@udecode/cn';
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
} from '@udecode/plate-code-block';
import { MARK_COMMENT } from '@udecode/plate-comments';
import {
  PlateElement,
  PlateLeaf,
  PlatePluginComponent,
} from '@udecode/plate-common';
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw';
// import { MARK_SEARCH_HIGHLIGHT } from '@udecode/plate-find-replace';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
import { MARK_HIGHLIGHT } from '@udecode/plate-highlight';
import { ELEMENT_HR } from '@udecode/plate-horizontal-rule';
import { MARK_KBD } from '@udecode/plate-kbd';
import { ELEMENT_COLUMN, ELEMENT_COLUMN_GROUP } from '@udecode/plate-layout';
import { ELEMENT_LINK } from '@udecode/plate-link';
import {
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
} from '@udecode/plate-list';
import { ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate-media';
import { ELEMENT_MENTION, ELEMENT_MENTION_INPUT } from '@udecode/plate-mention';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
// import { ELEMENT_SLASH_INPUT } from '@udecode/plate-slash-command';
import {
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TH,
  ELEMENT_TR,
} from '@udecode/plate-table';
import { ELEMENT_TOGGLE } from '@udecode/plate-toggle';

import { BlockquoteElement } from '@/app/_components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/app/_components/plate-ui/code-block-element';
import { CodeLeaf } from '@/app/_components/plate-ui/code-leaf';
import { CodeLineElement } from '@/app/_components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/app/_components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/app/_components/plate-ui/column-element';
import { ColumnGroupElement } from '@/app/_components/plate-ui/column-group-element';
import { CommentLeaf } from '@/app/_components/plate-ui/comment-leaf';
import { ExcalidrawElement } from '@/app/_components/plate-ui/excalidraw-element';
import { HeadingElement } from '@/app/_components/plate-ui/heading-element';
import { HighlightLeaf } from '@/app/_components/plate-ui/highlight-leaf';
import { HrElement } from '@/app/_components/plate-ui/hr-element';
import { ImageElement } from '@/app/_components/plate-ui/image-element';
import { KbdLeaf } from '@/app/_components/plate-ui/kbd-leaf';
import { LinkElement } from '@/app/_components/plate-ui/link-element';
// import { ListElement } from '@/app/_components/plate-ui/list-element';
import { MediaEmbedElement } from '@/app/_components/plate-ui/media-embed-element';
import { MentionElement } from '@/app/_components/plate-ui/mention-element';
import { MentionInputElement } from '@/app/_components/plate-ui/mention-input-element';
import { ParagraphElement } from '@/app/_components/plate-ui/paragraph-element';
import { withPlaceholders } from '@/app/_components/plate-ui/placeholder';
// import { SearchHighlightLeaf } from '@/app/_components/plate-ui/search-highlight-leaf';
// import { SlashInputElement } from '@/app/_components/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/app/_components/plate-ui/table-cell-element';
import { TableElement } from '@/app/_components/plate-ui/table-element';
import { TableRowElement } from '@/app/_components/plate-ui/table-row-element';
import { TodoListElement } from '@/app/_components/plate-ui/todo-list-element';
import { ToggleElement } from '@/app/_components/plate-ui/toggle-element';
import { withDraggables } from '@/app/_components/plate-ui/with-draggables';

export const createPlateUI = (
  overrideByKey?: Partial<Record<string, PlatePluginComponent>>,
  {
    draggable,
    placeholder,
  }: { placeholder?: boolean; draggable?: boolean } = {}
) => {
  let components: Record<string, PlatePluginComponent> = {
    [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
    [ELEMENT_CODE_BLOCK]: CodeBlockElement,
    [ELEMENT_CODE_LINE]: CodeLineElement,
    [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
    [ELEMENT_HR]: HrElement,
    [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
    [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
    [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
    [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
    [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
    [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
    [ELEMENT_IMAGE]: ImageElement,
    [ELEMENT_LI]: withProps(PlateElement, { as: 'li' }),
    [ELEMENT_LINK]: LinkElement,
    [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
    [ELEMENT_MENTION]: MentionElement,
    [ELEMENT_MENTION_INPUT]: MentionInputElement,
    // [ELEMENT_SLASH_INPUT]: SlashInputElement,
    // [ELEMENT_UL]: withProps(ListElement, { variant: 'ul' }),
    // [ELEMENT_OL]: withProps(ListElement, { variant: 'ol' }),
    [ELEMENT_PARAGRAPH]: ParagraphElement,
    [ELEMENT_TABLE]: TableElement,
    [ELEMENT_TD]: TableCellElement,
    [ELEMENT_TH]: TableCellHeaderElement,
    [ELEMENT_TODO_LI]: TodoListElement,
    [ELEMENT_TOGGLE]: ToggleElement,
    [ELEMENT_TR]: TableRowElement,
    [ELEMENT_EXCALIDRAW]: ExcalidrawElement,
    [ELEMENT_COLUMN_GROUP]: ColumnGroupElement,
    [ELEMENT_COLUMN]: ColumnElement,
    [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
    [MARK_CODE]: CodeLeaf,
    [MARK_HIGHLIGHT]: HighlightLeaf,
    [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
    [MARK_KBD]: KbdLeaf,
    // [MARK_SEARCH_HIGHLIGHT]: SearchHighlightLeaf,
    [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
    [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: 'sub' }),
    [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: 'sup' }),
    [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
    [MARK_COMMENT]: CommentLeaf,
  };

  if (overrideByKey) {
    Object.keys(overrideByKey).forEach((key) => {
      (components as any)[key] = (overrideByKey as any)[key];
    });
  }

  if (placeholder) {
    components = withPlaceholders(components);
  }
  if (draggable) {
    components = withDraggables(components);
  }

  return components;
};
