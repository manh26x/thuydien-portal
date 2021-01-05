export interface FeatureMenu {
  menuId?: string;
  menuURL?: string;
  menuName?: string;
  menuDescription?: string;
  menuIcon?: string;
  listRight?: FeatureAction[];
  translatedName?: string;
  canView?: boolean;
  canEdit?: boolean;
  canAdd?: boolean;
  canDel?: boolean;
  canOnOff?: boolean;
  isViewAble?: boolean;
  isEditAble?: boolean;
  isAddAble?: boolean;
  isDelAble?: boolean;
  isOnOffAble?: boolean;
}

export interface FeatureAction {
  rightId?: string;
  rightURL?: string;
  rightRequestMethod?: string;
  rightDescription?: string;
}
