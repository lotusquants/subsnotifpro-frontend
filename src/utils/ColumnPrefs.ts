interface ColumnPreferences {
    order: string[];
    visible: string[];
  }
  
  export const loadColumnPrefs = (): ColumnPreferences | null => {
    try {
      const saved = localStorage.getItem('columnPrefs');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };
  
  export const saveColumnPrefs = (prefs: ColumnPreferences): void => {
    localStorage.setItem('columnPrefs', JSON.stringify(prefs));
  };