import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BuilderState, BuilderConfig, UniversalElement, BuilderType } from '@/types/universalBuilder';

export type BuilderAction =
  | { type: 'SET_CONFIG'; payload: BuilderConfig }
  | { type: 'UPDATE_CONFIG'; payload: BuilderConfig }
  | { type: 'SET_BUILDER_TYPE'; payload: BuilderType }
  | { type: 'ADD_ELEMENT'; payload: UniversalElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<UniversalElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'REORDER_ELEMENTS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' };

const initialState: BuilderState = {
  config: {
    name: '',
    description: '',
    type: 'form',
    elements: [],
    settings: {},
  },
  selectedElementId: null,
  draggedElement: null,
  isPreviewMode: false,
  history: [],
  historyIndex: -1,
};

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_CONFIG':
      return {
        ...state,
        config: action.payload,
        selectedElementId: null,
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: action.payload,
      };

    case 'SET_BUILDER_TYPE':
      return {
        ...state,
        config: {
          ...state.config,
          type: action.payload,
          elements: [], // Clear elements when switching types
        },
        selectedElementId: null,
      };

    case 'ADD_ELEMENT':
      const newElements = [...state.config.elements, action.payload];
      return {
        ...state,
        config: {
          ...state.config,
          elements: newElements,
        },
        selectedElementId: action.payload.id,
      };

    case 'UPDATE_ELEMENT':
      const updatedElements = state.config.elements.map(element =>
        element.id === action.payload.id
          ? { ...element, ...action.payload.updates } as UniversalElement
          : element
      );
      return {
        ...state,
        config: {
          ...state.config,
          elements: updatedElements,
        },
      };

    case 'DELETE_ELEMENT':
      const filteredElements = state.config.elements.filter(
        element => element.id !== action.payload
      );
      return {
        ...state,
        config: {
          ...state.config,
          elements: filteredElements,
        },
        selectedElementId: state.selectedElementId === action.payload ? null : state.selectedElementId,
      };

    case 'REORDER_ELEMENTS':
      const { oldIndex, newIndex } = action.payload;
      const reorderedElements = [...state.config.elements];
      const [movedElement] = reorderedElements.splice(oldIndex, 1);
      reorderedElements.splice(newIndex, 0, movedElement);
      
      // Update positions
      const repositionedElements = reorderedElements.map((element, index) => ({
        ...element,
        position: index,
      }));

      return {
        ...state,
        config: {
          ...state.config,
          elements: repositionedElements,
        },
      };

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElementId: action.payload,
        isPreviewMode: false,
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedElementId: action.payload ? null : state.selectedElementId,
      };

    case 'SAVE_STATE':
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ ...state.config });
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        return {
          ...state,
          config: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
          selectedElementId: null,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          config: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
          selectedElementId: null,
        };
      }
      return state;

    default:
      return state;
  }
}

const BuilderContext = createContext<{
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
} | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}