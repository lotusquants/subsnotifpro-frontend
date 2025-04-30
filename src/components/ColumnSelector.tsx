import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Tooltip,
  List,
  ListItem
} from '@mui/material';
import { Settings, DragHandle as DragHandleIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableItem } from './SortableItem';

interface ColumnSelectorProps {
  columns: string[];
  visibleColumns: string[];
  orderedColumns: string[];
  onColumnToggle: (column: string) => void;
  onColumnOrderChange: (newOrder: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  visibleColumns,
  orderedColumns: initialOrderedColumns,
  onColumnToggle,
  onColumnOrderChange
}) => {
  const [open, setOpen] = useState(false);
  const [orderedColumns, setOrderedColumns] = useState<string[]>(initialOrderedColumns);

  useEffect(() => {
    setOrderedColumns(prev => {
      const newOrder = [...prev.filter(col => columns.includes(col))];
      columns.forEach(col => {
        if (!newOrder.includes(col)) {
          newOrder.push(col);
        }
      });
      return newOrder;
    });
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpen = () => setOpen(true);
  
  const handleClose = () => {
    onColumnOrderChange(orderedColumns);
    setOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedColumns((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, active.id as string);
        
        return newItems;
      });
    }
  };

  return (
    <>
      <Tooltip title="Configure columns">
        <IconButton onClick={handleOpen}>
          <Settings />
        </IconButton>
      </Tooltip>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Columns</DialogTitle>
        <DialogContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={orderedColumns}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {orderedColumns.map((column) => (
                  <SortableItem key={column} id={column}>
                    <ListItem sx={{ px: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'grab',
                            mr: 1,
                            touchAction: 'none'
                          }}
                        >
                          <DragHandleIcon />
                        </Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={visibleColumns.includes(column)}
                              onChange={() => onColumnToggle(column)}
                            />
                          }
                          label={column}
                          sx={{ flexGrow: 1, ml: 0 }}
                        />
                      </Box>
                    </ListItem>
                  </SortableItem>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnSelector;