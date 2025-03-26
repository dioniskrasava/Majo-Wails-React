// frontend/src/components/utils/edrTableStore.js
import { create } from 'zustand';

const useTableStore = create((set) => ({
    data: [],
    columns: [],
    columnNames: {},
    isLoading: false,
    
    // Действия
    setData: (newData) => set({ 
      data: Array.isArray(newData) ? newData : [] 
    }),
    setColumns: (columns) => set({ columns }),
    setColumnNames: (columnNames) => set({ columnNames }),
    setIsLoading: (isLoading) => set({ isLoading }),
    
    updateColumnName: (columnKey, newName) => set((state) => {
      const updatedColumnNames = {
        ...state.columnNames,
        [columnKey]: newName
      };
      
      return {
        columnNames: updatedColumnNames,
        columns: state.columns.map(col => 
          col.accessor === columnKey 
            ? { ...col, Header: newName } 
            : col
        )
      };
    })
  }));

export default useTableStore;