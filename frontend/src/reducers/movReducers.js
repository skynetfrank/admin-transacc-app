import { MOV_ADD_ITEM, MOV_ADD_ITEM_FAIL, MOV_EMPTY, MOV_REMOVE_ITEM } from '../constants/movConstants';

export const movReducer = (state = { movItems: [] }, action) => {
  switch (action.type) {
    case MOV_ADD_ITEM:
      const item = action.payload;
      const existItem = state.movItems.find(x => x.producto === item.producto);
      if (existItem) {
        return {
          ...state,
          error: '',
          movItems: state.movItems.map(x => (x.producto === existItem.producto ? item : x)),
        };
      } else {
        return { ...state, error: '', movItems: [...state.movItems, item] };
      }
    case MOV_REMOVE_ITEM:
      return {
        ...state,
        error: '',
        movItems: state.movItems.filter(x => x.producto !== action.payload),
      };

    case MOV_ADD_ITEM_FAIL:
      return { ...state, error: action.payload };
    case MOV_EMPTY:
      return { ...state, error: '', movItems: [] };
    default:
      return state;
  }
};
