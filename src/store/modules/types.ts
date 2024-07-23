import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

export interface AppState {
  device: string;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
}

export interface PermissionState {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
}

export interface SettingState {
  theme: string;
  tagsView: boolean;
  fixedHeader: boolean;
  showSettings: boolean;
  sidebarLogo: boolean;
}

export interface UserState {
  token: any;
  user: any;
  platforms: any;
  roles: string[];
  perms: string[];
  btnPerms: any[];
  isThirdLogin: any;
}

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}

export interface TagsViewState {
  visitedViews: TagView[];
  cachedViews: string[];
}
