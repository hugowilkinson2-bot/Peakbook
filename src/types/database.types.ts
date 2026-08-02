export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      adventures: {
        Row: { id: string; owner_id: string | null; titulo: string; fecha: string; notas: string | null; distancia: number; desnivel_positivo: number; desnivel_negativo: number; tiempo: number; dificultad: Database["public"]["Enums"]["adventure_difficulty"]; sensaciones: string | null; meteorologia: Json; created_at: string };
        Insert: { id?: string; owner_id?: string; titulo: string; fecha: string; notas?: string | null; distancia?: number; desnivel_positivo?: number; desnivel_negativo?: number; tiempo?: number; dificultad: Database["public"]["Enums"]["adventure_difficulty"]; sensaciones?: string | null; meteorologia?: Json; created_at?: string };
        Update: { id?: string; owner_id?: string; titulo?: string; fecha?: string; notas?: string | null; distancia?: number; desnivel_positivo?: number; desnivel_negativo?: number; tiempo?: number; dificultad?: Database["public"]["Enums"]["adventure_difficulty"]; sensaciones?: string | null; meteorologia?: Json; created_at?: string };
        Relationships: [];
      };
      peaks: {
        Row: { id: string; globe_id: string; nombre: string; altitud: number; latitud: number; longitud: number; provincia: string | null; pais: string; descripcion: string | null; foto_principal_url: string | null; dificultad: Database["public"]["Enums"]["adventure_difficulty"]; canonical_slug: string; source: string; source_id: string | null };
        Insert: { id?: string; globe_id?: string; nombre: string; altitud: number; latitud: number; longitud: number; provincia?: string | null; pais: string; descripcion?: string | null; foto_principal_url?: string | null; dificultad?: Database["public"]["Enums"]["adventure_difficulty"]; canonical_slug: string; source?: string; source_id?: string | null };
        Update: { id?: string; globe_id?: string; nombre?: string; altitud?: number; latitud?: number; longitud?: number; provincia?: string | null; pais?: string; descripcion?: string | null; foto_principal_url?: string | null; dificultad?: Database["public"]["Enums"]["adventure_difficulty"]; canonical_slug?: string; source?: string; source_id?: string | null };
        Relationships: [];
      };
      adventure_peaks: {
        Row: { adventure_id: string; peak_id: string; orden: number };
        Insert: { adventure_id: string; peak_id: string; orden: number };
        Update: { adventure_id?: string; peak_id?: string; orden?: number };
        Relationships: [
          { foreignKeyName: "adventure_peaks_adventure_id_fkey"; columns: ["adventure_id"]; isOneToOne: false; referencedRelation: "adventures"; referencedColumns: ["id"] },
          { foreignKeyName: "adventure_peaks_peak_id_fkey"; columns: ["peak_id"]; isOneToOne: false; referencedRelation: "peaks"; referencedColumns: ["id"] }
        ];
      };
      photos: {
        Row: { id: string; adventure_id: string; url: string; portada: boolean; descripcion: string | null; orden: number; width: number | null; height: number | null; bytes: number | null; mime_type: string | null; upload_status: "pending" | "ready" | "cleanup_required"; created_at: string };
        Insert: { id?: string; adventure_id: string; url: string; portada?: boolean; descripcion?: string | null; orden: number; width?: number | null; height?: number | null; bytes?: number | null; mime_type?: string | null; upload_status?: "pending" | "ready" | "cleanup_required"; created_at?: string };
        Update: { id?: string; adventure_id?: string; url?: string; portada?: boolean; descripcion?: string | null; orden?: number; width?: number | null; height?: number | null; bytes?: number | null; mime_type?: string | null; upload_status?: "pending" | "ready" | "cleanup_required"; created_at?: string };
        Relationships: [{ foreignKeyName: "photos_adventure_id_fkey"; columns: ["adventure_id"]; isOneToOne: false; referencedRelation: "adventures"; referencedColumns: ["id"] }];
      };
      equipment: {
        Row: { id: string; nombre: string; categoria: string; marca: string | null; modelo: string | null };
        Insert: { id?: string; nombre: string; categoria: string; marca?: string | null; modelo?: string | null };
        Update: { id?: string; nombre?: string; categoria?: string; marca?: string | null; modelo?: string | null };
        Relationships: [];
      };
      adventure_equipment: {
        Row: { adventure_id: string; equipment_id: string };
        Insert: { adventure_id: string; equipment_id: string };
        Update: { adventure_id?: string; equipment_id?: string };
        Relationships: [
          { foreignKeyName: "adventure_equipment_adventure_id_fkey"; columns: ["adventure_id"]; isOneToOne: false; referencedRelation: "adventures"; referencedColumns: ["id"] },
          { foreignKeyName: "adventure_equipment_equipment_id_fkey"; columns: ["equipment_id"]; isOneToOne: false; referencedRelation: "equipment"; referencedColumns: ["id"] }
        ];
      };
      people: {
        Row: { id: string; nombre: string };
        Insert: { id?: string; nombre: string };
        Update: { id?: string; nombre?: string };
        Relationships: [];
      };
      adventure_people: {
        Row: { adventure_id: string; person_id: string };
        Insert: { adventure_id: string; person_id: string };
        Update: { adventure_id?: string; person_id?: string };
        Relationships: [
          { foreignKeyName: "adventure_people_adventure_id_fkey"; columns: ["adventure_id"]; isOneToOne: false; referencedRelation: "adventures"; referencedColumns: ["id"] },
          { foreignKeyName: "adventure_people_person_id_fkey"; columns: ["person_id"]; isOneToOne: false; referencedRelation: "people"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      search_peaks: {
        Args: { p_query?: string; p_limit?: number };
        Returns: Database["public"]["Tables"]["peaks"]["Row"][];
      };
    };
    Enums: { adventure_difficulty: "facil" | "moderada" | "dificil" | "experta" };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
