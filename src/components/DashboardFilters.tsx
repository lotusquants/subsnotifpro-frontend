import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField,
  
  Stack,
  Paper,
  IconButton,
  Tooltip,
  
  Collapse,
  Typography,
  
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { FilterList, Clear, Search, Add, Close } from '@mui/icons-material';


type FilterField = 'platformUserID' | 'platform' | 'status' | 'planType' | 'startDate' | 'renewalDate';
type FilterCondition = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'before' | 'after';

interface FilterRule {
  field: FilterField;
  condition: FilterCondition;
  value: string;
  id: string;
}

interface DashboardFiltersProps {
  onFilter: (filters: any) => void;
  loading: boolean;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFilter, loading }) => {
  const [userIds, setUserIds] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [newFilter, setNewFilter] = useState<Partial<FilterRule>>({
    field: 'platformUserID',
    condition: 'contains'
  });

  const fieldOptions: { value: FilterField; label: string }[] = [
    { value: 'platformUserID', label: 'User ID' },
    { value: 'platform', label: 'Platform' },
    { value: 'status', label: 'Status' },
    { value: 'planType', label: 'Plan Type' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'renewalDate', label: 'Renewal Date' },
  ];

  const conditionOptions: Record<FilterField, { value: FilterCondition; label: string }[]> = {
    platformUserID: [
      { value: 'contains', label: 'contains' },
      { value: 'equals', label: 'equals' },
      { value: 'startsWith', label: 'starts with' },
      { value: 'endsWith', label: 'ends with' },
    ],
    platform: [
      { value: 'equals', label: 'is' },
    ],
    status: [
      { value: 'equals', label: 'is' },
    ],
    planType: [
      { value: 'equals', label: 'is' },
    ],
    startDate: [
      { value: 'before', label: 'before' },
      { value: 'after', label: 'after' },
    ],
    renewalDate: [
      { value: 'before', label: 'before' },
      { value: 'after', label: 'after' },
    ],
  };

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.condition && newFilter.value) {
      setFilters([...filters, {
        ...newFilter as FilterRule,
        id: Math.random().toString(36).substring(2, 9)
      }]);
      setNewFilter({
        field: 'platformUserID',
        condition: 'contains'
      });
    }
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filterParams: Record<string, any> = {
      platformUserIDs: userIds ? userIds.split(',').map(id => id.trim()).filter(id => id) : undefined,
    };
  
    // Process advanced filters
    filters.forEach(filter => {
      switch (filter.field) {
        case 'platform':
          filterParams.platforms = [...(filterParams.platforms || []), filter.value];
          break;
        case 'status':
          filterParams.statuses = [...(filterParams.statuses || []), filter.value];
          break;
        case 'planType':
          filterParams.planTypes = [...(filterParams.planTypes || []), filter.value];
          break;
        case 'startDate':
          if (filter.condition === 'after') {
            filterParams.dateFrom = new Date(filter.value);
          } else if (filter.condition === 'before') {
            filterParams.dateTo = new Date(filter.value);
          }
          break;
        case 'renewalDate':
          if (filter.condition === 'after') {
            filterParams.dateFrom = new Date(filter.value);
          } else if (filter.condition === 'before') {
            filterParams.dateTo = new Date(filter.value);
          }
          break;
        case 'platformUserID':
          filterParams.platformUserIDs = [...(filterParams.platformUserIDs || []), filter.value];
          break;
      }
    });
  
    onFilter(filterParams);
  };

  const handleReset = () => {
    setUserIds('');
    setFilters([]);
    setNewFilter({
      field: 'platformUserID',
      condition: 'contains'
    });
    onFilter({});
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <TextField
            label="Search user IDs"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            placeholder="Comma separated IDs"
          />
          
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            startIcon={<Search />}
          >
            Search
          </Button>
          
          <Tooltip title="Advanced filters">
            <IconButton 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              color={showAdvancedFilters ? 'primary' : 'default'}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
          
          <Button 
            variant="outlined" 
            onClick={handleReset}
            disabled={loading}
            startIcon={<Clear />}
          >
            Clear
          </Button>
        </Stack>
        
        <Collapse in={showAdvancedFilters}>
          <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>Advanced Filters</Typography>
            
            {filters.length > 0 && (
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.map(filter => (
                    <Chip
                    key={filter.id}
                    label={`${fieldOptions.find(f => f.value === filter.field)?.label} ${
                        conditionOptions[filter.field].find(c => c.value === filter.condition)?.label
                    } ${filter.value}`}
                    onDelete={() => handleRemoveFilter(filter.id)}
                    deleteIcon={<Close />}
                    sx={{ m: 0.5 }}
                    />
                ))}
                </Box>
            </Box>
            )}
            
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Field</InputLabel>
                <Select
                  value={newFilter.field || 'platformUserID'}
                  onChange={(e) => setNewFilter({
                    ...newFilter,
                    field: e.target.value as FilterField,
                    condition: conditionOptions[e.target.value as FilterField][0].value
                  })}
                  label="Field"
                >
                  {fieldOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={newFilter.condition || 'contains'}
                  onChange={(e) => setNewFilter({
                    ...newFilter,
                    condition: e.target.value as FilterCondition
                  })}
                  label="Condition"
                >
                  {conditionOptions[newFilter.field || 'platformUserID'].map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {['startDate', 'renewalDate'].includes(newFilter.field || '') ? (
                <DatePicker
                  label="Value"
                  value={newFilter.value ? new Date(newFilter.value) : null}
                  onChange={(date) => setNewFilter({
                    ...newFilter,
                    value: date?.toISOString() || ''
                  })}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 150 }
                    }
                  }}
                />
              ) : (
                <TextField
                  label="Value"
                  value={newFilter.value || ''}
                  onChange={(e) => setNewFilter({
                    ...newFilter,
                    value: e.target.value
                  })}
                  size="small"
                  sx={{ minWidth: 150 }}
                />
              )}
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddFilter}
                disabled={!newFilter.value}
              >
                Add Filter
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default DashboardFilters;