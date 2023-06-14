import { useCallback, useLayoutEffect, useState } from "react";

type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;

function roundValues(_rect: ClientRect) {
  const rect = {
    ..._rect,
  };
  for (const key of Object.keys(rect)) {
    // @ts-ignore
    rect[key] = Math.round(rect[key]);
  }
  return rect;
}

function shallowDiff(prev: any, next: any) {
  if (prev != null && next != null) {
    for (const key of Object.keys(next)) {
      if (prev[key] != next[key]) {
        return true;
      }
    }
  } else if (prev != next) {
    return true;
  }
  return false;
}

type Context = {
  text: string;
  start: number;
  end: number;
};

type TextSelectionState = {
  clientRect?: ClientRect;
  isCollapsed?: boolean;
  textContent?: string;
  context?: Context;
};

const defaultState: TextSelectionState = {};

/**
 * useTextSelection(ref)
 *
 * @description
 * hook to get information about the current text selection
 *
 */
export function useTextSelection(target?: HTMLElement) {
  const [{ context, clientRect, isCollapsed, textContent }, setState] =
    useState<TextSelectionState>(defaultState);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const handler = useCallback(() => {
    let newRect: ClientRect;
    const selection = window.getSelection();
    let newState: TextSelectionState = {};

    if (selection == null || !selection.rangeCount) {
      setState(newState);
      return;
    }

    const range = selection.getRangeAt(0);
    newState.context = {
      text: range.startContainer.textContent,
      start: range.startOffset,
      end: range.endOffset,
    };

    if (target != null && !target.contains(range.commonAncestorContainer)) {
      setState(newState);
      return;
    }

    if (range == null) {
      setState(newState);
      return;
    }

    const contents = range.cloneContents();

    if (contents.textContent != null) {
      newState.textContent = contents.textContent;
    }

    const rects = range.getClientRects();

    if (rects.length === 0 && range.commonAncestorContainer != null) {
      const el = range.commonAncestorContainer as HTMLElement;
      newRect = roundValues(el.getBoundingClientRect().toJSON());
    } else {
      if (rects.length < 1) return;
      newRect = roundValues(rects[0].toJSON());
    }
    if (shallowDiff(clientRect, newRect)) {
      newState.clientRect = newRect;
    }
    newState.isCollapsed = range.collapsed;

    setState(newState);
  }, [target]);

  useLayoutEffect(() => {
    document.addEventListener("selectionchange", handler);
    document.addEventListener("keydown", handler);
    document.addEventListener("keyup", handler);
    window.addEventListener("resize", handler);

    return () => {
      document.removeEventListener("selectionchange", handler);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("keyup", handler);
      window.removeEventListener("resize", handler);
    };
  }, [target]);

  return {
    clientRect,
    isCollapsed,
    context,
    textContent,
  };
}
