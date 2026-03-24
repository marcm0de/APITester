export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type BodyType = 'json' | 'form-data' | 'raw';

export type AuthType = 'none' | 'bearer' | 'basic';

export interface AuthConfig {
  type: AuthType;
  bearer?: string;
  basicUser?: string;
  basicPass?: string;
}

export interface SavedRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: BodyType;
  bodyContent: string;
  auth: AuthConfig;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  requests: SavedRequest[];
  createdAt: number;
  updatedAt: number;
}

export interface HistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  statusText: string;
  duration: number;
  size: number;
  timestamp: number;
  request: {
    params: KeyValuePair[];
    headers: KeyValuePair[];
    bodyType: BodyType;
    bodyContent: string;
    auth: AuthConfig;
  };
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  size: number;
}

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvVariable[];
  isActive: boolean;
}
