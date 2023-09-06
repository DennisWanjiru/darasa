export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      category: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      class: {
        Row: {
          category_id: string;
          code: string;
          created_at: string;
          description: string | null;
          end_date: string;
          id: string;
          instructor_id: string;
          name: string;
          start_date: string;
          thumbnail: string | null;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          code: string;
          created_at?: string;
          description?: string | null;
          end_date: string;
          id?: string;
          instructor_id: string;
          name: string;
          start_date: string;
          thumbnail?: string | null;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          code?: string;
          created_at?: string;
          description?: string | null;
          end_date?: string;
          id?: string;
          instructor_id?: string;
          name?: string;
          start_date?: string;
          thumbnail?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "class_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "class_instructor_id_fkey";
            columns: ["instructor_id"];
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      enrollment: {
        Row: {
          class_id: string;
          enrolled_at: string;
          id: string;
          student_id: string;
        };
        Insert: {
          class_id: string;
          enrolled_at?: string;
          id?: string;
          student_id: string;
        };
        Update: {
          class_id?: string;
          enrolled_at?: string;
          id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollment_class_id_fkey";
            columns: ["class_id"];
            referencedRelation: "class";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollment_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      grade: {
        Row: {
          class_id: string;
          created_at: string;
          grade: number;
          id: string;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          class_id: string;
          created_at?: string;
          grade: number;
          id?: string;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          class_id?: string;
          created_at?: string;
          grade?: number;
          id?: string;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "grade_class_id_fkey";
            columns: ["class_id"];
            referencedRelation: "class";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "grade_student_id_fkey";
            columns: ["student_id"];
            referencedRelation: "profile";
            referencedColumns: ["id"];
          }
        ];
      };
      major: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          email: string;
          id: string;
          major_id: string | null;
          name: string;
          prefix: string | null;
          role_id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          major_id?: string | null;
          name: string;
          prefix?: string | null;
          role_id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          major_id?: string | null;
          name?: string;
          prefix?: string | null;
          role_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_major_id_fkey";
            columns: ["major_id"];
            referencedRelation: "major";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_role_id_fkey";
            columns: ["role_id"];
            referencedRelation: "role";
            referencedColumns: ["id"];
          }
        ];
      };
      role: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string;
        };
        Returns: Record<string, unknown>;
      };
      delete_storage_object: {
        Args: {
          bucket: string;
          object: string;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
