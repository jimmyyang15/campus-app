// import { TElement } from "@udecode/plate-common";

// const getNode = ({ element, children }:any) => {
//     switch (element.type) {
//       case BLOCKQUOTE:
//         // the plugin may have an optional parameter for the wrapping tag, default to blockquote
//         return `<blockquote>${children}</blockquote>`;
//       case PARAGRAPH:
//         return `<p>${children}</p>`;
//       case LINK:
//         return `<a href="${escapeHtml(element.url)}">${children}</a>`;
//       case HeadingType.h1:
//         return `<h1>${children}</h1>`;
//       case HeadingType.h2:
//         return `<h2>${children}</h2>`;
//       case ListType.OL:
//         return `<ol>${children}</ol>`;
//       case ListType.UL:
//         return `<ul>${children}</ul>`;
//       case ListType.LI:
//         return `<li>${children}</li>`;
//       case TableType.TABLE:
//         return `<table>${children}</table>`;
//       case TableType.TR:
//         return `<tr>${children}</tr>`;
//       case TableType.TD:
//         return `<td>${children}</td>`;
//       case IMAGE:
//         return `<img src="${escapeHtml(element.url)}">${children}</img>`;
//       default:
//         return children;
//     }
//   };
  
//   const getLeaf = ({ leaf, children }) => {
//     let newChildren = children;
//     if (leaf[MARK_BOLD]) {
//       newChildren = `<strong>${newChildren}</strong>`;
//     }
//     if (leaf[MARK_ITALIC]) {
//       newChildren = `<i>${newChildren}</i>`;
//     }
//     if (leaf[MARK_UNDERLINE]) {
//       newChildren = `<u>${newChildren}</u>`;
//     }
//     return newChildren;
//   };
  
//   // should iterate over the plugins, see htmlDeserialize
//   export const htmlSerialize = (nodes:TElement[]) =>
//     nodes
//       .map((node) => {
//         if (Text.isText(node)) {
//           return getLeaf({ leaf: node, children: node.text });
//         }
//         return getNode({ element: node, children: serialize(node.children) });
//       })
//       .join("");