"use client";

import { withProps } from "@udecode/cn";
import { serializeHtml } from "@udecode/plate-serializer-html";
import {
  createPlugins,
  Plate,
  RenderAfterEditable,
  PlateLeaf,
  createPlateEditor,
  TElement,
} from "@udecode/plate-common";
import {
  createParagraphPlugin,
  ELEMENT_PARAGRAPH,
} from "@udecode/plate-paragraph";
import {
  createHeadingPlugin,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from "@udecode/plate-heading";
import {
  createBlockquotePlugin,
  ELEMENT_BLOCKQUOTE,
} from "@udecode/plate-block-quote";
import {
  createCodeBlockPlugin,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
} from "@udecode/plate-code-block";
import {
  createHorizontalRulePlugin,
  ELEMENT_HR,
} from "@udecode/plate-horizontal-rule";
import { createLinkPlugin, ELEMENT_LINK } from "@udecode/plate-link";
import {
  createImagePlugin,
  ELEMENT_IMAGE,
  createMediaEmbedPlugin,
  ELEMENT_MEDIA_EMBED,
} from "@udecode/plate-media";
import {
  createExcalidrawPlugin,
  ELEMENT_EXCALIDRAW,
} from "@udecode/plate-excalidraw";
import { createTogglePlugin, ELEMENT_TOGGLE } from "@udecode/plate-toggle";
import {
  createColumnPlugin,
  ELEMENT_COLUMN_GROUP,
  ELEMENT_COLUMN,
} from "@udecode/plate-layout";
import { createCaptionPlugin } from "@udecode/plate-caption";
import {
  createMentionPlugin,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
} from "@udecode/plate-mention";
import {
  createTablePlugin,
  ELEMENT_TABLE,
  ELEMENT_TR,
  ELEMENT_TD,
  ELEMENT_TH,
} from "@udecode/plate-table";
import { createTodoListPlugin, ELEMENT_TODO_LI } from "@udecode/plate-list";
import {
  createBoldPlugin,
  MARK_BOLD,
  createItalicPlugin,
  MARK_ITALIC,
  createUnderlinePlugin,
  MARK_UNDERLINE,
  createStrikethroughPlugin,
  MARK_STRIKETHROUGH,
  createCodePlugin,
  MARK_CODE,
  createSubscriptPlugin,
  MARK_SUBSCRIPT,
  createSuperscriptPlugin,
  MARK_SUPERSCRIPT,
} from "@udecode/plate-basic-marks";
import {
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createFontSizePlugin,
} from "@udecode/plate-font";
import {
  createHighlightPlugin,
  MARK_HIGHLIGHT,
} from "@udecode/plate-highlight";
import { createKbdPlugin, MARK_KBD } from "@udecode/plate-kbd";
import { createAlignPlugin } from "@udecode/plate-alignment";
import { createIndentPlugin } from "@udecode/plate-indent";
import { createIndentListPlugin } from "@udecode/plate-indent-list";
import { createLineHeightPlugin } from "@udecode/plate-line-height";
import { createAutoformatPlugin } from "@udecode/plate-autoformat";
import { createBlockSelectionPlugin } from "@udecode/plate-selection";
import { createComboboxPlugin } from "@udecode/plate-combobox";
import { createDndPlugin } from "@udecode/plate-dnd";
import { createEmojiPlugin } from "@udecode/plate-emoji";
import {
  createExitBreakPlugin,
  createSoftBreakPlugin,
} from "@udecode/plate-break";
import { createNodeIdPlugin } from "@udecode/plate-node-id";
import { createResetNodePlugin } from "@udecode/plate-reset-node";
import { createDeletePlugin } from "@udecode/plate-select";
import { createTabbablePlugin } from "@udecode/plate-tabbable";
import { createTrailingBlockPlugin } from "@udecode/plate-trailing-block";
import {
  createCommentsPlugin,
  CommentsProvider,
  MARK_COMMENT,
} from "@udecode/plate-comments";
import { createDeserializeDocxPlugin } from "@udecode/plate-serializer-docx";
import { createDeserializeCsvPlugin } from "@udecode/plate-serializer-csv";
import { createDeserializeMdPlugin } from "@udecode/plate-serializer-md";
import { createJuicePlugin } from "@udecode/plate-juice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { BlockquoteElement } from "@/app/_components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/app/_components/plate-ui/code-block-element";
import { CodeLineElement } from "@/app/_components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/app/_components/plate-ui/code-syntax-leaf";
import { ExcalidrawElement } from "@/app/_components/plate-ui/excalidraw-element";
import { HrElement } from "@/app/_components/plate-ui/hr-element";
import { ImageElement } from "@/app/_components/plate-ui/image-element";
import { LinkElement } from "@/app/_components/plate-ui/link-element";
import { LinkFloatingToolbar } from "@/app/_components/plate-ui/link-floating-toolbar";
import { ToggleElement } from "@/app/_components/plate-ui/toggle-element";
import { ColumnGroupElement } from "@/app/_components/plate-ui/column-group-element";
import { ColumnElement } from "@/app/_components/plate-ui/column-element";
import { HeadingElement } from "@/app/_components/plate-ui/heading-element";
import { MediaEmbedElement } from "@/app/_components/plate-ui/media-embed-element";
import { MentionElement } from "@/app/_components/plate-ui/mention-element";
import { MentionInputElement } from "@/app/_components/plate-ui/mention-input-element";
import { MentionCombobox } from "@/app/_components/plate-ui/mention-combobox";
import { ParagraphElement } from "@/app/_components/plate-ui/paragraph-element";
import { TableElement } from "@/app/_components/plate-ui/table-element";
import { TableRowElement } from "@/app/_components/plate-ui/table-row-element";
import {
  TableCellElement,
  TableCellHeaderElement,
} from "@/app/_components/plate-ui/table-cell-element";
import { TodoListElement } from "@/app/_components/plate-ui/todo-list-element";
import { CodeLeaf } from "@/app/_components/plate-ui/code-leaf";
import { CommentLeaf } from "@/app/_components/plate-ui/comment-leaf";
import { CommentsPopover } from "@/app/_components/plate-ui/comments-popover";
import { HighlightLeaf } from "@/app/_components/plate-ui/highlight-leaf";
import { KbdLeaf } from "@/app/_components/plate-ui/kbd-leaf";
import { Editor } from "@/app/_components/plate-ui/editor";
import { FixedToolbar } from "@/app/_components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/app/_components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/app/_components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/app/_components/plate-ui/floating-toolbar-buttons";
import { withPlaceholders } from "@/app/_components/plate-ui/placeholder";
import { withDraggables } from "@/app/_components/plate-ui/with-draggables";
import React, { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { createPlateUI } from "@/lib/create-plate-ui";
// import { EmojiCombobox } from '@/app/_components/plate-ui/emoji-combobox';

const plugins = createPlugins(
  [
    
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHorizontalRulePlugin(),
    createLinkPlugin({
      renderAfterEditable: LinkFloatingToolbar as RenderAfterEditable,
    }),
    createImagePlugin(),
    createExcalidrawPlugin(),
    createTogglePlugin(),
    createColumnPlugin(),
    createMediaEmbedPlugin(),
    createCaptionPlugin({
      options: {
        pluginKeys: [
          // ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED
        ],
      },
    }),
    createMentionPlugin(),
    createTablePlugin(),
    createTodoListPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createSubscriptPlugin(),
    createSuperscriptPlugin(),
    createFontColorPlugin(),
    createFontBackgroundColorPlugin(),
    createFontSizePlugin(),
    createHighlightPlugin(),
    createKbdPlugin(),
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
          ],
        },
      },
    }),
    createIndentPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
          ],
        },
      },
    }),
    createIndentListPlugin({
      inject: {
        props: {
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
          ],
        },
      },
    }),
    createLineHeightPlugin({
      inject: {
        props: {
          defaultNodeValue: 1.5,
          validNodeValues: [1, 1.2, 1.5, 2, 3],
          validTypes: [
            ELEMENT_PARAGRAPH,
            // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
          ],
        },
      },
    }),
    createAutoformatPlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/autoformat
        ],
        enableUndoOnDelete: true,
      },
    }),
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createComboboxPlugin(),
    createDndPlugin({
      options: { enableScroller: true },
    }),
    // createEmojiPlugin({
    //   // renderAfterEditable: EmojiCombobox,
    // }),
    createExitBreakPlugin({
      options: {
        rules: [
          {
            hotkey: "mod+enter",
          },
          {
            hotkey: "mod+shift+enter",
            before: true,
          },
          {
            hotkey: "enter",
            query: {
              start: true,
              end: true,
              // allow: KEYS_HEADING,
            },
            relative: true,
            level: 1,
          },
        ],
      },
    }),
    createNodeIdPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/reset-node
        ],
      },
    }),
    createDeletePlugin(),
    createSoftBreakPlugin({
      options: {
        rules: [
          { hotkey: "shift+enter" },
          {
            hotkey: "enter",
            query: {
              allow: [
                // ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD
              ],
            },
          },
        ],
      },
    }),
    createTabbablePlugin(),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),
    createCommentsPlugin(),
    createDeserializeDocxPlugin(),
    createDeserializeCsvPlugin(),
    createDeserializeMdPlugin(),
    createJuicePlugin(),
  ],
  {
    components:createPlateUI()
  },
);




function PlateEditor() {
  const editor = createPlateEditor({ plugins });
console.log(editor)

    const html = serializeHtml(editor, {
      nodes:editor.children,
      dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
    });
  const [content, setContent] = useState<TElement[]>();
  const [value] = useDebounce(content, 1000);

  return (
    <DndProvider backend={HTML5Backend}>
      <CommentsProvider users={{}} myUserId="1">
        <Plate
          plugins={plugins}
          editor={editor}
          onChange={(e) => {
            setContent(e)
          }}
          value={value}
          // initialValue={initialValue}
        >
          <button type='button' >fdsfdsds</button>
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <Editor className="bg-transparent" />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>
          <MentionCombobox items={[]} />
          <CommentsPopover />
        </Plate>
      </CommentsProvider>
    </DndProvider>
  );
}

export default React.memo(PlateEditor);