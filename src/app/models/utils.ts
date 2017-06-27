export interface ObjectEx extends Object {
  id:string;
}

export interface ObjectMap<T extends ObjectEx> {
  [id: string]: T;
}

