export interface ScriptNote {
  id?: number;
  title: string;
  descriptions: DescriptionScriptNote[];
  isCollapsed?: boolean;
  isEditing: boolean;
}

interface DescriptionScriptNote {
  id?: number;
  description: string;
  position: number;
}
